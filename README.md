# Workflow Visualizer (Next.js)
Next.js 14 (App Router), React 18, TypeScript (strict), Tailwind, React Flow, GSAP, Zod, localStorage.

    npm install
    npm run dev      # http://localhost:3000
    npm run lint     # tsc --noEmit
    npm test         # vitest
    npm run build

No API key needed. AI nodes are simulated and labeled as such. Data is stored in this browser only.

## Structure
src/app (routes) · src/components (layout, workflow-editor) · src/lib/workflow-engine (engine, node definitions) · src/lib/storage (zod-validated localStorage) · src/features/templates · src/hooks · src/types · tests

## Not yet implemented
Rename/context menus, grid/list toggle, import/export UI, undo/redo, inspector validation, more node types, execution animation on edges, settings beyond theme, mobile library drawer, more GSAP.
