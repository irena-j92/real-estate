import { useEffect, useRef } from "react";
import { createSquareGrid, stepSquareGrid } from "../../motion/squareGrid";
import "./liquid-square-grid.css";

// A decorative canvas listens on its parent so all hero links stay clickable.
export default function LiquidSquareGrid({ surfaceRef, enabled = true }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const surface = surfaceRef.current;
    const context = canvas?.getContext("2d", { alpha: true });
    if (!context || !surface) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const hover = window.matchMedia("(hover: hover) and (pointer: fine)");
    const pointer = { x: 0, y: 0, vx: 0, vy: 0, active: false };
    let points = [], width = 0, height = 0, frame = 0, previousTime = 0;
    let visible = true, disposed = false;

    const draw = () => {
      context.clearRect(0, 0, width, height);
      context.fillStyle = "rgba(249, 247, 239, 0.42)";
      context.beginPath();
      for (const point of points) {
        const side = 1.8;
        context.rect(point.x + point.dx - side / 2, point.y + point.dy - side / 2, side, side);
      }
      context.fill();
    };
    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      previousTime = 0;
    };
    const reset = () => {
      stop();
      pointer.active = false;
      pointer.vx = pointer.vy = 0;
      for (const point of points) point.dx = point.dy = point.vx = point.vy = 0;
      draw();
    };
    const animate = (now) => {
      frame = 0;
      if (disposed || !visible || document.hidden || reduced.matches || !enabled) return;
      const delta = previousTime ? Math.min((now - previousTime) / (1000 / 60), 2) : 1;
      previousTime = now;
      const moving = stepSquareGrid(points, pointer, now / 1000, delta);
      pointer.vx *= Math.pow(0.86, delta);
      pointer.vy *= Math.pow(0.86, delta);
      draw();
      if (pointer.active || moving) frame = requestAnimationFrame(animate);
      else previousTime = 0;
    };
    const wake = () => {
      if (!frame && enabled && visible && !document.hidden && !reduced.matches && hover.matches)
        frame = requestAnimationFrame(animate);
    };
    const resize = () => {
      const bounds = surface.getBoundingClientRect();
      width = bounds.width;
      height = bounds.height;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      points = createSquareGrid(width, height);
      reset();
    };
    const move = (event) => {
      if (event.pointerType === "touch" || reduced.matches || !hover.matches || !enabled) return;
      const bounds = surface.getBoundingClientRect();
      const x = event.clientX - bounds.left, y = event.clientY - bounds.top;
      pointer.vx = pointer.active ? Math.max(-28, Math.min(28, x - pointer.x)) : 0;
      pointer.vy = pointer.active ? Math.max(-28, Math.min(28, y - pointer.y)) : 0;
      pointer.x = x;
      pointer.y = y;
      pointer.active = true;
      wake();
    };
    const leave = () => { pointer.active = false; wake(); };
    const visibility = () => { if (document.hidden) reset(); };
    const preference = () => { if (reduced.matches || !hover.matches) reset(); };
    const observer = new ResizeObserver(resize);
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (!visible) reset();
    });
    observer.observe(surface);
    intersection.observe(surface);
    surface.addEventListener("pointermove", move, { passive: true });
    surface.addEventListener("pointerleave", leave);
    surface.addEventListener("pointercancel", leave);
    window.addEventListener("blur", reset);
    document.addEventListener("visibilitychange", visibility);
    reduced.addEventListener("change", preference);
    hover.addEventListener("change", preference);
    resize();
    return () => {
      disposed = true;
      stop();
      observer.disconnect();
      intersection.disconnect();
      surface.removeEventListener("pointermove", move);
      surface.removeEventListener("pointerleave", leave);
      surface.removeEventListener("pointercancel", leave);
      window.removeEventListener("blur", reset);
      document.removeEventListener("visibilitychange", visibility);
      reduced.removeEventListener("change", preference);
      hover.removeEventListener("change", preference);
    };
  }, [surfaceRef, enabled]);
  return <canvas className="hero-square-grid" ref={canvasRef} aria-hidden="true" />;
}
