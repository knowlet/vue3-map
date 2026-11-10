import { transformWithEsbuild } from 'vite'

// @vitejs/plugin-vue 1.x uses a boolean SSR argument. Vite 6 passes an
// options object, which the legacy plugin otherwise mistakes for SSR=true.
export function adaptLegacyVuePlugin(plugin) {
  for (const [name, optionsIndex] of [['load', 1], ['transform', 2]]) {
    const hook = plugin[name]
    plugin[name] = function (...args) {
      const options = args[optionsIndex]
      if (options && typeof options === 'object') {
        args[optionsIndex] = Boolean(options.ssr)
      }
      return hook.apply(this, args)
    }
  }
  // Vite 6 exposes this helper as an export rather than a server method.
  const configureServer = plugin.configureServer
  plugin.configureServer = function (server) {
    const legacyServer = Object.create(server)
    legacyServer.transformWithEsbuild = async (...args) => {
      const result = await transformWithEsbuild(...args)
      // Legacy source-map rejects an explicitly undefined sourceRoot.
      if (result.map.sourceRoot === undefined) delete result.map.sourceRoot
      return result
    }
    return configureServer.call(this, legacyServer)
  }
  return plugin
}
