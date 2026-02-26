# 📁 Folder and File Map (Canonical)

This is the single source of truth for **where code should live**.  
Humans use it to orient, AI uses it to place new files consistently.

## How to Read

- **Layer** = responsibility boundary (entry, presentation, interaction, state, domain, design-system, shared).
- **Domain** = business concept (workflow, registry, model, validation).
- **Placement rule** = where a new file should go, based on intent.

## Target Layered Map (Current)

```text
src/
├─ entry/               # app bootstrap + routing
├─ presentation/        # screens + feature composition
├─ interaction/         # canvas + user interaction hooks
├─ state/               # redux store + slices
├─ domain/              # workflow + model + registry
├─ design-system/       # UI primitives + components
├─ shared/              # constants + utils + lib
├─ modal/               # modal composition + host
└─ utils/               # legacy utilities (to be relocated)
```

## Placement Rules

- **UI composition** → `presentation/` (screens, panels, builders).
- **Interaction logic** → `interaction/` (canvas hooks, event bus).
- **State management** → `state/` (redux slices, selectors, store).
- **Domain logic** → `domain/` (workflow transforms, schema, registry).
- **Design system** → `design-system/` (shared UI components).
- **Cross-cutting helpers** → `shared/` (constants, utils, lib).
- **Entry wiring** → `entry/` (App, router).

## Boundary Rules

- Flow direction (industry vocabulary): **Entry → Presentation → Interaction/State → Domain → Shared**.
- `design-system` is consumed by `presentation` only.
- **No logic changes** during migration: only moves + import updates.

## Quick Navigation

- Entry: `src/entry/router.tsx`, `src/entry/App.tsx`
- Presentation: `src/presentation/screens/WorkflowScreen.tsx`
- Interaction: `src/interaction/canvas/CanvasContainer.tsx`
- Domain API: `src/domain/workflow/index.ts`
- Registry: `src/domain/registry/nodeRegistry.ts`
- Model: `src/domain/model/interface.ts`
