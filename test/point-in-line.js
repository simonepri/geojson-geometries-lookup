import test from 'ava';

import {point, lineString, featureCollection} from '@turf/helpers';

import M from '..';

test('exports a constructor.', t => {
  t.is(typeof M, 'function');
});

test('GeoJsonGeometriesLookup.getContainers() searches correctly.', t => {
  const geojson = featureCollection([
    lineString([[4, 6], [5, 6]], {id: 1}),
    lineString([[4, 1], [5, 1]], {id: 2}),
    lineString([[9, 6], [10, 6]], {id: 3})
  ]);

  const glookup = new M(geojson);

  const testCases = [
    point([1, 5]),
    point([6, 3]),
    point([4.5, 6], {id: 1}),
    point([5.5, 3.5]),
    point([4.5, 1], {id: 2}),
    point([9.5, 6], {id: 3}),
    point([9.7, 6.7]),
    point([10, 11]),
    point([4.5, 6], {id: 1})
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
  const geojson = featureCollection([
    lineString([[3, 3], [4, 3]], {id: 1}),
    lineString([[10, 9], [11, 9]], {id: 2}),
    lineString([[3, 3], [4, 3]], {id: 3}),
    lineString([[9, 10], [10, 10]], {id: 4}),
    lineString([[9, 9], [10, 9]], {id: 5}),
    lineString([[11, 10], [12, 10]], {id: 6}),
    lineString([[10, 11], [11, 11]], {id: 7})
  ]);

  const glookup = new M(geojson);

  const testCases = [
    {p: point([3.5, 3], {list: [{id: 1}, {id: 3}]}), lim: 0, len: 2},
    {p: point([3.5, 3], {list: [{id: 1}]}), lim: 1, len: 1},
    {p: point([10.5, 10]), lim: 0, len: 0}
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
  const geojson = featureCollection([
    lineString([[4, 6], [5, 6]], {id: 1}),
    lineString([[4, 1], [5, 1]], {id: 2}),
    lineString([[9, 6], [10, 6]], {id: 3}),
    lineString([[4, 6], [5, 6]], {id: 4})
  ]);

  const glookup = new M(geojson);

  const testCases = [
    {p: point([1, 5]), s: false},
    {p: point([6, 3]), s: false},
    {p: point([4.5, 6]), s: true},
    {p: point([5.5, 3.5]), s: false},
    {p: point([4.5, 1]), s: true},
    {p: point([9.5, 6]), s: true},
    {p: point([9.7, 6.7]), s: false},
    {p: point([10, 11]), s: false},
    {p: point([4.5, 6]), s: true}
  ];
  testCases.forEach((tc, id) => {
    const res = glookup.hasContainers(tc.p.geometry);
    t.is(res, tc.s, 'Failed at: ' + id);
  });
});
