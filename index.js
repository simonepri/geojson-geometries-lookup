'use strict';

const RBush = require('rbush');
const tbbox = require('@turf/bbox').default;

const tcontains = require('@turf/boolean-contains').default;
const GeoJsonGeometries = require('geojson-geometries');

const POINT = 'Point';
const LINE_STRING = 'LineString';
const POLYGON = 'Polygon';

const FEATURE_COLLECTION = 'featureCollection';

function getGeometryDimension(geometry) {
  switch (geometry.type) {
    case POINT:
      return 0;
    case LINE_STRING:
      return 1;
    case POLYGON:
      return 2;
    default:
      throw new TypeError(
        'Unsupported GeoJSON type. Use one of: Point, LineString, Polygon'
      );
  }
}

class GeoJsonGeometriesLookup {
  /**
   * Create an instance of the GeoJSON lookup class.
   * @public
   * @param  {Object} geoJson The GeoJSON for which create the lookup data.
   * @param  {Object} [options] Optional options.
   * @param  {boolean} options.ignorePoints If true the extractor will ignore
   *  geometries of type Point.
   * @param  {boolean} options.ignoreLines If true the extractor will ignore
   *  geometries of type LineString.
   * @param  {boolean} options.ignorePolygon If true the extractor will ignore
   *  geometries of type Polygon.
   */
  constructor(geoJson, options) {
    options = typeof options === 'object' ? options : {};

    const extracted = new GeoJsonGeometries(geoJson, options);

    this.D = new Array(3);
    this.D[0] = {list: extracted.points.features, bboxs: null, lookup: null};
    this.D[1] = {list: extracted.lines.features, bboxs: null, lookup: null};
    this.D[2] = {list: extracted.polygons.features, bboxs: null, lookup: null};

    for (let d = 0; d < 3; d++) {
      const dim = this.D[d];
      if (dim.list.length > 0) {
        dim.bboxs = new Array(dim.list.length);
        dim.lookup = new RBush();

        const geoms = dim.list;
        const bboxs = dim.bboxs;
        const lookup = dim.lookup;

        for (let i = 0, len = geoms.length; i < len; i++) {
          const bbox = tbbox(geoms[i]);
          bboxs[i] = {
            minX: bbox[0],
            minY: bbox[1],
            maxX: bbox[2],
            maxY: bbox[3],
            id: i
          };
        }

        lookup.load(bboxs);
      }
    }
  }

  /**
   * Iterate on each geometry that completely contains the geometry provided.
   * @param  {Object} geometry The geometry of type Point, LineString or Polygon
   *  for which to check if a container exists.
   * @param  {Object} [options] Optional options.
   * @param  {number} options.limit If greater than 0 it will limit the number
   *  of results on which iterate.
   * @param  {boolean} options.ignorePoints If true will ignore geometries of
   *  type Point.
   * @param  {boolean} options.ignoreLines If true will ignore geometries of
   *  type LineString.
   * @param  {boolean} options.ignorePolygon If true will ignore geometries of
   *  type Polygon.
   * @param {Function} func The function that will be called for each element.
   * @return {number}  The number of geometries that completely contains the
   *  geometry provided iterated. The interiors of both geometries must intersect and,
   *  the interior and boundary of the secondary (geometry b) must not intersect
   *  the exterior of the primary (geometry a).
   */
  forEachContainer(geometry, options, func) {
    options = typeof options === 'object' ? options : {};
    func = typeof func === 'function' ? func : () => {};

    let count = 0;
    const size = getGeometryDimension(geometry);
    const ignores = [
      options.ignorePoints,
      options.ignoreLines,
      options.ignorePolygons
    ];

    for (let d = size; d < 3; d++) {
      if (ignores[d] === true) {
        continue;
      }

      const dim = this.D[d];
      if (dim.lookup === null) {
        continue;
      }

      const bbox = tbbox(geometry);
      const bboxs = dim.lookup.search({
        minX: bbox[0],
        minY: bbox[1],
        maxX: bbox[2],
        maxY: bbox[3]
      });

      for (let i = 0, len = bboxs.length; i < len; i++) {
        const geom = dim.list[bboxs[i].id];
        if (!tcontains(geom, geometry)) {
          continue;
        }

        func(geom, count);
        count++;
        if (options.limit > 0 && options.limit === count) {
          return count;
        }
      }
    }

    return count;
  }

  /**
   * Gets the geometries that completely contains the geometry provided.
   * @param  {Object} geometry The geometry of type Point, LineString or Polygon
   *  for which to count containers.
   * @param  {Object} [options] Optional options.
   * @param  {number} options.limit If greater than 0 it will limit the number
   *  of results returned.
   * @param  {boolean} options.ignorePoints If true will ignore geometries of
   *  type Point.
   * @param  {boolean} options.ignoreLines If true will ignore geometries of
   *  type LineString.
   * @param  {boolean} options.ignorePolygon If true will ignore geometries of
   *  type Polygon.
   * @return {Object} A FatureCollection of geometries that completely contains
   *  the geometry provided. The interiors of both geometries must intersect
   *  and, the interior and boundary of the secondary (geometry b) must not
   *  intersect the exterior of the primary (geometry a).
   */
  getContainers(geometry, options) {
    options = typeof options === 'object' ? options : {};

    const results = [];
    this.forEachContainer(geometry, options, geom => results.push(geom));
    return {type: FEATURE_COLLECTION, features: results};
  }

  /**
   * Checks if there is at least one geometry that completely contains the
   *   geometry provided.
   * @param  {Object} geometry The geometry of type Point, LineString or Polygon
   *  for which to check if a container exists.
   * @param  {Object} [options] Optional options.
   * @param  {boolean} options.ignorePoints If true will ignore geometries of
   *  type Point.
   * @param  {boolean} options.ignoreLines If true will ignore geometries of
   *  type LineString.
   * @param  {boolean} options.ignorePolygon If true will ignore geometries of
   *  type Polygon.
   * @return {boolean} True if there is at least one geometry that completely
   *  contains the geometry provided. The interiors of both geometries must
   *  intersect and, the interior and boundary of the secondary (geometry b)
   *  must not intersect the exterior of the primary (geometry a).
   */
  hasContainers(geometry, options) {
    options = typeof options === 'object' ? options : {};

    options.limit = 1;
    return this.forEachContainer(geometry, options) === 1;
  }

  /**
   * Counts the number of geometries that completely contains the geometry provided.
   * @param  {Object} geometry The geometry of type Point, LineString or Polygon
   *  for which to count containers.
   * @param  {Object} [options] Optional options.
   * @param  {number} options.limit If greater than 0 it will stop counting
   *   when this number of containers has been found.
   * @param  {boolean} options.ignorePoints If true will ignore geometries of
   *  type Point.
   * @param  {boolean} options.ignoreLines If true will ignore geometries of
   *  type LineString.
   * @param  {boolean} options.ignorePolygon If true will ignore geometries of
   *  type Polygon.
   * @return {number} The number of geometries that completely contains the
   *  geometry provided. The interiors of both geometries must intersect and,
   *  the interior and boundary of the secondary (geometry b) must not intersect
   *  the exterior of the primary (geometry a).
   */
  countContainers(geometry, options) {
    options = typeof options === 'object' ? options : {};

    return this.forEachContainer(geometry, options);
  }
}

module.exports = GeoJsonGeometriesLookup;
