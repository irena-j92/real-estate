import { useCallback, useEffect, useRef, useState } from "react";

export const HERO_DURATION = 8;
export const HERO_FPS = 24;
export const HERO_FRAME_COUNT = 192;
export function heroFrameAt(time) {
  return Math.max(
    0,
    Math.min(HERO_FRAME_COUNT - 1, Math.round(time * HERO_FPS)),
  );
}

/** Draw exact frames of the supplied MP4 without relying on HTTP video seeks. */
export default function useHeroFrames(canvasRef) {
  const [ready, setReady] = useState(false);
  const target = useRef(0);
  const renderRef = useRef(null);
  const seek = useCallback((time) => {
    target.current = time;
    renderRef.current?.();
  }, []);
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d", { alpha: false });
    if (!context) return;
    const sheets = new Map(),
      pending = new Map();
    let disposed = false,
      frame = 0,
      lastDrawn = 0;
    const draw = (time) => {
      const index = heroFrameAt(time),
        sheet = Math.floor(index / 12) + 1;
      const image = sheets.get(sheet);
      if (!image) {
        load(sheet);
        return;
      }
      sheets.delete(sheet);
      sheets.set(sheet, image);
      const tile = index % 12;
      const scale = Math.max(canvas.width / 960, canvas.height / 540);
      const width = 960 * scale,
        height = 540 * scale;
      context.drawImage(
        image,
        (tile % 4) * 960,
        Math.floor(tile / 4) * 540,
        960,
        540,
        (canvas.width - width) / 2,
        (canvas.height - height) / 2,
        width,
        height,
      );
      lastDrawn = time;
      if (sheet < 16) load(sheet + 1);
    };
    const requestDraw = () => {
      if (!frame && !disposed)
        frame = requestAnimationFrame(() => {
          frame = 0;
          draw(target.current);
        });
    };
    const load = (sheet) => {
      if (disposed || sheets.has(sheet) || pending.has(sheet)) return;
      const image = new Image();
      pending.set(sheet, image);
      image.onload = () => {
        pending.delete(sheet);
        if (disposed) return;
        sheets.set(sheet, image);
        // Keep at most two decoded contact sheets, including the current one.
        while (sheets.size > 2) {
          const current = Math.floor(heroFrameAt(target.current) / 12) + 1;
          const oldest = [...sheets.keys()].find((key) => key !== current);
          sheets.delete(oldest);
        }
        if (sheet === 1) setReady(true);
        requestDraw();
      };
      image.onerror = () => {
        pending.delete(sheet);
      };
      image.src = `/assets/hero-frames/sheet-${String(sheet).padStart(2, "0")}.webp`;
    };
    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(bounds.width * ratio));
      canvas.height = Math.max(1, Math.round(bounds.height * ratio));
      draw(lastDrawn);
      requestDraw();
    };
    renderRef.current = requestDraw;
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();
    load(1);
    return () => {
      disposed = true;
      renderRef.current = null;
      cancelAnimationFrame(frame);
      observer.disconnect();
      pending.forEach((image) => {
        image.onload = null;
        image.onerror = null;
        image.src = "";
      });
      pending.clear();
      sheets.clear();
    };
  }, [canvasRef]);
  return { ready, seek };
}
