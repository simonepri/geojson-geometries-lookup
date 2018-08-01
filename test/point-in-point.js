import test from 'ava';

import {point, featureCollection} from '@turf/helpers';

import M from '..';

test('exports a constructor.', t => {
  t.is(typeof M, 'function');
});

test('GeoJsonGeometriesLookup.search() searches correctly.', t => {
  const geojson = featureCollection([
    point([4, 6], {id: 1}),
    point([4, 1], {id: 2}),
    point([9, 6], {id: 3})
  ]);

  const glookup = new M(geojson);

  const testCases = [
    point([1, 5]),
    point([6, 3]),
    point([4, 6], {id: 1}),
    point([5.5, 3.5]),
    point([4, 1], {id: 2}),
    point([9, 6], {id: 3}),
    point([9.7, 6.7]),
    point([10, 11]),
    point([4, 6], {id: 1})
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

test('GeoJsonGeometriesLookup.search() respects limit argument.', t => {
  const geojson = featureCollection([
    point([3, 3], {id: 1}),
    point([10, 9], {id: 2}),
    point([3, 3], {id: 3}),
    point([9, 10], {id: 4}),
    point([9, 9], {id: 5}),
    point([11, 10], {id: 6}),
    point([10, 11], {id: 7})
  ]);

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

test('GeoJsonGeometriesLookup.collides() works correctly.', t => {
  const geojson = featureCollection([
    point([4, 6], {id: 1}),
    point([4, 1], {id: 2}),
    point([9, 6], {id: 3}),
    point([4, 6], {id: 4})
  ]);

  const glookup = new M(geojson);

  const testCases = [
    {p: point([1, 5]), s: false},
    {p: point([6, 3]), s: false},
    {p: point([4, 6]), s: true},
    {p: point([5.5, 3.5]), s: false},
    {p: point([4, 1]), s: true},
    {p: point([9, 6]), s: true},
    {p: point([9.7, 6.7]), s: false},
    {p: point([10, 11]), s: false},
    {p: point([4, 6]), s: true}
  ];
  testCases.forEach((tc, id) => {
    const res = glookup.hasContainers(tc.p.geometry);
    t.is(res, tc.s, 'Failed at: ' + id);
  });
});
