function compareResults(userResult, expectedResult, rowOrder, colOrder) {
  let u = userResult.values;
  let e = expectedResult.values;

  if (!rowOrder) {
    u = u.map(r => JSON.stringify(r)).sort();
    e = e.map(r => JSON.stringify(r)).sort();
  }

  if (!colOrder) {
    u = u.map(r => [...r].sort());
    e = e.map(r => [...r].sort());
  }

  return JSON.stringify(u) === JSON.stringify(e); //stringfiy kyunki array ko directky sort nhi kr skte
}

module.exports = compareResults;
