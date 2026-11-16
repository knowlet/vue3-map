# Wait for the flow-layer script before map rendering

Base: 868f5d7caefd8d9a260ca240280e4e92de4d7e7b.

Home mounted started loading CanvasFlowmapLayer.js but ignored its promise. A
fast /api/cars response could call L.canvasFlowmapLayer before the script had
registered the factory, fail, and leave the flow map unrendered. Script failures
were not connected to the page's error/loading lifecycle either.

Join script loading and the API request with Promise.all. They remain concurrent,
but rendering starts only after both succeed. Either failure goes through the
existing error handler and clears loading; a later success cannot render after
the combined promise failed.

Dependency-free Node tests execute the actual Home.vue mounted script with
controlled deferred promises and fake Leaflet/API boundaries. The original code
fails the fast-API and script-rejection cases, while the script-first control
passes. Four final tests pass, including API rejection. These are lifecycle unit
tests, not visual/browser acceptance, and contact no real backend or tile server.

Validation: npm ci with the unchanged lockfile; npm test; direct vite build.
The full npm run build remains blocked by the pre-existing vue-tsc distribution
requiring an unavailable get-intrinsic module. Running that command with the
unchanged baseline Home.vue produces the same failure. No dependencies or
build checks are weakened to hide it; no deployment is performed.
