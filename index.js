require([
  'esri/Map',
  'esri/views/MapView',
  'esri/Graphic',
  'esri/layers/FeatureLayer',
  'esri/layers/GroupLayer'
], function(Map, MapView, Graphic, FeatureLayer, GroupLayer){

  /**
   * Create random Features.
   *
   * @param {*} total The number of features to create.
   */
  function createFeatures(total = 1) {
    const polygons = turf.randomPolygon(total, {bbox: [-130, 20, -90, 40]});

    const features = [];
    turf.featureEach(polygons, function (currentFeature) {
      features.push(Graphic.fromJSON({
        geometry: {
          type: 'polygon', // autocasts as new Point()
          rings: currentFeature.geometry.coordinates.map((coordinate) => coordinate.reverse()),
        }
      }));
    });

    return features;
  }

  /**
   * Create GroupLayer with x FeatureLayers.
   *
   * @param {number} total The number of FeatureLayers to create.
   * @param {boolean} group Return FeatureLayers bounded to a GroupLayer.
   */
  function createFeatureLayers(view, { total = 10, group = false } = {}) {
    const layers = [];

    [...Array(total).keys()].forEach(() => {
      const polygonRenderer = {
        type: 'simple',  // autocasts as new SimpleRenderer()
        symbol: {
          type: 'simple-fill',  // autocasts as new SimpleFillSymbol()
          color: [ 51,51, 204, 0.9 ],
          style: 'solid',
          outline: {  // autocasts as new SimpleLineSymbol()
            color: 'white',
            width: 1
          }
        }
      };

      const features = createFeatures(1);

      const fl = new FeatureLayer({
        source: features,
        renderer: polygonRenderer,
        objectIDField: 'ObjectID',
        fields: [
          {
            name: 'ObjectID',
            alias: 'ObjectID',
            type: 'oid'
          },
          {
            name: 'ProjectName',
            alias: 'ProjectName',
            type: 'string'
          },
          {
            name: 'SiteName',
            alias: 'SiteName',
            type: 'string'
          }
        ]
      });

      layers.push(fl);

      view.watch('stationary', () => {
        fl.queryFeatures().then(({ features }) => {
          return fl.applyEdits({
            deleteFeatures: features,
            addFeatures: createFeatures(1)
          });
        }).catch((err) => console.error(err));
      });
    });

    if (group) {
      const groupLayer = new GroupLayer();

      groupLayer.addMany(layers);

      return [groupLayer];
    } else {
      return layers;
    }
  }

  // create the map view
  const map = new Map({
    basemap: 'gray'
  });

  const view = new MapView({
    container: 'map',
    map: map,
    center: [-110, 30],
    zoom: 5
  });

  view.when(() => {
    map.layers.addMany([...createFeatureLayers(view, { total: 10, group: true }), ...createFeatureLayers(view, { total: 10, group: true })]);

    console.info('App is ready!', { map, view });
  });
});