import { createServer } from 'vite'
import { test } from 'node:test'
import { writeFile, unlink } from 'node:fs/promises'
import assert from 'node:assert/strict'
const root = new URL('../', import.meta.url).pathname
test('Vite 6 serves TypeScript SFCs and emits HMR updates', async () => {
const path = root + 'tests/.hmr-smoke.vue'
const server = await createServer({ root, server: { host: '127.0.0.1', port: 0 } })
let updates = []
const send = server.ws.send.bind(server.ws)
server.ws.send = (...args) => { updates.push(args[0]); return send(...args) }
try {
  await writeFile(path, '<template><p>before</p></template>')
  await server.listen()
  const url = `http://127.0.0.1:${server.httpServer.address().port}`
  const response = await fetch(url + '/src/App.vue')
  const app = await response.text()
  assert.equal(response.status, 200)
  assert.ok(app.includes('import.meta.hot.accept'))
  assert.ok(!app.includes('@vue/server-renderer'))
  const before = await (await fetch(url + '/tests/.hmr-smoke.vue')).text()
  assert.ok(before.includes('before'))
  await new Promise(resolve => setTimeout(resolve, 300))
  await writeFile(path, '<template><p>after</p></template>')
  for (let i = 0; i < 50 && !updates.some(x => x?.type === 'update'); i++) await new Promise(resolve => setTimeout(resolve, 100))
  assert.ok(updates.some(x => x?.type === 'update' && x.updates.some(u => u.path.includes('.hmr-smoke.vue'))), 'HMR update emitted')
  const after = await (await fetch(url + '/tests/.hmr-smoke.vue')).text()
  assert.ok(after.includes('after'))
  assert.ok(!after.includes('@vue/server-renderer'))
  assert.ok(after.includes('import.meta.hot.accept'))
} finally {
  await server.close()
  await unlink(path)
}

})
