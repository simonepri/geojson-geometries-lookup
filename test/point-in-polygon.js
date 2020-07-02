import test from 'ava';

import {point, polygon, featureCollection} from '@turf/helpers';

import M from '..';

test('exports a constructor.', t => {
  t.is(typeof M, 'function');
});

test('GeoJsonGeometriesLookup.getContainers() searches correctly.', t => {
  /* eslint-disable prettier/prettier */
  const geojson = featureCollection([
    polygon([[[2, 2], [6, 4], [4, 7], [2, 2]]], {id: 1}),
    polygon([[[3, 0], [7, 2], [4, 4], [3, 0]]], {id: 2}),
    polygon([[[8, 5], [10, 6], [9, 7], [8, 5]]], {id: 3})
  ]);
  /* eslint-enable prettier/prettier */

  const glookup = new M(geojson);

  const testCases = [
    point([1, 5]),
    point([6, 3]),
    point([4, 6], {id: 1}),
    point([3.5, 3.5], {id: 1}),
    point([5.5, 3.5]),
    point([4, 1], {id: 2}),
    point([9, 6], {id: 3}),
    point([9.7, 6.7]),
    point([10, 11]),
    point([3, 3.9], {id: 1})
  ];
  testCases.forEach((tc, id) => {
    const res = glookup.getContainers(tc.geometry);
    if (Object.keys(tc.properties).length === 0) {
      t.is(res.features.length, 0, 'Failed at: ' + id);
    } else {
      t.is(res.features.length, 1, 'Failed at: ' + id);
      t.deepEqual(
        res.features[0].properties,
        tc.properties,
        'Failed at: ' + id
      );
    }
  });
});

test('GeoJsonGeometriesLookup.getContainers() handles polygons with multiple rings.', t => {
  /* eslint-disable prettier/prettier */
  const geojson = featureCollection([
    polygon(
      [
        [[1, 12], [0, 0], [15, -1], [15, 13], [1, 12]],
        [[2, 11], [1, 2], [6, 0], [14, 0], [14, 11], [2, 11]]
      ],
      {id: 0}
    ),
    polygon(
      [
        [[1, 2], [7, 1], [8, 9], [3, 7], [1, 2]],
        [[3, 3], [6, 3], [6, 7], [4, 6], [3, 3]] // Hole
      ],
      {id: 1}
    ),
    polygon(
      [
        [[3, 3], [6, 3], [6, 7], [4, 6], [3, 3]] // Hole
      ],
      {id: 2}
    )
  ]);
  /* eslint-enable prettier/prettier */

  const glookup = new M(geojson);

  const testCases = [
    point([10, 12], {id: 0}),
    point([5, 4], {id: 2}),
    point([2, 3], {id: 1}),
    point([13, 4])
  ];
  testCases.forEach((tc, id) => {
    const res = glookup.getContainers(tc.geometry);
    if (Object.keys(tc.properties).length === 0) {
      t.is(res.features.length, 0, 'Failed at: ' + id);
    } else {
      t.is(res.features.length, 1, 'Failed at: ' + id);
      t.deepEqual(
        res.features[0].properties,
        tc.properties,
        'Failed at: ' + id
      );
    }
  });
});

test('GeoJsonGeometriesLookup.getContainers() respects limit argument.', t => {
  /* eslint-disable prettier/prettier */
  const geojson = featureCollection([
    polygon([[[2, 2], [6, 4], [4, 7], [2, 2]]], {id: 1}),
    polygon([[[3, 0], [7, 2], [4, 4], [3, 0]]], {id: 2}),
    polygon([[[1, 0], [10, 2], [2, 7], [1, 0]]], {id: 3})
  ]);
  /* eslint-enable prettier/prettier */

  const glookup = new M(geojson);

  const testCases = [
    {p: point([3, 3], {list: [{id: 1}, {id: 3}]}), lim: 0, len: 2},
    {p: point([3, 3], {list: [{id: 1}]}), lim: 1, len: 1},
    {p: point([10, 10]), lim: 0, len: 0}
  ];
  testCases.forEach((tc, id) => {
    const res = glookup.getContainers(tc.p.geometry, {limit: tc.lim});
    t.is(res.features.length, tc.len, 'Failed at: ' + id);
    if (tc.len > 0) {
      for (let i = 0; i < tc.len; i++) {
        t.deepEqual(
          res.features[i].properties,
          tc.p.properties.list[i],
          'Failed at: ' + id + ' result: ' + i
        );
      }
    }
  });
});

test('GeoJsonGeometriesLookup.hasContainers() works correctly.', t => {
  /* eslint-disable prettier/prettier */
  const geojson = featureCollection([
    polygon([[[2, 2], [6, 4], [4, 7], [2, 2]]], {id: 1}),
    polygon([[[3, 0], [7, 2], [4, 4], [3, 0]]], {id: 2}),
    polygon([[[8, 5], [10, 6], [9, 7], [8, 5]]], {id: 3}),
    polygon([[[2, 2], [6, 4], [4, 7], [2, 2]]], {id: 4})
  ]);
  /* eslint-enable prettier/prettier */

  const glookup = new M(geojson);

  const testCases = [
    {p: point([1, 5]), s: false},
    {p: point([6, 3]), s: false},
    {p: point([4, 6]), s: true},
    {p: point([3.5, 3.5]), s: true},
    {p: point([5.5, 3.5]), s: false},
    {p: point([4, 1]), s: true},
    {p: point([9, 6]), s: true},
    {p: point([9.7, 6.7]), s: false},
    {p: point([10, 11]), s: false},
    {p: point([3, 3.9]), s: true}
  ];
  testCases.forEach((tc, id) => {
    const res = glookup.hasContainers(tc.p.geometry);
    t.is(res, tc.s, 'Failed at: ' + id);
  });
});
