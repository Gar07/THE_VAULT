import assert from 'node:assert/strict';
import test from 'node:test';
import { accessTiers, validateEntry } from './access.js';

test('blank credentials and unavailable rooms cannot open the demo door', () => {
  assert.deepEqual(Object.keys(validateEntry({ username: '  ', password: '    ', tier: 'unknown' })), ['username', 'password', 'tier']);
});

test('the four-character demo boundary works for each available room', () => {
  for (const tier of accessTiers) {
    assert.ok(validateEntry({ username: 'Alex', password: '123', tier }).password);
    assert.deepEqual(validateEntry({ username: 'Alex', password: '1234', tier }), {});
  }
});

test('overlong names are rejected', () => {
  assert.ok(validateEntry({ username: 'A'.repeat(61), password: '1234', tier: accessTiers[0] }).username);
});
