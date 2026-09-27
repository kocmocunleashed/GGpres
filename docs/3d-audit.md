# 3D audit and replacement

The previous diagrams used one endlessly repeating transfer animation for unrelated ideas. That made CPU time look like data delivery, suggested RAM saved automatically to storage, and showed uploads before anyone chose to send a file. Some objects were hidden below the floor; labels were too small; every file looked like a picture.

The replacement keeps the original workstation loading screen, START button, desk models and camera entrance. Clicking the computer still enters the desktop. Language remains in Settings.

## Teaching model

Each of the 17 chapters has explicit states and actions. A single state supplies the 3D objects, labels, controls, explanation and accessible fallback. The renderer never advances teaching state. It renders on demand, without looping transfers. Reducing motion or turning 3D off preserves the example's result.

- Drawing and saving are separate. A saved file appears only after the example's save action.
- Power loss clears the working data in RAM while saved storage persists.
- CPU scheduling highlights one running process per illustrated core. Processes stay in place.
- Saving distinguishes a request, an access check and a completed save. Driver software is described within OS services.
- Desktop and terminal are interfaces; hardware is physical. Fedora Workstation contains Linux, GNOME and applications; it is not a pipeline.
- OS comparisons identify Fedora as a distribution. The lesson's preference for Fedora is a teaching choice, not a privacy or safety score.
- Source code, permission decisions, security questions and reporting choices have their own actions and explanations.
- Network examples show one selected event. Granting local access does not send a network message.
- Uploading leaves a local copy and creates a remote copy. Reset only resets the lesson example.
- Text files show text; `ls` lists names and `cat` displays contents from the simulated filesystem.

## Rendering and interaction

Distinct models separate software windows, processes, CPU, RAM, storage, image files, text files and servers. Readable HTML labels name the objects directly. A collection boundary means software composition. Any arrow has an explicit relationship label.

The canvas remains mounted between chapters and uses demand rendering. The same controls and outcome remain available after WebGL failure or when graphics are disabled. Geometry and labels must fit desktop and mobile layouts in both English and Mongolian.

Physical objects ignore pointer releases after camera drags. The computer case and its power button have separate hover labels and actions.

## Verification

Unit tests check meaningful state consequences, valid transitions, filesystem examples, geometry framing and drag rejection. Browser tests traverse all states in all 17 chapters in both languages at desktop and mobile sizes, check label bounds and state contents, exercise fallback and graphics preferences, and verify the original workstation entrance and interactions. Screenshots require visual review; passing canvas counts alone is insufficient.

Local verification on 27 September 2026:

- `bun run test`: 76 passed, including state consequences, all model bounds, exact file text, resource disposal and workstation drag rejection.
- `bun run lint`, `bun run check:presentation`, `bun run build` and `git diff --check`: passed. The build also runs TypeScript checking.
- Ten workstation browser scenarios passed: original loading/START and physical computer entry, session persistence, five object drag/click checks, note/power/coffee controls, reduced motion, actual WebGL context loss and mobile framing.
- Fifteen lesson browser scenarios passed on the final production build. The matrix traverses all 57 states and eight questions in English and Mongolian at desktop and mobile sizes. Additional checks cover 320px layouts, keyboard focus, Settings language, persistent graphics preferences, blocked storage, Files/Terminal, context loss/retry, read-along resizing, idle draw counts and GPU allocation cleanup.
- Visual review covered all 228 language/viewport state captures and the workstation captures. The final core highlight and shortened terminal labels were rechecked at desktop and mobile sizes.

Browser verification uses Chromium with SwiftShader. This checks real WebGL rendering and context loss in that environment; it does not establish compatibility with every browser or GPU driver.

To repeat against a running production build:

```sh
E2E_BASE_URL=http://localhost:3002 bun run test:e2e
```

Set `E2E_CHROMIUM_PATH` if Chromium is installed outside Playwright's default location. `E2E_OUTPUT_DIR` selects the screenshot and trace directory.

After pushing, inspect the GitHub deployment for that commit and its Vercel aliases, then run the complete 25-scenario suite with `E2E_BASE_URL=https://press.leoh.site`. The delivery report records the deployed commit and live results so they refer to the exact revision tested.
