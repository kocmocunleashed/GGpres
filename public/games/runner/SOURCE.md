# Dino Runner provenance

The game engine and sprite sheets are reused from **wayou/t-rex-runner**,
the open-source extraction of Chromium's offline dinosaur game.

- Repository: https://github.com/wayou/t-rex-runner
- Pinned commit: `5455bfa408ec6b707c7300ff194b7390733a766d`
- `engine.js` is a byte-for-byte copy of upstream `index.js`.
- `offline-sprite-1x.png` and `offline-sprite-2x.png` are unchanged upstream assets.
- Upstream license: BSD 3-Clause, reproduced in `LICENSE`.
- Chromium authors' notice is retained in `engine.js`; Chromium's BSD terms
  are additionally reproduced in `LICENSE.chromium` from
  https://github.com/chromium/chromium/blob/main/LICENSE.

The separate `adapter.js`, HTML, and CSS integrate the existing game with
opitlcalOS. They disable upstream document-wide controls, auto-resume, audio,
full-page arcade scaling, and color inversion. The original canvas gameplay,
sprites, physics, obstacles, collision detection, and scoring remain in use.
The host explicitly controls pausing, restarting, keyboard/touch input, and
themes. No remote runtime requests or game framework are needed.

Engine and sprites: 95,871 bytes before HTTP compression. Optional upstream
audio, demo animations, and example pages are deliberately not shipped.
