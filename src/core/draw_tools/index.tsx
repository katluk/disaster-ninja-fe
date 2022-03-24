import { combinedAtom } from './atoms/combinedAtom';
import { store } from '~core/store/store';
import { drawModeRenderer } from './atoms/logicalLayerAtom';
import { DRAW_TOOLS_LAYER_ID } from './constants';
import { createUpdateLayerActions } from '~core/logical_layers/utils/createUpdateActions';
// a little scratch about new and previous structure https://www.figma.com/file/G8VQQ3mctz5gPkcZZvbzCl/Untitled?node-id=0%3A1
// newest structure: https://www.figma.com/file/FcyFYb406D8zGFWxyK4zIk/Untitled?node-id=0%3A1

const createGeoJSONSource = () => ({
  type: 'geojson' as const,
  data: {
    type: 'FeatureCollection' as const,
    features: [],
  },
});

export function initDrawTools() {
  const [updateActions, cleanUpActions] = createUpdateLayerActions(
    DRAW_TOOLS_LAYER_ID,
    {
      source: {
        id: DRAW_TOOLS_LAYER_ID,
        source: createGeoJSONSource(),
      },
    },
  );
  if (updateActions.length) {
    store.dispatch(updateActions);
  }
  drawModeRenderer.setupExtension(combinedAtom);
}
