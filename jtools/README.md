# JTools

## Adding a new tool

Follow this contract whenever you introduce a new tool:

1. Create a folder at `jtools/src/tools/<slug>` that exports the tool component as the default export and a `ToolDefinition` named `<slug>Definition`.
2. Add that definition to the `toolRegistry` array in `src/routes/ToolRegistry.ts` so the tool appears in navigation and routing.
3. Keep the metadata complete (slug, name, description, tags, optional icon, and component) so development-time validation passes.

You can automate the setup with `npm run scaffold:tool`, which prompts for the tool details, scaffolds the folder, and registers the tool in `ToolRegistry`.

## Local testing and previews

To test the app locally (useful if your hosting environment shows SSL errors):

1. Install dependencies: `npm install` (Node 18+ recommended).
2. Start the dev server: `npm run dev` then open the printed local URL (usually `http://localhost:5173`).
3. Preview a production build locally: `npm run build` then `npm run preview`, and open the preview URL shown in the terminal.
4. If you want to verify the already-built static output in `release/`, serve it with any static server, e.g. `npx serve release` and browse to the displayed address.
