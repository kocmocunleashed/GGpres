# Dino Runner provenance

The game engine and sprite sheets are reused from **wayou/t-rex-runner**,
the open-source extraction of Chromium's offline dinosaur game.

- Repository: https://github.com/wayou/t-rex-runner
- Pinned commit: `5455bfa408ec6b707c7300ff194b7390733a766d`
- `engine.js` is a byte-for-byte copy of upstream `index.js`.
- `offline-sprite-1x.png` is an unchanged copy of upstream
  `assets/default_100_percent/100-offline-sprite.png` (1233 × 68 pixels).
- `offline-sprite-2x.png` is an unchanged copy of upstream
  `assets/default_200_percent/200-offline-sprite.png` (2441 × 130 pixels).
  These are the sheets referenced by upstream `index.html` and match the
  pinned engine's sprite coordinates. The older similarly named files at
  upstream `assets/offline-sprite-1x.png` and `assets/offline-sprite-2x.png`
  have different layouts and must not be substituted.
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

Pinned file SHA-256 checksums:

| Local file | SHA-256 |
| --- | --- |
| `engine.js` | `e7a50d337bdbe4299068de034e4564cfe5fd45ca9257ded37b6ada9330cedf0f` |
| `offline-sprite-1x.png` | `e306705c996676db01f4072ed3d6f33d89089a848ab0b2a0ba07a2d866ec309f` |
| `offline-sprite-2x.png` | `b3011fd16e43cd860b9782c4eafe77c1cc40da2e0f6e2e5ea547d98d6efac879` |

Engine and sprites: 96,130 bytes before HTTP compression. Optional upstream
audio, demo animations, and example pages are deliberately not shipped.
