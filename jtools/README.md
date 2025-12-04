# JTools

## Adding a new tool

Follow this contract whenever you introduce a new tool:

1. Create a folder at `jtools/src/tools/<slug>` that exports the tool component as the default export and a `ToolDefinition` named `<slug>Definition`.
2. Add that definition to the `toolRegistry` array in `src/routes/ToolRegistry.ts` so the tool appears in navigation and routing.
3. Keep the metadata complete (slug, name, description, tags, optional icon, and component) so development-time validation passes.

You can automate the setup with `npm run scaffold:tool`, which prompts for the tool details, scaffolds the folder, and registers the tool in `ToolRegistry`.
