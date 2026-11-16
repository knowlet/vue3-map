const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

function deferred() {
  let resolve, reject;
  const promise = new Promise((yes, no) => { resolve = yes; reject = no; });
  // Keep the deliberately rejected dependency observable without an unhandled
  // rejection on the old implementation that ignores the loader promise.
  promise.catch(() => {});
  return { promise, resolve, reject };
}
const flush = () => new Promise(resolve => setImmediate(resolve));

function setup() {
  const script = fs.readFileSync('src/components/Home.vue', 'utf8')
    .match(/<script>([\s\S]*?)<\/script>/)[1]
    .replace(/^import .*;\s*$/gm, '')
    .replace('export default', 'module.exports =');
  const dependency = deferred();
  const request = deferred();
  const errors = [];
  const flows = [];
  let ready = false;
  const map = { setView() { return this; }, addLayer() {} };
  const context = {
    module: { exports: {} }, console: { log() {} }, icon: '', iconShadow: '',
    L: {
      Marker: { prototype: { options: {} } }, icon() {}, map: () => map,
      tileLayer: () => ({ addTo() {} }),
      canvasFlowmapLayer(...args) {
        assert.equal(ready, true, 'flow plugin used before it finished loading');
        flows.push(args);
        return { addTo() { return this; }, on() {} };
      },
    },
    MarkerClusterGroup: class { addLayer() {} },
    axios: { get: () => request.promise },
    ElMessage: { success() {}, error: value => errors.push(value) },
  };
  vm.runInNewContext(script, context);
  const instance = {
    fullscreenLoading: false,
    $loadScript: () => dependency.promise,
  };
  context.module.exports.mounted.call(instance);
  return { instance, request, dependency, errors, flows, ready: () => { ready = true; } };
}

test('fast API response waits for the flow layer dependency', async () => {
  const s = setup();
  s.request.resolve({ data: [] });
  await flush();
  assert.equal(s.flows.length, 0);
  assert.deepEqual(s.errors, []);
  assert.equal(s.instance.fullscreenLoading, true);
  s.ready(); s.dependency.resolve();
  await flush();
  assert.equal(s.flows.length, 1);
  assert.equal(s.instance.fullscreenLoading, false);
});

test('dependency failure is surfaced and clears loading without rendering', async () => {
  const s = setup();
  s.dependency.reject(new Error('plugin unavailable'));
  await flush();
  assert.deepEqual(s.errors, ['plugin unavailable']);
  assert.equal(s.instance.fullscreenLoading, false);
  assert.equal(s.flows.length, 0);
  s.request.resolve({ data: [] });
  await flush();
  assert.equal(s.flows.length, 0);
});

test('slow API still renders once after dependency readiness', async () => {
  const s = setup();
  s.ready(); s.dependency.resolve();
  await flush();
  assert.equal(s.flows.length, 0);
  s.request.resolve({ data: [] });
  await flush();
  assert.equal(s.flows.length, 1);
  assert.deepEqual(s.errors, []);
  assert.equal(s.instance.fullscreenLoading, false);
});

test('API failure is surfaced without waiting for the dependency', async () => {
  const s = setup();
  s.request.reject(new Error('API unavailable'));
  await flush();
  assert.deepEqual(s.errors, ['API unavailable']);
  assert.equal(s.instance.fullscreenLoading, false);
  s.ready(); s.dependency.resolve();
  await flush();
  assert.equal(s.flows.length, 0);
});
