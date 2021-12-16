import { ApplicationMap } from '~components/ConnectedMap/ConnectedMap';
import {
  AnyLayer,
  VectorSource,
  RasterSource,
  GeoJSONSourceRaw,
} from 'maplibre-gl';
import type {
  LogicalLayer,
  LayerLegend,
} from '~core/logical_layers/createLogicalLayerAtom';
import {
  mapCSSToMapBoxProperties,
  applyLegendConditions,
  setSourceLayer,
} from '~utils/map/mapCSSToMapBoxPropertiesConverter';
import { apiClient, notificationService } from '~core/index';
import { LAYER_IN_AREA_PREFIX, SOURCE_IN_AREA_PREFIX } from '../constants';
import {
  LayerInArea,
  LayerInAreaSource,
  LayerGeoJSONSource,
  LayerTileSource,
} from '../types';
import { FocusedGeometry } from '~core/shared_state/focusedGeometry';
import {
  addZoomFilter,
  onActiveContributorsClick,
} from './activeContributorsLayers';
import { layersOrderManager } from '~core/logical_layers/layersOrder';

export class GenericLayer implements LogicalLayer<FocusedGeometry | null> {
  public readonly id: string;
  public readonly name?: string;
  public readonly legend?: LayerLegend;
  public readonly category?: string;
  public readonly group?: string;
  public readonly description?: string;
  public readonly copyright?: string;
  public readonly boundaryRequiredForRetrieval: boolean;
  private _layerIds: string[];
  private _sourceId: string;
  private _onClickListener:
    | ((e: maplibregl.MapMouseEvent & maplibregl.EventData) => void)
    | null = null;
  private _lastGeometryUpdate:
    | GeoJSON.Feature
    | GeoJSON.FeatureCollection
    | null = null;
  private _eventId: string | null = null;

  public constructor(layer: LayerInArea) {
    this.id = layer.id;
    this.name = layer.name;
    this.category = layer.category;
    this.group = layer.group;
    this.description = layer.description;
    this.copyright = layer.copyright;
    this.boundaryRequiredForRetrieval = layer.boundaryRequiredForRetrieval;
    this.legend = layer.legend;
    /* private */
    this._layerIds = [];
    this._sourceId = SOURCE_IN_AREA_PREFIX + layer.id;
  }

  _generateLayersFromLegend(legend: LayerLegend): Omit<AnyLayer, 'id'>[] {
    if (legend.type === 'simple') {
      const layers = legend.steps
        /**
         * Layer filters method generate extra layers for legend steps, but it simple and reliably.
         * Find properties diff between steps and put expressions right into property value
         * if tou need more map performance
         * */
        .map((step) =>
          setSourceLayer(
            step,
            applyLegendConditions(step, mapCSSToMapBoxProperties(step.style)),
          ),
        );
      return layers.flat();
    }

    if (legend.type === 'bivariate') {
      throw new Error('Bivariate legend not supported yet');
    }

    /* @ts-expect-error - if backend add new legend type */
    throw new Error(`Unexpected legend type '${legend.type}'`);
  }

  _setLayersIds(layers: Omit<AnyLayer, 'id'>[]): AnyLayer[] {
    return layers.map((layer, i) => {
      const layerId = `${LAYER_IN_AREA_PREFIX + this.id}-${i}`;
      const mapLayer = { ...layer, id: layerId, source: this._sourceId };
      return mapLayer as AnyLayer;
    });
  }

  mountGeoJSONLayer(map: ApplicationMap, layer: LayerGeoJSONSource) {
    /* Create source */
    const mapSource: GeoJSONSourceRaw = {
      type: 'geojson' as const,
      data: layer.source.data,
    };
    map.addSource(this._sourceId, mapSource);

    /* Create layer */
    if (this.legend) {
      const layerStyles = this._generateLayersFromLegend(this.legend);
      const layers = this._setLayersIds(layerStyles);
      layers.forEach((mapLayer) => {
        const beforeId = layersOrderManager.getBeforeIdByType(mapLayer.type);
        map.addLayer(mapLayer, beforeId);
        this._layerIds.push(mapLayer.id);
      });
    } else {
      const layerId = `${LAYER_IN_AREA_PREFIX + this.id}`;
      this._layerIds.push(layerId);
      const mapLayer = {
        id: layerId,
        source: this._sourceId,
        type: 'fill' as const,
        paint: {
          'fill-color': 'pink' as const,
        },
      };
      const beforeId = layersOrderManager.getBeforeIdByType(mapLayer.type);
      map.addLayer(mapLayer, beforeId);
    }
  }

  _adaptUrl(url: string) {
    /** Fix cors in local development */
    if (import.meta.env.DEV) {
      url = url.replace('zigzag.kontur.io', location.host);
    }

    /**
     * Protocol fix
     * request from https to http failed in browser with "mixed content" error
     * solution: cut off protocol part and replace with current page protocol
     */
    url =
      window.location.protocol + url.replace('https:', '').replace('http:', '');

    /**
     * Some link templates use values that mapbox/maplibre do not understand
     * solution: convert to equivalents
     */
    url = url
      .replace('{bbox}', '{bbox-epsg-3857}')
      .replace('{proj}', 'EPSG:3857')
      .replace('{width}', '256')
      .replace('{height}', '256')
      .replace('{zoom}', '{z}')
      .replace('{-y}', '{y}');

    /* Some magic for remove `switch:` */
    const domains = (url.match(/{switch:(.*?)}/) || ['', ''])[1].split(',')[0];
    url = url.replace(/{switch:(.*?)}/, domains);

    return url;
  }

