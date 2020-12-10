export = GeoJsonGeometriesLookup;
declare class GeoJsonGeometriesLookup {
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
    constructor(geoJson: any, options?: {
        ignorePoints: boolean;
        ignoreLines: boolean;
        ignorePolygon: boolean;
    });
    D: any[];
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
    forEachContainer(geometry: any, options?: {
        limit: number;
        ignorePoints: boolean;
        ignoreLines: boolean;
        ignorePolygon: boolean;
    }, func: Function): number;
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
    getContainers(geometry: any, options?: {
        limit: number;
        ignorePoints: boolean;
        ignoreLines: boolean;
        ignorePolygon: boolean;
    }): any;
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
    hasContainers(geometry: any, options?: {
        ignorePoints: boolean;
        ignoreLines: boolean;
        ignorePolygon: boolean;
    }): boolean;
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
    countContainers(geometry: any, options?: {
        limit: number;
        ignorePoints: boolean;
        ignoreLines: boolean;
        ignorePolygon: boolean;
    }): number;
}
