let context: AudioContext | undefined;

/** Original, synthesized UI tones; no audio assets or network requests. */
export function playTone(kind: "boot" | "scene" | "open" = "open") {
  if (typeof window === "undefined" || !window.AudioContext) return;
  try {
    context ??= new AudioContext();
    if (context.state === "suspended") void context.resume();
    const now = context.currentTime;
    const notes = kind === "boot" ? [330, 440, 660] : kind === "scene" ? [220, 440] : [660];
    notes.forEach((frequency, index) => {
      const oscillator = context!.createOscillator();
      const gain = context!.createGain();
      oscillator.type = "sine";
      oscillator.frequency.value = frequency;
      const start = now + index * .09;
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(.025, start + .012);
      gain.gain.exponentialRampToValueAtTime(.001, start + .22);
      oscillator.connect(gain); gain.connect(context!.destination);
      oscillator.start(start); oscillator.stop(start + .25);
    });
  } catch { /* Optional audio must never interrupt the lesson. */ }
}