  /* https://docs.mapbox.com/mapbox-gl-js/style-spec/sources/#vector-scheme */
  _setTileScheme(rawUrl: string, mapSource: VectorSource | RasterSource) {
    const isTMS = rawUrl.includes('{-y}');
    if (isTMS) {
      mapSource.scheme = 'tms';
    }
  }

  mountTileLayer(map: ApplicationMap, layer: LayerTileSource) {
    /* Create source */
    const mapSource: VectorSource | RasterSource = {
      type: layer.source.type,
      tiles: layer.source.urls.map((url) => this._adaptUrl(url)),
      tileSize: layer.source.tileSize || 256,
      minzoom: layer.minZoom || 0,
      maxzoom: layer.maxZoom || 22,
    };

    // I expect that all servers provide url with same scheme
    this._setTileScheme(layer.source.urls[0], mapSource);

    map.addSource(this._sourceId, mapSource);

    /* Create layer */
    if (mapSource.type === 'raster') {
      const layerId = `${LAYER_IN_AREA_PREFIX + this.id}`;
      const mapLayer = {
        id: layerId,
        type: 'raster' as const,
        source: this._sourceId,
        minzoom: 0,
        maxzoom: 22,
      };
      const beforeId = layersOrderManager.getBeforeIdByType(mapLayer.type);
      map.addLayer(mapLayer, beforeId);
      this._layerIds.push(layerId);
    } else {
      // Vector tiles
      if (this.legend) {
        const layerStyles = this._generateLayersFromLegend(this.legend);
        const layers = this._setLayersIds(layerStyles);
        // !FIXME - Hardcoded filter for layer
        // Must be deleted after LayersDB implemented
        if (this.id === 'activeContributors') {
          addZoomFilter(layers);
        }
        layers.forEach((mapLayer) => {
          const beforeId = layersOrderManager.getBeforeIdByType(mapLayer.type);
          map.addLayer(mapLayer as AnyLayer, beforeId);
          this._layerIds.push(mapLayer.id);
        });
      } else {
        // We don't known source-layer id
        throw new Error(
          `[GenericLayer ${this.id}] Vector layers must have legend`,
        );
      }
    }
  }

  public onInit() {
    return { isVisible: true, isLoading: false };
  }

  public async willMount(map: ApplicationMap) {
    let params: {
      layerIds?: string[];
      geoJSON?: GeoJSON.GeoJSON;
      eventId?: string;
    };

    if (this.boundaryRequiredForRetrieval) {
      if (this._lastGeometryUpdate === null) {
        throw Error(`Layer ${this.id} require geometry, but geometry is null`);
      }
      params = {
        layerIds: [this.id],
        geoJSON: this._lastGeometryUpdate,
      };
    } else {
      params = {
        layerIds: [this.id],
      };
    }

    if (this._eventId) {
      params.eventId = this._eventId;
    }

    const response = await apiClient.post<LayerInAreaSource[]>(
      '/layers/details',
      params,
      false,
    );
    if (response) {
      /* Api allow us fetch bunch of layers, but here we take only one */
      const firstLayer = response[0];
      const isGeoJSONLayer = (
        layer: LayerInAreaSource,
      ): layer is LayerGeoJSONSource => layer.source.type === 'geojson';
      if (isGeoJSONLayer(firstLayer)) {
        this.mountGeoJSONLayer(map, firstLayer);
      } else {
        this.mountTileLayer(map, firstLayer);
      }

      /* Add event listener */
      if (this.legend) {
        // !FIXME - Hardcoded filter for layer
        // Must be deleted after LayersDB implemented
        if (this.id === 'activeContributors') {
          map.on('click', onActiveContributorsClick(map, this._sourceId));
          return;
        }
        const { linkProperty } = this.legend;
        if (linkProperty) {
          this._onClickListener = (e) => this.onMapClick(map, e, linkProperty);
          map.on('click', this._onClickListener);
        }
      }
    }
  }

  onDataChange(map: ApplicationMap, data: FocusedGeometry | null, state) {
    if (data === null) {
      this._lastGeometryUpdate = null;
      this._eventId = null;
      return;
    }

    const { source, geometry } = data;

    // Update geometry
    if (geometry.type === 'Feature' || geometry.type === 'FeatureCollection') {
      this._lastGeometryUpdate = geometry;
    } else {
      // TODO: Add converter from any GeoJSON to Feature or FeatureCollection
      notificationService.error({
        title: 'Not implemented yet',
        description: `${geometry.type} not supported`,
      });
    }

    // Update event id
    if (source.type === 'event') {
      this._eventId = source.meta.eventId;
    } else {
      this._eventId = null;
    }

    // Update layer data
    if (state.isMounted) {
      this.willUnmount(map);
      this.willMount(map);
    }
  }

  public willUnmount(map: ApplicationMap) {
    this._layerIds.forEach((id) => {
      map.removeLayer(id);
    });
    this._layerIds = [];

    map.removeSource(this._sourceId);
    if (this._onClickListener) {
      map.off('click', this._onClickListener);
    }
  }

  async onMapClick(
    map: ApplicationMap,
    ev: maplibregl.MapMouseEvent & maplibregl.EventData,
    linkProperty: string,
  ) {
    if (!ev || !ev.lngLat) return;
    const thisLayersFeatures = ev.target
      .queryRenderedFeatures(ev.point)
      .filter((f) => f.source.includes(this._sourceId));

    if (thisLayersFeatures.length === 0) return;
    const featureWithLink = thisLayersFeatures.find(
      (feature) => feature.properties?.[linkProperty] !== undefined,
    );
    if (featureWithLink === undefined) return;
    const link = featureWithLink[linkProperty];
    window.open(link);
  }
}
