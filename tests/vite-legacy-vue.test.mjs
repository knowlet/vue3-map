import assert from 'node:assert/strict'
import { test } from 'node:test'
import vue from '@vitejs/plugin-vue'
import { adaptLegacyVuePlugin } from '../vite-legacy-vue.mjs'

const modes = [
  ['client options', { ssr: false }, false],
  ['SSR options', { ssr: true }, true],
  ['empty options', {}, false],
  ['undefined', undefined, false],
  ['legacy client', false, false],
  ['legacy SSR', true, true],
]
for (const [label, options, ssr] of modes) {
  test(`legacy Vue transform and load: ${label}`, async () => {
    const plugin = adaptLegacyVuePlugin(vue())
    const id = `${process.cwd()}/tests/fixture-${label.replaceAll(' ', '-')}.vue`
    const context = { error(error) { throw error }, warn() {} }
    const result = await plugin.transform.call(context,
      '<script setup>const message = "hello"</script><template><p>{{message}}</p></template>',
      id, options)
    assert.equal(result.code.includes('@vue/server-renderer'), ssr)
    assert.equal(result.code.includes('__ssrInlineRender: true'), ssr)
    const script = plugin.load.call(context, `${id}?vue&type=script&setup=true&lang.js`, options)
    assert.ok(script?.code.includes('hello'), 'load must use the matching client/SSR script cache')
  })
}
test('wrapper preserves hook context, extra arguments and return values', () => {
  const context = {}
  const sentinel = Promise.resolve('unchanged')
  const plugin = adaptLegacyVuePlugin({
    load(...args) { assert.equal(this, context); assert.deepEqual(args, ['id', false, 'extra']); return sentinel },
    transform(...args) { assert.equal(this, context); assert.deepEqual(args, ['code', 'id', true, 'extra']); return sentinel },
  })
  assert.equal(plugin.load.call(context, 'id', { ssr: false }, 'extra'), sentinel)
  assert.equal(plugin.transform.call(context, 'code', 'id', { ssr: true }, 'extra'), sentinel)
})

test('configureServer facade preserves context, config and return value without mutation', () => {
  const context = {}
  const server = { config: { root: process.cwd() } }
  const sentinel = () => {}
  const plugin = adaptLegacyVuePlugin({
    load() {}, transform() {},
    configureServer(legacyServer) {
      assert.equal(this, context)
      assert.equal(legacyServer.config, server.config)
      assert.equal(Object.getPrototypeOf(legacyServer), server)
      assert.equal(typeof legacyServer.transformWithEsbuild, 'function')
      assert.equal('transformWithEsbuild' in server, false)
      return sentinel
    },
  })
  assert.equal(plugin.configureServer.call(context, server), sentinel)
})
