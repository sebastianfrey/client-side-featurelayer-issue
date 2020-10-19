# Rendering issue with Client-Side FeatureLayer

This repository contains a sample Application, which demonstrates an issue when creating multiple FeatureLayers from client-side Graphics. The issue let the browser gobble a huge amount of memory (Up to 2GB and more). After a while this causes a cras of the browser tab.

## How to reproduce?
The following application reproduces the previously described issue:

After the applications MapView is ready, two GroupLayers are created and added to the map, where each GroupLayer contains:

  - 1 client-side FeatureLayer
  - 1 GroupLayer with 10 client-side FeatureLayers as children

Each client-side FeatureLayer contains initially one random Polygon.

Everytime the MapView goes `stationary` for every FeatureLayer a completely new random Polygon is generated and applied to the source using [FeatureLayer#applyEdits()](https://developers.arcgis.com/javascript/latest/api-reference/esri-layers-FeatureLayer.html#applyEdits). All previous polygons are deleted. This means there are in total 42 features to render.

## Further assets
The following video demonstrates the issue:

![](./assets/demo.gif)

As we can see at the beginning everything works as expected, but after a little bit of paning and zooming around, the application starts acting laggy and buggy. For example, the FeatureLayers do not draw the updates anymore.

A running version of the sample application in the above video can be found here https://sebastianfrey.github.io/client-side-featurelayer-issue/.
