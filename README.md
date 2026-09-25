# opitlcalOS — Beneath the Interface

An interactive high-school lesson about operating systems. Enter a 3D workstation adapted from Henry Heffernan’s portfolio, explore a fictional GNOME-inspired desktop, then move through 25 interactive scenes across 14 chapters.

## Run

```bash
bun install
bun dev
```

Open [localhost:3000](http://localhost:3000). For a classroom presentation, use a production build:

```bash
bun run build
bun start
```

All models, wallpapers, fonts, and synthesized sounds are served locally. No external asset service is required after installation/build. The entry screen also offers **Straight to the desktop**.

## Use

- Click **START** for the distant workstation reveal, then click anywhere to approach the desk.
- Move onto the display or choose **Use the computer** to enter the live GNOME-style screen. Move away to step back.
- Use **Free camera** to orbit the workstation; drag to look around and scroll to zoom.
- Choose **Explore the desk** to pick up the mug, read the note, swivel the chair, or press the PC power button. The objects themselves are clickable; matching controls support keyboard and touch.
- With the mug held, click the plant, PC, or desk (or select its name), then hold **Pour** or `P`. Releasing stops the stream. Coffee is finite; **Clean up / refill** clears spills and refills the mug.
- Coffee on the PC cuts its simulated power until cleanup. The desktop becomes inactive and dark, while its apps remain mounted. This is a playful simulation, not real hardware failure behavior.
- **Expand desktop** gives the desktop the whole browser. Quick Settings offers **Return to monitor** and **Back to desk**. Windows, terminal history, and file navigation survive these view changes.
- Open **Operating Systems** from the desktop or dock, then **Begin the journey**.
- Open **Dino Runner** from the dock, Activities, or Software (or type `dino` in Terminal). Start a run, use `Space` / `↑` to jump and `↓` to duck, or use the touch buttons. Minimize or switch apps to pause; resume explicitly when ready.
- In **Settings → Theme**, choose **Monochrome** or **Bubbly Pink**. Themes apply to the desktop and app chrome; the fullscreen lesson keeps its own visual language.
- `→` / `Space`: next scene; `←`: previous scene; `Esc`: desktop.
- `M`: mute; `P`: pause ambient motion; `Ctrl/Cmd + Shift + R`: reset the current scene.
- Chapter overview lets a presenter jump between topics. The lesson automatically expands beyond the CRT; leaving it restores your previous desktop framing. Browser fullscreen is optional.
- Demo scenes return to real desktop apps. **Resume lesson** continues where you left off.
- `Ctrl + Space`: application overview. `Alt + Tab`: switch open apps where the browser/OS allows it. `Alt + F4`: close the focused app where not reserved by the host.
- Drag a window by its title bar; double-click to maximize. A keyboard-focused title supports `Alt + arrow keys` to move.

Window controls, app search, file navigation, virtual file previews, terminal history/completion, process termination, settings, calendar, and notifications work. Minimized windows retain their app state.

## Shared system demonstration

Open Files and System Monitor. In Terminal, run:

```text
ps
free
cat /proc/meminfo
kill <Files PID>
```

Files appears as a process and allocates memory. Killing its PID closes the window and releases that memory in every view. Core services are protected. The filesystem is virtual and cannot access host files. `help` lists supported commands; the terminal intentionally does not execute real shell commands.

CPU percentages and memory measurements are illustrative simulation data, not readings from the visitor’s device. Closing an app ends its simulated process. Reloading or restarting resets the in-memory session; preferences survive an in-app session restart but are not persisted to disk.

## Project layout

- `components/entry/`: monochrome entry gate and outer workstation controls.
- `components/world3d/`: imported workstation models, reversible camera views, orbit controls, coffee steam, CRT glass, and the persistent CSS3D screen.
- `app/desktop/`, `components/desktop/DesktopSession.tsx`: the same-origin desktop iframe and validated host/session messaging.
- `components/desktop/`: wallpaper, top bar, activities, dock, notifications, and window manager.
- `components/apps/`: Lesson, Files, Terminal, System Monitor, Settings, About, Software, and Dino Runner.
- `components/lesson/`: persistent world, reusable scene renderer, interactive diagrams, and controls.
- `store/system.ts`: windows, processes, allocations, settings, notifications, and lesson progress.
- `store/room.ts`: mug contents, pour targets, spills, chair rotation, note, and simulated power. Pouring uses a bounded clock and lightweight procedural geometry, without a physics engine.
- `lib/filesystem.ts`, `lib/terminal.ts`: isolated virtual filesystem and educational command interpreter.
- `lib/lesson-data.ts`: scene content and chapter/source metadata.
- `public/games/runner/`: pinned BSD-licensed Chromium runner, local sprites, and an isolated lifecycle adapter.

Next.js App Router, React, TypeScript, Zustand, React Three Fiber, Three.js, and locally hosted IBM Plex fonts. The desktop and all lesson text use DOM; WebGL is limited to the physical workstation. Particles are capped and procedural. The workstation and local `/desktop` iframe load behind the entry gate. The same iframe remains mounted through camera changes and expansion; WebGL pauses while the expanded desktop or lesson is in use. The desktop has its own viewport, so windows and responsive layouts continue to behave normally. Parent/frame messages validate both source window and origin.

## Accessibility and reliability

System `prefers-reduced-motion` is respected; manual reduction is available at entry and in Settings. Presentation controls remain available while motion is paused. Sound starts muted and is synthesized without copyrighted recordings. WebGL failure falls back to the working desktop; **Straight to the desktop** also bypasses the camera sequence. The desktop adapts to narrow viewports; the lesson allows scrolling when content cannot fit. 16:9 laptop/projector viewports remain the primary target.

## Checks

```bash
bun run test
bun run lint
bunx tsc --noEmit
bun run build
```

Integration tests cover the shared lifecycle across windows, processes, memory, terminal commands, virtual path handling, protected processes, session resets, game lifecycle eligibility, theme retention, system identity, finite liquid transfer, interrupted pouring, and wet-PC recovery. Browser checks should cover workstation entry, room interactions and spill recovery, the Files→Terminal kill demonstration, minimize/restore, all chapter transitions, a demo return/resume, mobile layout, and reduced motion.

## Lesson provenance and credits

The supplied design brief is the topic outline. No teacher PDF was supplied or quoted. Modern memory/kernel/scheduling terminology is documented with references in **Lesson → Sources & notes**. The desktop simulation, diagrams, fault walkthrough, scheduler exercise, and knowledge check are original teaching additions.

opitlcalOS is fictional and unaffiliated with Fedora or GNOME. The workstation uses models, baked textures, camera choreography, coffee steam shader, and the CSS3D screen approach from [Henry Heffernan’s portfolio](https://github.com/henryjeff/portfolio-website), pinned to commit `c53c5a50183655eb83d70048403a5084f5d1214c`. The source is distributed under its [MIT license](public/models/henry/LICENSE.txt). Embedded atlas credits name Henry Heffernan (texturing and UV), Mickael Boitte (computer model), and Sean Nicolas (environment models). Assets are served from `public/models/henry/`; the outer monochrome UI adapts the source’s visual treatment, the portfolio’s paper uses a blank material, and its OS, personal content, music, and video are not shown.

The GNOME-inspired opitlcalOS desktop, wallpaper, lesson geometry, and synthesized audio are original. Sonic Wave Infinity’s ending compositions remain a conceptual reference only; no Geometry Dash assets or soundtrack are included. IBM Plex is licensed under the SIL Open Font License; Lucide icons use the ISC license. See [licenses and acknowledgments](public/licenses.txt).
Dino Runner reuses [wayou/t-rex-runner](https://github.com/wayou/t-rex-runner), pinned to `5455bfa408ec6b707c7300ff194b7390733a766d`, with the BSD-3-Clause notices for wayou and Chromium preserved in `public/games/runner/`. The game engine and small sprite sheets are served locally only when the app opens; no external game service, game framework, or audio assets are loaded. The adapter pauses gameplay when the app loses focus, is minimized, or the desktop becomes inactive. Closing the app destroys its iframe and releases the game.

# GGpres
