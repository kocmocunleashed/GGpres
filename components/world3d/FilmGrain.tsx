"use client";

import { useEffect, useRef } from "react";

/** Source renderer uses a soft-light noise layer at 12% opacity. A small
 * locally generated tile preserves that texture without a second WebGL scene. */
export default function FilmGrain({ paused, hidden }: { paused: boolean; hidden: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = ref.current;
    if (!element || hidden) return;
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 128;
    const context = canvas.getContext("2d");
    if (!context) return;
    const pixels = context.createImageData(128, 128);
    function draw() {
      for (let i = 0; i < pixels.data.length; i += 4) {
        const value = Math.random() * 255;
        pixels.data[i] = value;
        pixels.data[i + 1] = value;
        pixels.data[i + 2] = value;
        pixels.data[i + 3] = 255;
      }
      context!.putImageData(pixels, 0, 0);
      element!.style.backgroundImage = `url(${canvas.toDataURL("image/png")})`;
    }
    draw();
    if (paused) return;
    const timer = window.setInterval(draw, 120);
    return () => window.clearInterval(timer);
  }, [paused, hidden]);
  return <div ref={ref} className="world-film-grain" hidden={hidden} aria-hidden="true" />;
}
