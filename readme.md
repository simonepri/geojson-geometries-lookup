<h1 align="center">
  <b>geojson-geometries-lookup</b>
</h1>
<p align="center">
  <!-- Version - npm -->
  <a href="https://www.npmjs.com/package/geojson-geometries-lookup">
    <img src="https://img.shields.io/npm/v/geojson-geometries-lookup.svg" alt="Latest version on npm" />
  </a>
  <!-- Downloads - npm -->
  <a href="https://npm-stat.com/charts.html?package=geojson-geometries-lookup">
    <img src="https://img.shields.io/npm/dt/geojson-geometries-lookup.svg" alt="Downloads on npm" />
  </a>
  <!-- License - MIT -->
  <a href="https://github.com/simonepri/geojson-geometries-lookup/tree/master/license">
    <img src="https://img.shields.io/github/license/simonepri/geojson-geometries-lookup.svg" alt="Project license" />
  </a>

  <br/>

  <!-- Lint -->
  <a href="https://github.com/simonepri/geojson-geometries-lookup/actions?query=workflow:lint+branch:master">
    <img src="https://github.com/simonepri/geojson-geometries-lookup/workflows/lint/badge.svg?branch=master" alt="Lint status" />
  </a>
  <!-- Test - macOS -->
  <a href="https://github.com/simonepri/geojson-geometries-lookup/actions?query=workflow:test-macos+branch:master">
    <img src="https://github.com/simonepri/geojson-geometries-lookup/workflows/test-macos/badge.svg?branch=master" alt="Test macOS status" />
  </a>
  <!-- Test - Ubuntu -->
  <a href="https://github.com/simonepri/geojson-geometries-lookup/actions?query=workflow:test-ubuntu+branch:master">
    <img src="https://github.com/simonepri/geojson-geometries-lookup/workflows/test-ubuntu/badge.svg?branch=master" alt="Test Ubuntu status" />
  </a>
  <!-- Test - Windows -->
  <a href="https://github.com/simonepri/geojson-geometries-lookup/actions?query=workflow:test-windows+branch:master">
    <img src="https://github.com/simonepri/geojson-geometries-lookup/workflows/test-windows/badge.svg?branch=master" alt="Test Windows status" />
  </a>

  <br/>

  <!-- Coverage - Codecov -->
  <a href="https://codecov.io/gh/simonepri/geojson-geometries-lookup">
    <img src="https://img.shields.io/codecov/c/github/simonepri/geojson-geometries-lookup/master.svg" alt="Codecov Coverage report" />
  </a>
  <!-- DM - Snyk -->
  <a href="https://snyk.io/test/github/simonepri/geojson-geometries-lookup?targetFile=package.json">
    <img src="https://snyk.io/test/github/simonepri/geojson-geometries-lookup/badge.svg?targetFile=package.json" alt="Known Vulnerabilities" />
  </a>
  <!-- DM - David -->
  <a href="https://david-dm.org/simonepri/geojson-geometries-lookup">
    <img src="https://david-dm.org/simonepri/geojson-geometries-lookup/status.svg" alt="Dependency Status" />
  </a>

  <br/>

  <!-- Code Style - XO-Prettier -->
  <a href="https://github.com/xojs/xo">
    <img src="https://img.shields.io/badge/code_style-XO+Prettier-5ed9c7.svg" alt="XO Code Style used" />
  </a>
  <!-- Test Runner - AVA -->
  <a href="https://github.com/avajs/ava">
    <img src="https://img.shields.io/badge/test_runner-AVA-fb3170.svg" alt="AVA Test Runner used" />
  </a>
  <!-- Test Coverage - Istanbul -->
  <a href="https://github.com/istanbuljs/nyc">
    <img src="https://img.shields.io/badge/test_coverage-NYC-fec606.svg" alt="Istanbul Test Coverage used" />
  </a>
  <!-- Init - ni -->
  <a href="https://github.com/simonepri/ni">
    <img src="https://img.shields.io/badge/initialized_with-ni-e74c3c.svg" alt="NI Scaffolding System used" />
  </a>
  <!-- Release - np -->
  <a href="https://github.com/sindresorhus/np">
    <img src="https://img.shields.io/badge/released_with-np-6c8784.svg" alt="NP Release System used" />
  </a>
</p>
<p align="center">
  ⚡️ Fast geometry in geometry lookup for large GeoJSONs.

  <br/>

  <sub>
    Coded with ❤️ by <a href="#authors">Simone Primarosa</a>.
  </sub>
</p>

## Synopsis

With this package you can perform the following operations (and more) on a given GeoJSON.
* Given a Point get all the Points in the GeoJSON that intersects it.
* Given a Point get all the Lines in the GeoJSON that intersects it.
* Given a Point get all the Polygons in the GeoJSON that contains it.
* Given a Line get all the Lines in the GeoJSON that contains it.
* Given a Line get all the Polygons in the GeoJSON that contains it.
* Given a Polygon get all the Polygons in the GeoJSON that contains it.

