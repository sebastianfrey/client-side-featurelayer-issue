require([
  'esri/map',
  'esri/graphic',
  'esri/layers/FeatureLayer',
  'esri/renderers/jsonUtils',
  'esri/geometry/jsonUtils',
  'dojo/ready'
], function(Map, Graphic, FeatureLayer, rendererUtils, geometryUtils, ready){

  /**
   * Create random Features.
   *
   * @param {*} total The number of features to create.
   */
  function createFeatures(total = 1) {
    const polygons = turf.randomPolygon(total, {bbox: [-130, 20, -90, 40]});

    const features = [];
    turf.featureEach(polygons, function (currentFeature) {
      features.push(new Graphic({
        geometry: geometryUtils.fromJson({
          type: 'polygon', // autocasts as new Point()
          rings: currentFeature.geometry.coordinates.map((coordinate) => coordinate.reverse()),
        })
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
  function createFeatureLayers(map, { total = 10 } = {}) {
    const layers = [];

    [...Array(total).keys()].forEach(() => {
      const polygonRenderer = rendererUtils.fromJson({
        type: "simple",
        symbol: {
          type: "esriSFS",
          style: "esriSFSSolid",
          color: [ 51,51, 204, 0.9 ],
          outline: {
            type: "esriSLS",
            style: "esriSLSSolid",
            color: [ 255, 255, 255 ],
            width: 1
          }
        }
      });

      const fl = new FeatureLayer({
        layerDefinition: {
          geometryType: "esriGeometryPolygon",
          fields: [
            {
              name: 'ObjectID',
              alias: 'ObjectID',
              type: 'esriFieldTypeOID'
            },
            {
              name: 'ProjectName',
              alias: 'ProjectName',
              type: 'esriFieldTypeString'
            },
            {
              name: 'SiteName',
              alias: 'SiteName',
              type: 'esriFieldTypeString'
            }
          ],
          drawingInfo: {
            renderer: polygonRenderer
          }
        },
        featureSet: null
      });

      fl.on('load', () => {
        createFeatures(1).forEach((feature) => fl.add(feature))
      });


      map.on("extent-change", () => {
        try {
          fl.clear();
        } catch {}
        createFeatures(1).forEach((feature) => fl.add(feature))
      });

      layers.push(fl);
    });

    return layers;
  }

  ready(() => {
  // create the map view
    const map = new Map('map', {
      basemap: 'gray'
    });

    map.on("load", () => {
      map.addLayers(createFeatureLayers(map, { total: 42, group: true }))

      console.info('App is ready!', { map });

    });
  });
});