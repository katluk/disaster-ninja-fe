import type { ApplicationMap } from '~components/ConnectedMap/ConnectedMap';
import { AnyLayer, AnySourceData } from 'maplibre-gl';
import { layersOrderManager } from '~core/logical_layers/utils/layersOrder';
import { registerMapListener } from '~core/shared_state/mapListeners';
import type { LayerLegend } from '~core/logical_layers/types/legends';
import { LayerSource } from '~core/logical_layers/types/source';
import { onActiveContributorsClick } from './activeContributorsLayers';

export class MapController {
  private _id: string;
  private _layerIds: Set<string> = new Set();
  private _sourceId: string;
  private _removeClickListener: null | (() => void) = null;

  public constructor({ id, sourceId }: { id: string; sourceId: string }) {
    this._id = id;
    this._sourceId = sourceId;
  }

  getSourceId() {
    return this._sourceId;
  }

  /* Source */

  addSource(map: ApplicationMap, source: AnySourceData) {
    map.addSource(this._sourceId, source);
  }

  updateSource(map: ApplicationMap, source: LayerSource | null) {
    const mapSource = map.getSource(this._sourceId);

    if (mapSource === undefined) {
      throw Error('Attempt to update layer without source');
    }

    // Only geojson source can be updated with remounting
    if ('setData' in mapSource) {
      if (source && source.source.type === 'geojson' && source.source.data) {
        mapSource.setData(source.source.data);
      } else {
        console.warn('Attempt to set bad source data');
        mapSource.setData({
          type: 'FeatureCollection',
          features: [],
        });
      }
    }
  }

  removeSource(map: ApplicationMap) {
    map.removeSource(this._sourceId);
  }

  /* Layer */

  addLayers(map: ApplicationMap, layers: AnyLayer[]) {
    layers.forEach((mapLayer) => {
      layersOrderManager.getBeforeIdByType(mapLayer.type, (beforeId) => {
        map.addLayer(mapLayer, beforeId);
        this._layerIds.add(mapLayer.id);
      });
    });
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

  /* Listeners */

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
    // !FIXME - Hardcoded filter for layer
    // Must be deleted after LayersDB implemented
    if (this._id === 'activeContributors') {
      this._removeClickListener = registerMapListener(
        'click',
        (e) => (onActiveContributorsClick(e.target, this._sourceId)(e), true),
        60,
      );
      return;
    }

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
}
