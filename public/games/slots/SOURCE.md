# Pocket Slots source and license

The short reel-strip animation approach is adapted from Johannes Kronmüller's
[html5-slot-machine](https://github.com/johakr/html5-slot-machine), specifically
[Reel.js at commit 347fc31ddd227674d8dc93e238d6664784e1872d](https://github.com/johakr/html5-slot-machine/blob/347fc31ddd227674d8dc93e238d6664784e1872d/src/js/Reel.js).
The upstream code is MIT licensed. Its [copyright and license](LICENSE.txt) are
preserved here.

This adaptation uses three single-symbol reels and transform-only Web Animations.
The original project animates positioned image strips; this version uses original
inline vector symbols, a React interface, English/Mongolian labels, and a small
tested credit reducer. No upstream artwork, autoplay, sounds, build tooling, or
runtime dependencies are included.

The game starts with 30 fictional demo credits. A spin costs one credit. All six
symbols have equal chances on each of three independent reels. Exactly two equal
symbols return one credit; triples return the amount in the visible table. Awards
do not stack. There is no money, account, purchase, cash-out, or network game API.
Resetting provides a fresh set of demo credits.

Animations run only during a requested spin. Leaving the app, hiding the browser
tab, or making the desktop inert settles the already chosen result and cancels
the animation. Reduced motion shows results without moving the reels. Closing
the app releases its animations and timers; no autoplay runs in the background.
