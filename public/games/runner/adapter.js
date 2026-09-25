/* opitlcalOS integration for the unchanged BSD-licensed Chromium runner. */
(() => {
  "use strict";
  const Runner = window.Runner;
  document.removeEventListener("DOMContentLoaded", window.onDocumentLoad);
  let game;
  let ready = false;
  let enabled = false;
  let started = false;
  let status = "ready";
  let lastScore = -1;
  let lastReported = 0;
  let resizeTimer;

  function report(force = false) {
    if (!ready || !game) return;
    const now = performance.now();
    const score = game.distanceMeter.getActualDistance(Math.ceil(game.distanceRan));
    if (!force && (now - lastReported < 250 || score === lastScore)) return;
    lastScore = score;
    lastReported = now;
    window.parent.postMessage({ source: "opitlcal-runner", type: "status", status, score,
      best: game.distanceMeter.getActualDistance(Math.ceil(game.highestScore)) }, window.location.origin);
    document.body.dataset.status = status;
  }

  function releaseControls() {
    if (!ready) return;
    game.tRex.endJump();
    game.tRex.speedDrop = false;
    game.tRex.setDuck(false);
  }

  function pause() {
    if (!ready) return;
    game.stop();
    releaseControls();
    if (status !== "crashed") status = started ? "paused" : "ready";
    report(true);
  }

  function start() {
    if (!ready || !enabled || document.hidden) return;
    if (game.crashed) {
      status = "playing";
      game.paused = false;
      game.restart();
    } else if (!game.playing) {
      if (!started) {
        game.activated = true;
        game.startGame();
        started = true;
      }
      status = "playing";
      game.play();
    }
    report(true);
  }

  function input(control, pressed) {
    if (!ready || !enabled || document.hidden || status !== "playing") return;
    const event = { keyCode: control === "jump" ? 32 : 40, type: pressed ? "keydown" : "keyup",
      target: game.canvas, preventDefault() {} };
    if (pressed) game.onKeyDown(event);
    else game.onKeyUp(event);
  }

  // The host owns focus and all inputs; never register upstream global handlers.
  Runner.prototype.startListening = function () {};
  Runner.prototype.stopListening = function () {};
  Runner.prototype.createTouchController = function () {};
  Runner.prototype.loadSounds = function () {};
  Runner.prototype.setArcadeMode = function () {};
  Runner.prototype.setArcadeModeContainerScale = function () {};
  Runner.prototype.onVisibilityChange = function () {};
  Runner.prototype.debounceResize = function () {};
  Runner.prototype.invert = function () { this.inverted = false; this.invertTimer = 0; };
  Runner.prototype.startGame = function () {
    this.runningTime = 0;
    this.playingIntro = false;
    this.tRex.playingIntro = false;
    this.playCount++;
  };
  Runner.prototype.playIntro = function () {
    if (!this.activated) {
      this.activated = true;
      this.startGame();
    }
  };

  const originalUpdate = Runner.prototype.update;
  Runner.prototype.update = function () {
    originalUpdate.call(this);
    report();
  };
  const originalGameOver = Runner.prototype.gameOver;
  Runner.prototype.gameOver = function () {
    originalGameOver.call(this);
    status = "crashed";
    report(true);
  };
  const originalInit = Runner.prototype.init;
  Runner.prototype.init = function () {
    originalInit.call(this);
    this.stop();
    this.paused = false;
    this.canvas.setAttribute("role", "img");
    this.canvas.setAttribute("aria-label", "Dinosaur jumping over desert obstacles. Score is shown above the game.");
    // init can run synchronously inside the constructor, before its assignment.
    queueMicrotask(() => { ready = true; report(true); });
  };

  window.addEventListener("message", (event) => {
    if (event.origin !== window.location.origin || event.source !== window.parent) return;
    const message = event.data;
    if (!message || message.source !== "opitlcal-runner-host") return;
    if (message.type === "state" && typeof message.enabled === "boolean") {
      enabled = message.enabled;
      if (["wave", "monochrome", "pink"].includes(message.theme)) document.documentElement.dataset.theme = message.theme;
      if (!enabled) pause();
      // Becoming visible never restarts the loop; Resume is always explicit.
    } else if (message.type === "command") {
      if (message.action === "start") start();
      if (message.action === "pause") pause();
    } else if (message.type === "input" && ["jump", "duck"].includes(message.control) && typeof message.pressed === "boolean") {
      input(message.control, message.pressed);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (!enabled || event.ctrlKey || event.metaKey || event.altKey) return;
    if (event.code === "Escape") { event.preventDefault(); pause(); return; }
    if (!["Space", "ArrowUp", "ArrowDown"].includes(event.code)) return;
    event.preventDefault();
    if (event.repeat) return;
    if (status !== "playing") { start(); return; }
    input(event.code === "ArrowDown" ? "duck" : "jump", true);
  });
  document.addEventListener("keyup", (event) => {
    if (!["Space", "ArrowUp", "ArrowDown"].includes(event.code)) return;
    event.preventDefault();
    input(event.code === "ArrowDown" ? "duck" : "jump", false);
  });
  // Focus may move to our host's touch buttons without leaving the game app.
  window.addEventListener("blur", () => { if (!window.parent.document.hasFocus()) pause(); });
  document.addEventListener("visibilitychange", () => { if (document.hidden) pause(); });
  window.addEventListener("pagehide", pause);
  window.addEventListener("resize", () => {
    pause();
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { if (ready) { game.adjustDimensions(); report(true); } }, 100);
  });

  try { game = new Runner(".interstitial-wrapper"); }
  catch { window.parent.postMessage({ source: "opitlcal-runner", type: "error" }, window.location.origin); }
})();
