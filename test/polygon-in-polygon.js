import test from 'ava';

import {
  polygon,
  featureCollection
} from '@turf/helpers';

import M from '..';

test('exports a constructor.', t => {
  t.is(typeof M, 'function');
});

test('GeoJsonGeometriesLookup.search() searches correctly.', t => {
  const geojson = featureCollection([
    polygon([[[2, 2], [6, 4], [4, 7], [2, 2]]], {id: 1}),
    polygon([[[3, 0], [7, 2], [4, 4], [3, 0]]], {id: 2}),
    polygon([[[8, 5], [10, 6], [9, 7], [8, 5]]], {id: 3})
  ]);

  const glookup = new M(geojson);

  const testCases = [
    polygon([[[1, 5], [1, 5], [1, 5], [1, 5]]]),
    polygon([[[6, 3], [6, 3], [6, 3], [6, 3]]]),
    polygon([[[4, 6], [4, 6], [4, 6], [4, 6]]], {id: 1}),
    polygon([[[3.5, 3.5], [3.5, 3.5], [3.5, 3.5], [3.5, 3.5]]], {id: 1}),
    polygon([[[5.5, 3.5], [5.5, 3.5], [5.5, 3.5], [5.5, 3.5]]]),
    polygon([[[4, 1], [4, 1], [4, 1], [4, 1]]], {id: 2}),
    polygon([[[9, 6], [9, 6], [9, 6], [9, 6]]], {id: 3}),
    polygon([[[9.7, 6.7], [9.7, 6.7], [9.7, 6.7], [9.7, 6.7]]]),
    polygon([[[10, 11], [10, 11], [10, 11], [10, 11]]]),
    polygon([[[3, 3.9], [3, 3.9], [3, 3.9], [3, 3.9]]], {id: 1})
  ];
  testCases.forEach((tc, id) => {
    const res = glookup.getContainers(tc.geometry);
    if (Object.keys(tc.properties).length === 0) {
      t.is(res.features.length, 0, 'Failed at: ' + id);
    } else {
      t.is(res.features.length, 1, 'Failed at: ' + id);
      t.deepEqual(res.features[0].properties, tc.properties, 'Failed at: ' + id);
    }
  });
});

test('GeoJsonGeometriesLookup.search() handles polygons with multiple rings.', t => {
  const geojson = featureCollection([
    polygon([
      [[1, 12], [0, 0], [15, -1], [15, 13], [1, 12]],
      [[2, 11], [1, 2], [6, 0], [14, 0], [14, 11], [2, 11]]
    ], {id: 0}),
    polygon([
      [[1, 2], [7, 1], [8, 9], [3, 7], [1, 2]],
      [[3, 3], [6, 3], [6, 7], [4, 6], [3, 3]]  // Hole
    ], {id: 1}),
    polygon([
      [[3, 3], [6, 3], [6, 7], [4, 6], [3, 3]]  // Hole
    ], {id: 2})
  ]);

  const glookup = new M(geojson);

  const testCases = [
    polygon([[[10, 12], [10, 12], [10, 12], [10, 12]]], {id: 0}),
    polygon([[[5, 4], [5, 4], [5, 4], [5, 4]]], {id: 2}),
    polygon([[[2, 3], [2, 3], [2, 3], [2, 3]]], {id: 1}),
    polygon([[[13, 4], [13, 4], [13, 4], [13, 4]]])
  ];
  testCases.forEach((tc, id) => {
    const res = glookup.getContainers(tc.geometry);
    if (Object.keys(tc.properties).length === 0) {
      t.is(res.features.length, 0, 'Failed at: ' + id);
    } else {
      t.is(res.features.length, 1, 'Failed at: ' + id);
      t.deepEqual(res.features[0].properties, tc.properties, 'Failed at: ' + id);
    }
  });
});

test('GeoJsonGeometriesLookup.search() respects limit argument.', t => {
  const geojson = featureCollection([
    polygon([[[2, 2], [6, 4], [4, 7], [2, 2]]], {id: 1}),
    polygon([[[3, 0], [7, 2], [4, 4], [3, 0]]], {id: 2}),
    polygon([[[1, 0], [10, 2], [2, 7], [1, 0]]], {id: 3})
  ]);

  const glookup = new M(geojson);

  const testCases = [
    {p: polygon([[[3, 3], [3, 3], [3, 3], [3, 3]]], {list: [{id: 1}, {id: 3}]}), lim: 0, len: 2},
    {p: polygon([[[3, 3], [3, 3], [3, 3], [3, 3]]], {list: [{id: 1}]}), lim: 1, len: 1},
    {p: polygon([[[10, 10], [10, 10], [10, 10], [10, 10]]]), lim: 0, len: 0}
  ];
  testCases.forEach((tc, id) => {
    const res = glookup.getContainers(tc.p.geometry, {limit: tc.lim});
    t.is(res.features.length, tc.len, 'Failed at: ' + id);
    if (tc.len > 0) {
      for (let i = 0; i < tc.len; i++) {
        t.deepEqual(res.features[i].properties, tc.p.properties.list[i], 'Failed at: ' + id + ' result: ' + i);
      }
    }
  });
});

test('GeoJsonGeometriesLookup.collides() works correctly.', t => {
  const geojson = featureCollection([
    polygon([[[2, 2], [6, 4], [4, 7], [2, 2]]], {id: 1}),
    polygon([[[3, 0], [7, 2], [4, 4], [3, 0]]], {id: 2}),
    polygon([[[8, 5], [10, 6], [9, 7], [8, 5]]], {id: 3}),
    polygon([[[2, 2], [6, 4], [4, 7], [2, 2]]], {id: 4})
  ]);

  const glookup = new M(geojson);

  const testCases = [
    {p: polygon([[[1, 5], [1, 5], [1, 5], [1, 5]]]), s: false},
    {p: polygon([[[6, 3], [6, 3], [6, 3], [6, 3]]]), s: false},
    {p: polygon([[[4, 6], [4, 6], [4, 6], [4, 6]]]), s: true},
    {p: polygon([[[3.5, 3.5], [3.5, 3.5], [3.5, 3.5], [3.5, 3.5]]]), s: true},
    {p: polygon([[[5.5, 3.5], [5.5, 3.5], [5.5, 3.5], [5.5, 3.5]]]), s: false},
    {p: polygon([[[4, 1], [4, 1], [4, 1], [4, 1]]]), s: true},
    {p: polygon([[[9, 6], [9, 6], [9, 6], [9, 6]]]), s: true},
    {p: polygon([[[9.7, 6.7], [9.7, 6.7], [9.7, 6.7], [9.7, 6.7]]]), s: false},
    {p: polygon([[[10, 11], [10, 11], [10, 11], [10, 11]]]), s: false},
    {p: polygon([[[3, 3.9], [3, 3.9], [3, 3.9], [3, 3.9]]]), s: true}
  ];
  testCases.forEach((tc, id) => {
    const res = glookup.hasContainers(tc.p.geometry);
    t.is(res, tc.s, 'Failed at: ' + id);
  });
});
