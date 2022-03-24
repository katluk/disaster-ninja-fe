import maplibregl, {
  AnyLayer,
  GeoJSONSource,
  GeoJSONSourceRaw,
} from 'maplibre-gl';
import { ApplicationMap } from '~components/ConnectedMap/ConnectedMap';
import { LogicalLayerDefaultRenderer } from '~core/logical_layers/renderers/DefaultRenderer';
import { LogicalLayerState } from '~core/logical_layers/types/logicalLayer';
import { LayerGeoJSONSource } from '~core/logical_layers/types/source';
import { layersOrderManager } from '~core/logical_layers/utils/layersOrder';
import { registerMapListener } from '~core/shared_state/mapListeners';
import { LAYER_IN_AREA_PREFIX, SOURCE_IN_AREA_PREFIX } from '../constants';
import { generateLayersFromLegend } from '../utils/generateLayersFromLegend';

import type { LayerLegend } from '~core/logical_layers/types/legends';

export class GeoJsonRendere extends LogicalLayerDefaultRenderer {
  public readonly id: string;
  private _layerIds: Set<string>;
  private _sourceId: string;
  private _removeClickListener: null | (() => void) = null;

  public constructor({ id }: { id: string }) {
    super();
    this.id = id;
    /* private */
    this._layerIds = new Set();
    this._sourceId = SOURCE_IN_AREA_PREFIX + this.id;
  }

  createLayers(legend: LayerLegend) {
    let layerStyles: AnyLayer[] = [];
    if (legend) {
      layerStyles = generateLayersFromLegend(legend, (layer, i) => {
        return {
          ...layer,
          id: `${LAYER_IN_AREA_PREFIX + this.id}-${i}`,
          source: this._sourceId,
        };
      });
    } else {
      layerStyles = [
        {
          id: `${LAYER_IN_AREA_PREFIX + this.id}`,
          source: this._sourceId,
          type: 'fill' as const,
          paint: {
            'fill-color': 'pink' as const,
          },
        },
      ];
    }
    return layerStyles;
  }

  removeLayers(map: ApplicationMap) {
    this._layerIds.forEach((id) => {
      if (map.getLayer(id) !== undefined) {
        map.removeLayer(id);
      } else {
        console.warn(
          `Can't remove layer with ID: ${id}. Layer does't exist in map`,
        );
      }
    });
  }

  addLayers(map: ApplicationMap, layers: AnyLayer[]) {
    layers.forEach((mapLayer) => {
      layersOrderManager.getBeforeIdByType(mapLayer.type, (beforeId) => {
        map.addLayer(mapLayer, beforeId);
        this._layerIds.add(mapLayer.id);
      });
    });
  }

  setLayersVisibility(map: ApplicationMap, toVisible: boolean) {
    this._layerIds.forEach((id) => {
      if (map.getLayer(id) !== undefined) {
        map.setLayoutProperty(id, 'visibility', toVisible ? 'visible' : 'none');
      } else {
        console.warn(
          `Can't hide layer with ID: ${id}. Layer doesn't exist on the map`,
        );
      }
    });
  }

  addSource(map: ApplicationMap, sourceData: GeoJSONSource['data']) {
    const mapSource: GeoJSONSourceRaw = {
      type: 'geojson' as const,
      data: sourceData,
    };
    map.addSource(this._sourceId, mapSource);
  }

  removeSource(map: ApplicationMap) {
    map.removeSource(this._sourceId);
  }

  async onMapClick(
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
    const link = featureWithLink.properties?.[linkProperty];
    window.open(link);
  }

  addListeners(legend: LayerLegend) {
    const linkProperty = 'linkProperty' in legend ? legend.linkProperty : null;
    if (linkProperty) {
      const handler = (e) => {
        this.onMapClick(e, linkProperty);
        return true;
      };
      this._removeClickListener = registerMapListener('click', handler, 60);
    }
  }

  removeListeners() {
    this._removeClickListener?.();
  }

  /* ========== Hooks ========== */

  willMount({ map, state }: { map: ApplicationMap; state: LogicalLayerState }) {
    if (state.source?.source.type === 'geojson') {
      this.addSource(map, state.source.source.data);
      if (state.legend) {
        const layers = this.createLayers(state.legend);
        this.addLayers(map, layers);
        this.addListeners(state.legend);
      }
    }
  }

  willLegendUpdate({
    map,
    state,
  }: {
    map: ApplicationMap;
    state: LogicalLayerState;
  }) {
    console.assert(
      state.isMounted === true,
      'You should mount layers before update',
    );

    console.assert(
      map.getSource(this._sourceId),
      'You should setup source before',
    );

    // Replace old styles with new one
    this.removeLayers(map);
    this.removeListeners();
    // Generate new styles
    if (state.legend) {
      const layers = this.createLayers(state.legend);
      this.addLayers(map, layers);
      this.addListeners(state.legend);
    }
  }

  willSourceUpdate({
    map,
    state,
  }: {
    map: ApplicationMap;
    state: LogicalLayerState;
  }) {
    console.assert(
      state.isMounted === true && this._layerIds.size > 0,
      'You should mount layer before update',
    );
    const mapSource = map.getSource(this._sourceId) as maplibregl.GeoJSONSource;
    console.assert(mapSource !== undefined, 'You should setup source before');

    // Set emtry source of source was deleted from state but layer still mounted
    if (!state.source) {
      mapSource.setData({
        type: 'FeatureCollection',
        features: [],
      });
      return;
    }

    console.assert(
      state.source.source.type === 'geojson',
      'Only layers with geojson source supported in this renderer',
    );

    const newSourceData: GeoJSONSourceRaw['data'] | null = (
      state.source as LayerGeoJSONSource
    ).source.data;

    mapSource.setData(
      newSourceData || {
        type: 'FeatureCollection',
        features: [],
      },
    );
  }

  willUnMount({ map }: { map: ApplicationMap }) {
    this.removeLayers(map);
    this.removeSource(map);
    this.removeListeners();
  }

  willHide({ map }: { map: ApplicationMap }) {
    this.setLayersVisibility(map, false);
    this.removeListeners();
  }

  willUnhide({
    map,
    state,
  }: {
    map: ApplicationMap;
    state: LogicalLayerState;
  }) {
    this.setLayersVisibility(map, true);
    if (state.legend) {
      this.addListeners(state.legend);
    }
  }

  willDestroy({ map }: { map: ApplicationMap | null }) {
    if (map) {
      this.removeLayers(map);
      this.removeSource(map);
    }
    this.removeListeners();
  }
}
