import type { LayerLegend } from '~core/logical_layers/types/legends';
import { AnyLayer } from 'maplibre-gl';
import {
  applyLegendConditions,
  mapCSSToMapBoxProperties,
  setSourceLayer,
} from '~utils/map/mapCSSToMapBoxPropertiesConverter';
import { generateLayerStyleFromBivariateLegend } from '~utils/bivariate/bivariateColorThemeUtils';
import { FeaturesLayer } from '../types';

export function generateLayersFromLegend(
  legend: LayerLegend,
  postProcessing: (layer: AnyLayer, idx: number) => AnyLayer,
): FeaturesLayer[] {
  if (legend.type === 'simple') {
    const layers = legend.steps
      /**
       * Layer filters method generate extra layers for legend steps, it simple and reliably.
       * Find properties diff between steps and put expressions right into property value
       * if tou need more map performance
       * */
      .map((step) =>
        setSourceLayer(
          step,
          applyLegendConditions(step, mapCSSToMapBoxProperties(step.style)),
        ),
      );

    return layers.flat().map(postProcessing);
  }
  if (legend.type === 'bivariate' && 'axis' in legend) {
    return [generateLayerStyleFromBivariateLegend(legend)].map(postProcessing);
  }
  throw new Error(`Unexpected legend type '${legend.type}'`);
}