## Install
```bash
$ npm install --save geojson-geometries-lookup
```

## Showcase
Do you use geojson-geometries-lookup in your application? Please [open a Pull Request][new-pr] to include it here.  
We would love to have it in our list:

* [country-iso](https://github.com/simonepri/country-iso): 🗺 Get ISO 3166-1 alpha-3 country code for geographic coordinates.
* [is-sea](https://github.com/simonepri/is-sea): 🌊 Check whether a geographic coordinate is in the sea or not on the earth.

## Usage
```javascript
const GeoJsonGeometriesLookup = require('geojson-geometries-lookup');

const geojson = {type: 'FeatureCollection',
  features: [{
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [102.0, 0.5]
    },
    properties: {prop0: 'value0'}
  }, {
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates: [[100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0]]
    },
    properties: {prop1: 'value1'}
  }, {
    type: 'Feature',
    geometry: {
      type: 'Polygon',
      coordinates: [
        [[100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0], [100.0, 0.0]]
      ]
    },
    properties: {prop2: 'value2'}
  }]
};

const glookup = new GeoJsonGeometriesLookup(geojson);

const point1 = {type: "Point", coordinates: [102.0, 0.5]};
glookup.getContainers(point1);
// => {
//   type: 'FeatureCollection',
//   features: [{
//     type: 'Feature',
//     geometry: {
//       type: 'Point',
//       coordinates: [102.0, 0.5]
//     },
//     properties: {prop0: 'value0'}
//   }]
// }
glookup.countContainers(point1);
// => 1

glookup.getContainers(point1, {ignorePoints: true});
// => {
//   type: 'FeatureCollection',
//   features: []
// }
glookup.countContainers(point1, {ignorePoints: true});
// => 0

const point2 = {type: "Point", coordinates: [101.0, 0.0]};
glookup.getContainers(point2);
// => {
//   type: 'FeatureCollection',
//   features: [{
//     type: 'Feature',
//     geometry: {
//       type: 'LineString',
//       coordinates: [[100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0]]
//     },
//     properties: {prop1: 'value1'}
//   }, {
//     type: 'Feature',
//     geometry: {
//       type: 'Polygon',
//       coordinates: [
//         [[100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0], [100.0, 0.0]]
//       ]
//     },
//     properties: {prop2: 'value2'}
//   }]
// }
glookup.getContainers(point2, {ignorePolygons: true});
// => {
//   type: 'FeatureCollection',
//   features: [{
//     type: 'Feature',
//     geometry: {
//       type: 'LineString',
//       coordinates: [[100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0]]
//     },
//     properties: {prop1: 'value1'}
//   }]
// }
glookup.hasContainers(point1, {ignorePoints: true, ignoreLines: true});
// => true

const poly1 = {
  type: 'Polygon',
  coordinates: [
    [[100.0+0.25, 0.0+0.25], [101.0-0.25, 0.0+0.25], [101.0-0.25, 1.0-0.25], [100.0+0.25, 1.0-0.25], [100.0+0.25, 0.0+0.25]]
  ]
}
glookup.getContainers(poly1, {ignorePoints: true, ignoreLines: true});
// => {
//   type: 'FeatureCollection',
//   features: [{
//     type: 'Feature',
//     geometry: {
//       type: 'Polygon',
//       coordinates: [
//         [[100.0, 0.0], [101.0, 0.0], [101.0, 1.0], [100.0, 1.0], [100.0, 0.0]]
//       ]
//     },
//     properties: {prop2: 'value2'}
//   }]
// }
```

## API
<a name="GeoJsonGeometriesLookup"></a>
<a name="new_GeoJsonGeometriesLookup_new"></a>

### new GeoJsonGeometriesLookup(geoJson, [options])
Create an instance of the GeoJSON lookup class.


| Param | Type | Description |
| --- | --- | --- |
| geoJson | <code>Object</code> | The GeoJSON for which create the lookup data. |
| [options] | <code>Object</code> | Optional options. |
| options.ignorePoints | <code>boolean</code> | If true the extractor will ignore  geometries of type Point. |
| options.ignoreLines | <code>boolean</code> | If true the extractor will ignore  geometries of type LineString. |
| options.ignorePolygon | <code>boolean</code> | If true the extractor will ignore  geometries of type Polygon. |

<a name="GeoJsonGeometriesLookup+forEachContainer"></a>

### geoJsonGeometriesLookup.forEachContainer(geometry, [options]) ⇒ <code>number</code>
Iterate on each geometry that completely contains the geometry provided.

**Kind**: instance method of [<code>GeoJsonGeometriesLookup</code>](#GeoJsonGeometriesLookup)  
**Returns**: <code>number</code> - The number of geometries that completely contains the
 geometry provided iterated. The interiors of both geometries must intersect and,
 the interior and boundary of the secondary (geometry b) must not intersect
 the exterior of the primary (geometry a).  

| Param | Type | Description |
| --- | --- | --- |
| geometry | <code>Object</code> | The geometry of type Point, LineString or Polygon  for which to check if a container exists. |
| [options] | <code>Object</code> | Optional options. |
| options.limit | <code>number</code> | If greater than 0 it will limit the number  of results on which iterate. |
| options.ignorePoints | <code>boolean</code> | If true will ignore geometries of  type Point. |
| options.ignoreLines | <code>boolean</code> | If true will ignore geometries of  type LineString. |
| options.ignorePolygon | <code>boolean</code> | If true will ignore geometries of  type Polygon. |

<a name="GeoJsonGeometriesLookup+getContainers"></a>

### geoJsonGeometriesLookup.getContainers(geometry, [options]) ⇒ <code>Object</code>
Gets the geometries that completely contains the geometry provided.

**Kind**: instance method of [<code>GeoJsonGeometriesLookup</code>](#GeoJsonGeometriesLookup)  
**Returns**: <code>Object</code> - A FatureCollection of geometries that completely contains
 the geometry provided. The interiors of both geometries must intersect
 and, the interior and boundary of the secondary (geometry b) must not
 intersect the exterior of the primary (geometry a).  

| Param | Type | Description |
| --- | --- | --- |
| geometry | <code>Object</code> | The geometry of type Point, LineString or Polygon  for which to count containers. |
| [options] | <code>Object</code> | Optional options. |
| options.limit | <code>number</code> | If greater than 0 it will limit the number  of results returned. |
| options.ignorePoints | <code>boolean</code> | If true will ignore geometries of  type Point. |
| options.ignoreLines | <code>boolean</code> | If true will ignore geometries of  type LineString. |
| options.ignorePolygon | <code>boolean</code> | If true will ignore geometries of  type Polygon. |

<a name="GeoJsonGeometriesLookup+hasContainers"></a>

### geoJsonGeometriesLookup.hasContainers(geometry, [options]) ⇒ <code>boolean</code>
Checks if there is at least one geometry that completely contains the
  geometry provided.

**Kind**: instance method of [<code>GeoJsonGeometriesLookup</code>](#GeoJsonGeometriesLookup)  
**Returns**: <code>boolean</code> - True if there is at least one geometry that completely
 contains the geometry provided. The interiors of both geometries must
 intersect and, the interior and boundary of the secondary (geometry b)
 must not intersect the exterior of the primary (geometry a).  

| Param | Type | Description |
| --- | --- | --- |
| geometry | <code>Object</code> | The geometry of type Point, LineString or Polygon  for which to check if a container exists. |
| [options] | <code>Object</code> | Optional options. |
| options.ignorePoints | <code>boolean</code> | If true will ignore geometries of  type Point. |
| options.ignoreLines | <code>boolean</code> | If true will ignore geometries of  type LineString. |
| options.ignorePolygon | <code>boolean</code> | If true will ignore geometries of  type Polygon. |

<a name="GeoJsonGeometriesLookup+countContainers"></a>

### geoJsonGeometriesLookup.countContainers(geometry, [options]) ⇒ <code>number</code>
Counts the number of geometries that completely contains the geometry provided.

**Kind**: instance method of [<code>GeoJsonGeometriesLookup</code>](#GeoJsonGeometriesLookup)  
**Returns**: <code>number</code> - The number of geometries that completely contains the
 geometry provided. The interiors of both geometries must intersect and,
 the interior and boundary of the secondary (geometry b) must not intersect
 the exterior of the primary (geometry a).  

| Param | Type | Description |
| --- | --- | --- |
| geometry | <code>Object</code> | The geometry of type Point, LineString or Polygon  for which to count containers. |
| [options] | <code>Object</code> | Optional options. |
| options.limit | <code>number</code> | If greater than 0 it will stop counting   when this number of containers has been found. |
| options.ignorePoints | <code>boolean</code> | If true will ignore geometries of  type Point. |
| options.ignoreLines | <code>boolean</code> | If true will ignore geometries of  type LineString. |
| options.ignorePolygon | <code>boolean</code> | If true will ignore geometries of  type Polygon. |

## Contributing
Contributions are REALLY welcome and if you find a security flaw in this code,
PLEASE [report it][new-issue].  

## Authors
- **Simone Primarosa** - *Github* ([@simonepri][github:simonepri]) • *Twitter* ([@simoneprimarosa][twitter:simoneprimarosa])

See also the list of [contributors][contributors] who participated in this project.

## License
This project is licensed under the MIT License - see the [license][license] file for details.

<!-- Links -->
[start]: https://github.com/simonepri/geojson-geometries-lookup#start-of-content
[new-issue]: https://github.com/simonepri/geojson-geometries-lookup/issues/new
[new-pr]: https://github.com/simonepri/geojson-geometries-lookup/pulls/compare
[contributors]: https://github.com/simonepri/geojson-geometries-lookup/contributors

[license]: https://github.com/simonepri/geojson-geometries-lookup/tree/master/license

[github:simonepri]: https://github.com/simonepri
[twitter:simoneprimarosa]: http://twitter.com/intent/user?screen_name=simoneprimarosa
