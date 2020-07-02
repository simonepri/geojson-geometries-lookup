const test = require('ava');

const {lineString, featureCollection} = require('@turf/helpers');

const M = require('..');

test('exports a constructor.', t => {
  t.is(typeof M, 'function');
});

test('GeoJsonGeometriesLookup.getContainers() searches correctly.', t => {
  /* eslint-disable prettier/prettier */
  const geojson = featureCollection([
    lineString([[4, 6], [5, 6]], {id: 1}),
    lineString([[4, 1], [5, 1]], {id: 2}),
    lineString([[9, 6], [10, 6]], {id: 3})
  ]);
  /* eslint-enable prettier/prettier */

  const glookup = new M(geojson);

  /* eslint-disable prettier/prettier */
  const testCases = [
    lineString([[1, 5], [1, 5]]),
    lineString([[6, 3], [6, 3]]),
    lineString([[4.5, 6], [4.5, 6]], {id: 1}),
    lineString([[5.5, 3.5], [5.5, 3.5]]),
    lineString([[4.5, 1], [4.5, 1]], {id: 2}),
    lineString([[9.5, 6], [9.5, 6]], {id: 3}),
    lineString([[9.7, 6.7], [9.7, 6.7]]),
    lineString([[10, 11], [10, 11]]),
    lineString([[4.5, 6], [4.5, 6]], {id: 1})
  ];
  /* eslint-enable prettier/prettier */

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
    lineString([[3, 3], [4, 3]], {id: 1}),
    lineString([[10, 9], [11, 9]], {id: 2}),
    lineString([[3, 3], [4, 3]], {id: 3}),
    lineString([[9, 10], [10, 10]], {id: 4}),
    lineString([[9, 9], [10, 9]], {id: 5}),
    lineString([[11, 10], [12, 10]], {id: 6}),
    lineString([[10, 11], [11, 11]], {id: 7})
  ]);
  /* eslint-enable prettier/prettier */

  const glookup = new M(geojson);

  /* eslint-disable prettier/prettier */
  const testCases = [
    {
      p: lineString([[3.5, 3], [3.5, 3]], {list: [{id: 1}, {id: 3}]}),
      lim: 0,
      len: 2
    },
    {p: lineString([[3.5, 3], [3.5, 3]], {list: [{id: 1}]}), lim: 1, len: 1},
    {p: lineString([[10.5, 10], [10.5, 10]]), lim: 0, len: 0}
  ];
  /* eslint-enable prettier/prettier */

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
    lineString([[4, 6], [5, 6]], {id: 1}),
    lineString([[4, 1], [5, 1]], {id: 2}),
    lineString([[9, 6], [10, 6]], {id: 3}),
    lineString([[4, 6], [5, 6]], {id: 4})
  ]);
  /* eslint-enable prettier/prettier */

  const glookup = new M(geojson);

  /* eslint-disable prettier/prettier */
  const testCases = [
    {p: lineString([[1, 5], [1, 5]]), s: false},
    {p: lineString([[6, 3], [6, 3]]), s: false},
    {p: lineString([[4.5, 6], [4.5, 6]]), s: true},
    {p: lineString([[5.5, 3.5], [5.5, 3.5]]), s: false},
    {p: lineString([[4.5, 1], [4.5, 1]]), s: true},
    {p: lineString([[9.5, 6], [9.5, 6]]), s: true},
    {p: lineString([[9.7, 6.7], [9.7, 6.7]]), s: false},
    {p: lineString([[10, 11], [10, 11]]), s: false},
    {p: lineString([[4.5, 6], [4.5, 6]]), s: true}
  ];
  /* eslint-enable prettier/prettier */

  testCases.forEach((tc, id) => {
    const res = glookup.hasContainers(tc.p.geometry);
    t.is(res, tc.s, 'Failed at: ' + id);
  });
});
