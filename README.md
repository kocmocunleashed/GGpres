# opitlcalOS — Your computer, your choices

A presentation in English and Mongolian about operating systems, Linux, Fedora, security, and privacy. Follow one blue cat drawing from opening an app to saving and sharing it. The presentation has 17 chapters and eight review questions: 25 pages, with short slides for presenting and the complete manuscript for self-study. Technical terms such as RAM, CPU, and kernel stay in English in the Mongolian version.

The slides use cobalt blue, warm paper, large type, and diagrams built around the cat's story. The original 3D workstation and fictional GNOME-inspired desktop remain available for exploring files and trying the lesson's commands.

## Run

```bash
bun install
bun dev
```

Open the presentation directly at [localhost:3000/presentation](http://localhost:3000/presentation), or enter the 3D workstation at [localhost:3000](http://localhost:3000). For a classroom presentation, use a production build:

```bash
bun run build
bun start
```

All models, wallpapers, fonts, and synthesized sounds are served locally. No external asset service is required after installation/build. Source links open external websites when selected. The entry screen also offers **Straight to the desktop**.

## Presentation

- Switch **EN / MN** to change the slides, diagrams, narration, and review questions while staying on the same page. The browser remembers this language choice when local storage is available.
- Choose **Read along** to read the full manuscript for the current chapter. Reading checks and the final eight questions keep answers hidden until you reveal them.
- Open **Chapters** to jump to any of the 17 sections or the review questions. **Sources & notes** contains the introduction, teaching notes, and source links; individual claims link to their sources in the narration.
- `→` / `Space`: next page; `←`: previous page; `R`: switch between slides and Read along; `Esc`: return to the desktop. Space activates a focused button or answer control instead of advancing the page.
- **Reset illustration** restarts the current diagram. Browser fullscreen is optional; the presentation already fills its view.
- The chapter 16 experiment opens Files or Terminal on the simulated desktop. Resume the presentation from the lesson app to return to the same chapter.

The narration starts with familiar actions, explains each technical term, and offers breaks after chapters 5 and 10. It favors Linux and Fedora as places to explore while explaining their limits. It does not require installing an operating system.

## Explore the workstation

- Click **START** for the distant workstation reveal, then click anywhere to approach the desk.
- Move onto the display or choose **Use the computer** to enter the live GNOME-style screen. Move away to step back.
- Use **Free camera** to orbit the workstation; drag to look around and scroll to zoom.
- Choose **Explore the desk** to pick up the mug, read the note, swivel the chair, or press the PC power button. The objects themselves are clickable; matching controls support keyboard and touch.
- With the mug held, click the plant, PC, or desk (or select its name), then hold **Pour** or `P`. Releasing stops the stream. Coffee is finite; **Clean up / refill** clears spills and refills the mug.
- Coffee on the PC cuts its simulated power until cleanup. The desktop becomes inactive and dark, while its apps remain mounted. This is a playful simulation, not real hardware failure behavior.
- **Expand desktop** gives the desktop the whole browser. Quick Settings offers **Return to monitor** and **Back to desk**. Windows, terminal history, and file navigation survive these view changes.
- Open **Operating Systems** from the desktop or dock to start or resume the presentation.
- Open **Dino Runner** from the dock, Activities, or Software (or type `dino` in Terminal). Start a run, use `Space` / `↑` to jump and `↓` to duck, or use the touch buttons. Minimize or switch apps to pause; resume explicitly when ready.
- In **Settings → Theme**, choose **Monochrome** or **Bubbly Pink**. Themes apply to the desktop and app chrome; the fullscreen lesson keeps its own visual language.
- The lesson expands beyond the CRT; leaving it restores the previous desktop framing.
- `Ctrl + Space`: application overview. `Alt + Tab`: switch open apps where the browser/OS allows it. `Alt + F4`: close the focused app where not reserved by the host.
- Drag a window by its title bar; double-click to maximize. A keyboard-focused title supports `Alt + arrow keys` to move.

Window controls, app search, file navigation, virtual file previews, terminal history/completion, process termination, settings, calendar, and notifications work. Minimized windows retain their app state.

## The lesson's file experiment

Open **Files → Documents** and find `notes.txt`. Then open Terminal and run:

```text
ls /home/student/Documents
cat /home/student/Documents/notes.txt
```

Both views show the same pretend files. `ls` lists names; `cat` reads text. Neither command changes a file. Mongolian notes are in `notes.mn.txt`; `lesson-outline.md` and `lesson-outline.mn.md` list the current manuscript's 17 chapters.

The terminal supports a limited set of educational commands. `help` lists them, and `man ls` or `man cat` explains the file exercise. It does not execute a real shell or access the visitor's files. On a real computer, other commands can change or delete data.

## Additional system demonstration

Open Files and System Monitor. In Terminal, run:

```text
ps
free
cat /proc/meminfo
kill <Files PID>
```

Files appears as a process and allocates memory. Killing its PID closes the window and releases that memory in every view. Core services are protected. The filesystem is virtual and cannot access host files. `help` lists supported commands; the terminal intentionally does not execute real shell commands.

CPU percentages and memory measurements are illustrative simulation data, not readings from the visitor's device. Closing an app ends its simulated process. Reloading or restarting resets the in-memory desktop session. Desktop preferences survive an in-app session restart; the presentation's language choice is stored separately in browser local storage when available.

## Project layout

- `components/entry/`: monochrome entry gate and outer workstation controls.
- `components/world3d/`: imported workstation models, reversible camera views, orbit controls, coffee steam, CRT glass, and the persistent CSS3D screen.
- `app/desktop/`, `components/desktop/DesktopSession.tsx`: the same-origin desktop iframe and validated host/session messaging.
- `components/desktop/`: wallpaper, top bar, activities, dock, notifications, and window manager.
- `components/apps/`: Lesson, Files, Terminal, System Monitor, Settings, About, Software, and Dino Runner.
- `app/presentation/`: direct entry to the presentation.
- `components/lesson/`: presentation controls, chapter illustrations, language toggle, and safe manuscript renderer.
- `store/system.ts`: windows, processes, allocations, settings, notifications, and lesson progress.
- `store/room.ts`: mug contents, pour targets, spills, chair rotation, note, and simulated power. Pouring uses a bounded clock and lightweight procedural geometry, without a physics engine.
- `lib/filesystem.ts`, `lib/terminal.ts`: isolated virtual filesystem and educational command interpreter.
- `docs/presentation-manuscript.md`, `docs/presentation-manuscript.mn.md`: the complete source manuscripts, review questions, and presenter notes.
- `scripts/generate-presentation.ts`, `lib/presentation-manuscript.generated.json`: manuscript extraction, run automatically before development and production builds.
- `lib/presentation-data.ts`, `lib/presentation-language.ts`: concise slide copy and the shared English/Mongolian preference.
- `public/games/runner/`: pinned BSD-licensed Chromium runner, local sprites, and an isolated lifecycle adapter.

Next.js App Router, React, TypeScript, Zustand, React Three Fiber, Three.js, and locally hosted IBM Plex fonts. The desktop and all lesson text use DOM; WebGL is limited to the physical workstation. Particles are capped and procedural. The workstation and local `/desktop` iframe load behind the entry gate. The same iframe remains mounted through camera changes and expansion; WebGL pauses while the expanded desktop or lesson is in use. The desktop has its own viewport, so windows and responsive layouts continue to behave normally. Parent/frame messages validate both source window and origin.

## Accessibility and reliability

System `prefers-reduced-motion` is respected; manual reduction is available at entry and in Settings. The presentation uses DOM text and controls, with scrollable narration and native answer disclosures. Sound starts muted and is synthesized without copyrighted recordings. WebGL failure falls back to the working desktop; **Straight to the desktop** also bypasses the camera sequence. The desktop adapts to narrow viewports; the lesson allows scrolling when content cannot fit. Laptop and projector viewports remain the primary presentation target.

## Checks

```bash
bun run test
bun run check:presentation
bun run lint
bunx tsc --noEmit
bun run build
```

Tests cover manuscript parity in both languages, all 17 sections and eight quiz answers, source links, preserved technical terms, and the working `ls`/`cat` exercise. Existing integration tests cover the shared lifecycle across windows, processes, memory, terminal commands, virtual paths, protected processes, session resets, game lifecycle eligibility, theme retention, system identity, finite liquid transfer, interrupted pouring, and wet-PC recovery.

Pocket Slots tests check all 216 outcomes, credit accounting, duplicate clicks, stale animation callbacks, empty balances, and reset behavior. Open it from the dock, Software, the app menu, or the terminal command `slots`. A spin costs one of 30 free demo credits; the visible return table explains every result. The game shares the EN/Монгол preference. Its Spin button works with Enter or Space, and Reset starts a fresh round.

`bun run check:presentation` fails if the generated content differs from the Markdown sources. After editing either manuscript, run `bun run generate:presentation`; `dev` and `build` also regenerate it automatically.

Browser verification should cover all 25 pages in both languages, language retention, narration and answer reveals, chapter navigation, source links, keyboard controls, fullscreen exit, Files/Terminal return and resume, narrow layouts, and reduced motion. Workstation checks should cover entry, room interactions, spill recovery, window minimize/restore, and the additional process demonstration.

## Lesson provenance and credits

The user supplied `/home/leohunt/Downloads/afuckingroughoutline.pdf`, containing four scanned textbook pages numbered 44–47. The manuscripts retain its core topics: what an OS does, resources, kernel and interfaces, major operating systems, Linux distributions, and open-source software. They replace the historical survey with a beginner's Linux, security, and privacy lesson. DOS history, old market-share comparisons, and advanced memory-management details are outside the required path. The textbook's prose is not reproduced.

The [English manuscript](docs/presentation-manuscript.md) and [Mongolian manuscript](docs/presentation-manuscript.mn.md) contain the complete narrative, self-study answers, and primary-source links. The presentation includes the same narration through **Read along**, with the source and presenter notes available separately.

The preference for Fedora is a teaching preference. Privacy comparisons describe documented data categories and settings, not measured daily upload totals or a claim that Fedora sends nothing. System diagnostics, crash reports, apps, websites, and signed-in services remain distinct. The manuscripts record the date of their source review; check the linked primary documentation before revising product-specific claims.

opitlcalOS is fictional and unaffiliated with Fedora or GNOME. The workstation uses models, baked textures, camera choreography, coffee steam shader, and the CSS3D screen approach from [Henry Heffernan’s portfolio](https://github.com/henryjeff/portfolio-website), pinned to commit `c53c5a50183655eb83d70048403a5084f5d1214c`. The source is distributed under its [MIT license](public/models/henry/LICENSE.txt). Embedded atlas credits name Henry Heffernan (texturing and UV), Mickael Boitte (computer model), and Sean Nicolas (environment models). Assets are served from `public/models/henry/`; the outer monochrome UI adapts the source’s visual treatment, the portfolio’s paper uses a blank material, and its OS, personal content, music, and video are not shown.

The GNOME-inspired opitlcalOS desktop, wallpaper, presentation diagrams, and synthesized audio are original. No Geometry Dash assets or soundtrack are included. IBM Plex is licensed under the SIL Open Font License; Lucide icons use the ISC license. See [licenses and acknowledgments](public/licenses.txt).
Dino Runner reuses [wayou/t-rex-runner](https://github.com/wayou/t-rex-runner), pinned to `5455bfa408ec6b707c7300ff194b7390733a766d`, with the BSD-3-Clause notices for wayou and Chromium preserved in `public/games/runner/`. The game engine and small sprite sheets are served locally only when the app opens; no external game service, game framework, or audio assets are loaded. The adapter pauses gameplay when the app loses focus, is minimized, or the desktop becomes inactive. Closing the app destroys its iframe and releases the game.

Pocket Slots adapts the reel-strip approach from [johakr/html5-slot-machine](https://github.com/johakr/html5-slot-machine), pinned to `347fc31ddd227674d8dc93e238d6664784e1872d`. Its MIT notice and source details are in `public/games/slots/`. The React adaptation uses original vector symbols and transform-only Web Animations, with no new runtime dependency. It loads when opened and runs animations only during a spin. Leaving the app settles the selected result and cancels animation; reduced motion reveals the result without moving reels. Demo credits have no monetary value.
