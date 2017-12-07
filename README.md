# geojson-geometries-lookup
[![Travis CI](https://travis-ci.org/simonepri/geojson-geometries-lookup.svg?branch=master)](https://travis-ci.org/simonepri/geojson-geometries-lookup) [![Codecov](https://img.shields.io/codecov/c/github/simonepri/geojson-geometries-lookup/master.svg)](https://codecov.io/gh/simonepri/geojson-geometries-lookup) [![npm](https://img.shields.io/npm/dm/geojson-geometries-lookup.svg)](https://www.npmjs.com/package/geojson-geometries-lookup) [![npm version](https://img.shields.io/npm/v/geojson-geometries-lookup.svg)](https://www.npmjs.com/package/geojson-geometries-lookup) [![npm dependencies](https://david-dm.org/simonepri/geojson-geometries-lookup.svg)](https://david-dm.org/simonepri/geojson-geometries-lookup) [![npm dev dependencies](https://david-dm.org/simonepri/geojson-geometries-lookup/dev-status.svg)](https://david-dm.org/simonepri/geojson-geometries-lookup#info=devDependencies)
> ⚡️ Fast geometry in geometry lookup for large GeoJSONs.

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
Do you use geojson-geometries-lookup in your application? Please [open a Pull Request](https://github.com/simonepri/geojson-geometries-lookup/pulls) to include it here.  
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

<a name="GeoJsonGeometriesLookup+forEachCotainer"></a>

### geoJsonGeometriesLookup.forEachCotainer(geometry, [options]) ⇒ <code>number</code>
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

## Authors
* **Simone Primarosa** - [simonepri](https://github.com/simonepri)

See also the list of [contributors](https://github.com/simonepri/world-country/contributors) who participated in this project.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
