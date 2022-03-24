import type {
  CircleLayer,
  FillExtrusionLayer,
  FillLayer,
  HeatmapLayer,
  HillshadeLayer,
  LineLayer,
  SymbolLayer,
  GeoJSONSourceRaw,
} from 'maplibre-gl';
import type {
  LayerGeoJSONSource,
  LayerSource,
} from '~core/logical_layers/types/source';
import type { LayerLegend } from '~core/logical_layers/types/legends';
import { generateLayersFromLegend } from '../utils/generateLayersFromLegend';

const isGeoJSONSource = (src: LayerSource): src is LayerGeoJSONSource =>
  src.source.type === 'geojson';

export type FeaturesLayer =
  | CircleLayer
  | FillExtrusionLayer
  | FillLayer
  | HeatmapLayer
  | HillshadeLayer
  | LineLayer
  | SymbolLayer;

export class GeoJsonFabric {
  createSource(src: LayerSource): GeoJSONSourceRaw {
    if (!isGeoJSONSource(src)) throw Error('Wrong source type');
    return {
      type: 'geojson',
      data: src.source.data,
    };
  }

  createLayers(
    layerId: string,
    sourceId: string,
    legend?: LayerLegend | null,
  ): FeaturesLayer[] {
    let layerStyles: FeaturesLayer[] = [];
    if (legend) {
      layerStyles = generateLayersFromLegend(legend, (layer, i) => {
        return {
          ...layer,
          id: `${layerId}-${i}`,
          source: sourceId,
        };
      });
    } else {
      layerStyles = [
        {
          id: `${layerId}`,
          source: sourceId,
          type: 'fill' as const,
          paint: {
            'fill-color': 'pink' as const,
          },
        },
      ];
    }
    return layerStyles;
  }
}
