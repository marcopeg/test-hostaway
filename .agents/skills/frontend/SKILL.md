---
name: frontend
description: Use this skill when you are dealing with the frontend of the application
---

When implementing React containers, split logic from rendering:

- Put each container in its own kebab-case folder under `apps/webapp/src/containers`, for example `containers/container-name/ContainerName.tsx`.
- Add `containers/container-name/index.ts` to export the container.
- `ContainerName.tsx` contains the data loading, hooks, state, and event logic.
- `ContainerNameUI.tsx` contains the pure rendering component that receives data and callbacks via props.

Use arrow components (`const ComponentName = () => {}`), not `function` declarations.

## Frontend TypeScript Preferences

- Use arrow functions for React components and frontend helpers.
- Define component props with local `type ComponentNameProps = { ... }` aliases.
- Keep GraphQL query and subscription result types explicit near the container that uses them.
- Containers should pass plain typed props into their `ContainerNameUI.tsx` rendering component.
- Prefer the configured import aliases (`providers`, `containers`, `components`, `hooks`, `lib`) over deep relative paths when importing across folders.
- Avoid `React.FC`; type props directly on the arrow component parameter.
