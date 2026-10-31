const test = require('node:test');
const assert = require('node:assert/strict');
const { getLocalDateString } = require('../utils/date');

test('getLocalDateString uses the local calendar date instead of UTC date', () => {
  const date = new Date('2025-01-30T22:30:00+03:00');
  assert.equal(getLocalDateString(date), '2025-01-30');

  const nextDay = new Date('2025-01-31T14:20:00+03:00');
  assert.equal(getLocalDateString(nextDay), '2025-01-31');
});
