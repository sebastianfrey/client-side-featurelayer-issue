# Rendering issue with Client-Side FeatureLayer

This repository demonstrates an issue when creating multiple FeatureLayers from client-side Graphics. The issue causes the browser to gobble a huge amount of memory (Up to 3GB and more). This crashes the browser tab after a while.

## How to reproduce?

The following video demonstrates the issue:

![](./assets/demo.gif)

A running version of the sample application in the above video can be found here https://sebastianfrey.github.io/client-side-featurelayer-issue/.

## What does the sample Application?
The application does the following:

After the MapView is ready, two GroupLayers are created and added to the map, where each GroupLayer contains:

  - 1 client-side FeatureLayer
  - 1 GroupLayer with 10 client-side FeatureLayers as children

Each client-side FeatureLayer contains initially one random Polygon.

Everytime the MapView goes `stationary` for every FeatureLayer a completely new random Polygon is generated and applied to the source. All previous polygons are deleted. This means there are in total 42 features to render.


