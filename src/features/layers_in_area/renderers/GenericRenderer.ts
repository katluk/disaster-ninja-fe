import { GeoJsonFabric } from './GeoJsonFabric';
import { TileRasterFabric } from './TileRasterFabric';
import { TileVectorFabric } from './TileVectorFabric';
import { LogicalLayerDefaultRenderer } from '~core/logical_layers/renderers/DefaultRenderer';
import type { ApplicationMap } from '~components/ConnectedMap/ConnectedMap';
import type { LogicalLayerState } from '~core/logical_layers/types/logicalLayer';
import { LAYER_IN_AREA_PREFIX, SOURCE_IN_AREA_PREFIX } from '../constants';
import type { LayerLegend } from '~core/logical_layers/types/legends';
import deepEqual from 'fast-deep-equal';
import { MapController } from './MapController';
import { addZoomFilter } from './activeContributorsLayers';

export class GenericRenderer extends LogicalLayerDefaultRenderer {
  public readonly id: string;
  private _mapController: MapController;
  private _lastLegend: LayerLegend | null = null;
  private _fabric: GeoJsonFabric | TileVectorFabric | TileRasterFabric | null =
    null;

  public constructor({ id }: { id: string }) {
    super();
    this.id = id;
    /* private */
    this._mapController = new MapController({
      id: this.id,
      sourceId: SOURCE_IN_AREA_PREFIX + this.id,
    });
  }

  willMount({ map, state }: { map: ApplicationMap; state: LogicalLayerState }) {
    if (!state.source) {
      throw Error('Attempt to mount layer without source');
    }

    const fabric = {
      geojson: new GeoJsonFabric(),
      vector: new TileVectorFabric(),
      raster: new TileRasterFabric(),
    }[state.source.source.type];

    if (!fabric) {
      throw Error(`Unexpected source type: "${state.source.source.type}"`);
    }

    // Save for reuse in legend update hook
    this._fabric = fabric;

    const source = fabric.createSource(state.source);
    const layers = fabric.createLayers(
      LAYER_IN_AREA_PREFIX + this.id,
      this._mapController.getSourceId(),
      state.legend,
    );

    // !FIXME - Hardcoded filter for layer
    // Must be deleted after LayersDB implemented
    if (this.id === 'activeContributors') {
      addZoomFilter(layers);
    }

    this._mapController.addSource(map, source);
    this._mapController.addLayers(map, layers);
    state.legend && this._mapController.addListeners(state.legend);
  }

  willLegendUpdate({
    map,
    state,
  }: {
    map: ApplicationMap;
    state: LogicalLayerState;
  }) {
    // Reduce blinking
    if (!deepEqual(this._lastLegend, state.legend)) {
      // Clean up old legend artifacts
      this._mapController.removeLayers(map);
      this._mapController.removeListeners();
      // Generate new legend artifacts
      if (state.legend && this._fabric) {
        // Fabric created when layer mounted
        const layers = this._fabric.createLayers(
          LAYER_IN_AREA_PREFIX + this.id,
          this._mapController.getSourceId(),
          state.legend,
        );

        // !FIXME - Hardcoded filter for layer
        // Must be deleted after LayersDB implemented
        if (this.id === 'activeContributors') {
          addZoomFilter(layers);
        }

        this._mapController.addLayers(map, layers);
        this._mapController.addListeners(state.legend);
      }
    }
  }

  willSourceUpdate({
    map,
    state,
  }: {
    map: ApplicationMap;
    state: LogicalLayerState;
  }) {
    this._mapController.updateSource(map, state.source);
  }

  willUnMount({ map }: { map: ApplicationMap }) {
    this._mapController.removeLayers(map);
    this._mapController.removeSource(map);
    this._mapController.removeListeners();
  }

  willHide({ map }: { map: ApplicationMap }) {
    this._mapController.setLayersVisibility(map, false);
    this._mapController.removeListeners();
  }

  willUnhide({
    map,
    state,
  }: {
    map: ApplicationMap;
    state: LogicalLayerState;
  }) {
    this._mapController.setLayersVisibility(map, true);
    if (state.legend) {
      this._mapController.addListeners(state.legend);
    }
  }

  willDestroy({ map }: { map: ApplicationMap | null }) {
    if (map) {
      this._mapController.removeLayers(map);
      this._mapController.removeSource(map);
    }
    this._mapController.removeListeners();
  }
}
