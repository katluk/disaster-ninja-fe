import type { VectorSource } from 'maplibre-gl';
import type {
  LayerTileSource,
  LayerSource,
} from '~core/logical_layers/types/source';
import type { LayerLegend } from '~core/logical_layers/types/legends';
import type { FeaturesLayer } from './GeoJsonFabric';
import { adaptTilesUrl } from '../utils/adaptTilesUrl';
import { generateLayersFromLegend } from '../utils/generateLayersFromLegend';

const isVectorSource = (source: LayerSource): source is LayerTileSource =>
  source.source.type === 'vector';

export class TileVectorFabric {
  createSource(src: LayerSource): VectorSource {
    if (!isVectorSource(src)) throw Error('Wrong source type');
    const { source, minZoom, maxZoom } = src;
    const isTMS = (url: string) => url.includes('{-y}');
    return {
      type: 'vector',
      tiles: source.urls.map((url) => adaptTilesUrl(url)),
      minzoom: minZoom || 0,
      maxzoom: maxZoom || 22,
      // /* https://docs.mapbox.com/mapbox-gl-js/style-spec/sources/#vector-scheme */
      scheme: isTMS(source.urls[0]) ? 'tms' : 'xyz',
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
