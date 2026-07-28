## Thinking Process
Everytime you do thinking, add the summary of your thoughts in ObsidianVault under thinking folder. or .agents/thinking/ with session_id as tag

## Code Navigation

Always use **CodeGraph** before reading or searching project files. Use `codegraph_explore` (or `codegraph explore` if MCP is unavailable) for architecture, code flow, symbol lookup, and implementation questions. Treat CodeGraph results as the source of truth and do **not** follow up with grep, glob, or file reads unless CodeGraph explicitly indicates the project is not indexed or you need to inspect code changed after the last sync. Avoid re-reading files already returned by CodeGraph.

## Hero Animation (WIP)

- **Current**: Three.js FBM "ink-in-water" shader in `components/HeroScene.tsx` + `HeroShader.ts`
- **Status**: `archive/wave2-hero-designs/index.html` has 6 novel Canvas 2D/CSS designs awaiting user ranking. Batch 1 archived in `archive/wave1-hero-designs/`. No need to recreate sample files.
- **User rejected** Three.js/WebGL FBM shaders — prefers Canvas 2D or CSS animations. Must be genuinely novel (different visual mechanism per design).
- **Brain vault**: `docs/brain/` (symlink → `~/ObsidianVault/Projects_Portfolio2/`) — read past decisions before re-deciding anything. Always access via `./docs/brain/`, never construct the vault path by hand. If the symlink is missing, re-init with `brain-init "$PWD"`.

## Browser QA Workflow

For all UI work, follow this loop:

1. Start the dev server if not running (`npm run dev`).
2. Open the affected route in the Playwright browser (`browser_navigate` to `http://localhost:3000`).
3. Take a screenshot (`browser_screenshot`) at desktop (1440px) and mobile (390px).
4. Inspect the accessibility tree (`browser_snapshot`).
5. Check browser console for errors (`browser_console_messages`).
6. Interact with the main user flow (scroll, click nav links, etc.).
7. Run `npm run test:e2e` and read the output.
8. If any test fails or the screenshot reveals layout/spacing/overflow/missing content issues — fix and repeat from step 2.
9. Do NOT mark the task complete until all tests pass and the visual inspection is clean.

## When to Update Visual Baselines

Only run `npm run test:e2e:update` when the design has **intentionally** changed.
Never auto-update baselines to make a failing test pass without reviewing the diff.

## Reference Screenshots

Existing reference screenshots live in `test-screenshots/`. Use these as visual targets when building or modifying UI sections.
System screenshots get saved at: `/home/sanket758/Pictures/Screenshots` directory.

## Test Commands

| Command | Purpose |
|---|---|
| `npm run test:e2e` | Run all Playwright tests |
| `npm run test:e2e:update` | Regenerate visual baselines after intentional design changes |
| `npm run test:e2e:headed` | Run tests in visible browser for debugging |

### Visual Verification Rules
After making any code/CSS change, open the localhost URL using Chrome DevTools MCP, take a full-page screenshot and fetch the element's getBoundingClientRect(). Inspect the visual layout to confirm the fix before marking the task complete.
1. Never mark a UI bug as "fixed" based on code modification alone.
2. After changing frontend files:
   - Trigger a hard reload via Chrome DevTools MCP.
   - Run `getBoundingClientRect()` on affected DOM nodes to verify dimensions and position.
   - Capture a screenshot via DevTools MCP and evaluate visual correctness.
3. If layout coordinates or visual outputs do not match expectations, rollback/adjust code and re-test.

If you dont have ability to look at images/screenshots, define a new subagent inside .opencode/agents/ directory if not already done and ask the agent to use local ollama models (multimodal) to analyze the screenshots for you. Also you can use power of embeddings to index the images.

