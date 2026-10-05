import test from 'node:test';
import assert from 'node:assert/strict';
import { adsenseConfig } from '../scripts/adsense.mjs';

test('AdSense remains disabled without a publisher account', () => {
  assert.deepEqual(adsenseConfig(), { meta: '', adsTxt: '' });
  assert.deepEqual(adsenseConfig('  '), { meta: '', adsTxt: '' });
});
test('both Google publisher formats generate matching verification and ads.txt', () => {
  const config = adsenseConfig('pub-1234567890123456');
  assert.deepEqual(config, adsenseConfig(' ca-pub-1234567890123456 '));
  assert.equal(config.meta, '<meta name="google-adsense-account" content="ca-pub-1234567890123456">');
  assert.equal(config.adsTxt, 'google.com, pub-1234567890123456, DIRECT, f08c47fec0942fa0\n');
  assert.doesNotMatch(config.meta, /<script/);
});
test('invalid publisher accounts fail rather than publish unusable configuration', () => {
  for (const value of ['pub-123', '<script>', 'pub-1234567890123456\nsubdomain=bad.test', 'ca-pub-12345678901234567']) {
    assert.throws(() => adsenseConfig(value), /ADSENSE_PUBLISHER_ID/);
  }
});
