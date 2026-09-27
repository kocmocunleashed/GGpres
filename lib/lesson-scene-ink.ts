export interface SceneInkLine { text: string; x: number; y: number }
export interface SceneInkLayout { fontSize: number; lines: SceneInkLine[] }
export interface SceneInkPainter {
  font: string;
  measureText: (text: string) => { width: number };
  fillText: (text: string, x: number, y: number) => void;
}

/** Fit complete logical lines without wrapping, trimming or dropping text. */
export function layoutSceneInk(ink: string, measure: (line: string, fontSize: number) => number): SceneInkLayout {
  const lines = ink.split("\n");
  const width = 334, height = 238, leading = 1.25;
  let lower = 0;
  let upper = Math.min(48, height / (lines.length * leading));
  for (let iteration = 0; iteration < 20; iteration++) {
    const candidate = (lower + upper) / 2;
    if (lines.every(line => measure(line, candidate) <= width)) lower = candidate;
    else upper = candidate;
  }
  const fontSize = lower;
  return {
    fontSize,
    lines: lines.map((text, index) => ({ text, x: 25, y: 25 + fontSize + index * fontSize * leading })),
  };
}

/** Small canvas adapter so tests verify the exact text sent to the renderer. */
export function paintSceneInk(context: SceneInkPainter, ink: string): SceneInkLayout {
  const layout = layoutSceneInk(ink, (line, fontSize) => {
    context.font = `500 ${fontSize}px monospace`;
    return context.measureText(line).width;
  });
  context.font = `500 ${layout.fontSize}px monospace`;
  for (const line of layout.lines) context.fillText(line.text, line.x, line.y);
  return layout;
}
