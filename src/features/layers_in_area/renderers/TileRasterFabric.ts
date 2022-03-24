import type { RasterSource, RasterLayer } from 'maplibre-gl';
import type { LayerLegend } from '~core/logical_layers/types/legends';
import type {
  LayerTileSource,
  LayerSource,
} from '~core/logical_layers/types/source';
import { adaptTilesUrl } from '../utils/adaptTilesUrl';

const isRasterSource = (source: LayerSource): source is LayerTileSource =>
  source.source.type === 'raster';

export class TileRasterFabric {
  createSource(src: LayerSource): RasterSource {
    if (!isRasterSource(src)) throw Error('Wrong source type');
    const { source, minZoom, maxZoom } = src;
    const isTMS = (url: string) => url.includes('{-y}');
    return {
      type: 'raster',
      tiles: source.urls.map((url) => adaptTilesUrl(url)),
      tileSize: source.tileSize || 256,
      minzoom: minZoom || 0,
      maxzoom: maxZoom || 22,
      // /* https://docs.mapbox.com/mapbox-gl-js/style-spec/sources/#vector-scheme */
      scheme: isTMS(source.urls[0]) ? 'tms' : 'xyz',
    };
  }

  createLayers(layerId: string, sourceId: string): RasterLayer[] {
    return [
      {
        id: layerId,
        type: 'raster' as const,
        source: sourceId,
        minzoom: 0,
        maxzoom: 22,
      },
    ];
  }
}
