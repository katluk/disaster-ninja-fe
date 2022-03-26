import { setupTestContext } from '../../../utils/testsUtils/setupTest';
import { LayersOrderManager } from './layersOrder';

/* Setup stage */
const test = setupTestContext(() => {
  return {};
});

class FakeMapWithBaseLayers {
  #baseLayers = [];
  #layers = [];
  constructor(baseLayers) {
    this.#baseLayers = baseLayers;
  }

  once(type, cb) {
    cb();
  }

  getStyle() {
    return {
      layers: [...this.#baseLayers, ...this.#layers],
    };
  }

  setLayers(layers) {
    this.#layers = layers;
  }
}

/* Test cases */

test('Return undefined if only base map layers are available', (t) => {
  const layersOrderManager = new LayersOrderManager();
  const map = new FakeMapWithBaseLayers([
    { type: 'background', id: 'base-line-background' },
    { type: 'fill', id: 'base-fill' },
    { type: 'line', id: 'base-line-top' },
  ]);
  layersOrderManager.init(map as any);

  t.plan(3);

  layersOrderManager.getBeforeIdByType('fill', (beforeId1) => {
    t.is(beforeId1, undefined);
  });

  layersOrderManager.getBeforeIdByType('line', (beforeId2) => {
    t.is(beforeId2, undefined);
  });

  layersOrderManager.getBeforeIdByType('background', (beforeId3) => {
    t.is(beforeId3, undefined);
  });
});

test('Return id to mount before higher type', (t) => {
  const layersOrderManager = new LayersOrderManager();
  const map = new FakeMapWithBaseLayers([
    { type: 'background', id: 'base-line-background' },
    { type: 'fill', id: 'base-fill' },
    { type: 'line', id: 'base-line-top' },
  ]);
  layersOrderManager.init(map as any);

  map.setLayers([
    { type: 'background', id: 'background-layer' },
    { type: 'raster', id: 'raster-layer' },
    { type: 'hillshade', id: 'hillshade-layer' },
    { type: 'heatmap', id: 'heatmap-layer' },
    { type: 'fill', id: 'fill-layer' },
    { type: 'fill-extrusion', id: 'fill-extrusion-layer' },
    { type: 'line', id: 'line-layer' },
    { type: 'circle', id: 'circle-layer' },
    { type: 'symbol', id: 'symbol-layer' },
    { type: 'custom', id: 'custom-layer' },
  ]);

  t.plan(6);
  {
    layersOrderManager.getBeforeIdByType('background', (beforeId) => {
      t.is(beforeId, 'raster-layer');
    });

    layersOrderManager.getBeforeIdByType('raster', (beforeId) => {
      t.is(beforeId, 'hillshade-layer');
    });

    layersOrderManager.getBeforeIdByType('hillshade', (beforeId) => {
      t.is(beforeId, 'heatmap-layer');
    });

    layersOrderManager.getBeforeIdByType('heatmap', (beforeId) => {
      t.is(beforeId, 'fill-layer');
    });

    layersOrderManager.getBeforeIdByType('symbol', (beforeId) => {
      t.is(beforeId, 'custom-layer');
    });

    layersOrderManager.getBeforeIdByType('custom', (beforeId) => {
      t.is(beforeId, undefined);
    });
  }
});

test('Return beforeId when some layer types are missing', (t) => {
  const layersOrderManager = new LayersOrderManager();
  const map = new FakeMapWithBaseLayers([
    { type: 'background', id: 'base-line-background' },
    { type: 'fill', id: 'base-fill' },
    { type: 'line', id: 'base-line-top' },
  ]);
  layersOrderManager.init(map as any);
  map.setLayers([
    { type: 'raster', id: 'raster-layer' },
    { type: 'raster', id: 'satelite-shots' },
    { type: 'hillshade', id: 'hillshade-layer-0' },
    { type: 'hillshade', id: 'hillshade-layer-1' },
    { type: 'hillshade', id: 'hillshade-layer-2' },
    { type: 'fill', id: 'fill-layer' },
    { type: 'fill', id: 'fill-layer-top' },
    { type: 'fill-extrusion', id: 'fill-extrusion-layer-1' },
    { type: 'fill-extrusion', id: 'fill-extrusion-layer-2' },
    { type: 'symbol', id: 'symbol-layer1' },
    { type: 'symbol', id: 'symbol-layer2' },
  ]);

  t.plan(6);

  layersOrderManager.getBeforeIdByType('background', (beforeId) => {
    t.is(beforeId, 'raster-layer');
  });

  layersOrderManager.getBeforeIdByType('raster', (beforeId) => {
    t.is(beforeId, 'hillshade-layer-0');
  });

  layersOrderManager.getBeforeIdByType('hillshade', (beforeId) => {
    t.is(beforeId, 'fill-layer');
  });

  layersOrderManager.getBeforeIdByType('heatmap', (beforeId) => {
    t.is(beforeId, 'fill-layer');
  });

  layersOrderManager.getBeforeIdByType('symbol', (beforeId) => {
    t.is(beforeId, undefined);
  });

  layersOrderManager.getBeforeIdByType('custom', (beforeId) => {
    t.is(beforeId, undefined);
  });
});
