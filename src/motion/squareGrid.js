export function createSquareGrid(width, height, spacing = 24) {
  const points = [];
  // Center the grid so the opposite edges have matching notebook margins.
  const columns = Math.ceil(width / spacing), rows = Math.ceil(height / spacing);
  const left = (width - (columns - 1) * spacing) / 2;
  const top = (height - (rows - 1) * spacing) / 2;
  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      points.push({ x: left + column * spacing, y: top + row * spacing, dx: 0, dy: 0, vx: 0, vy: 0 });
    }
  }
  return points;
}

export function stepSquareGrid(points, pointer, seconds, delta = 1) {
  const step = Math.max(0.25, Math.min(delta, 2));
  const damping = Math.pow(0.78, step);
  const radius = 175;
  let moving = false;
  for (const point of points) {
    let targetX = 0, targetY = 0;
    if (pointer.active) {
      const x = point.x - pointer.x, y = point.y - pointer.y;
      const distance = Math.hypot(x, y);
      if (distance < radius) {
        const falloff = Math.pow(1 - distance / radius, 2);
        const wave = Math.sin(distance / 23 - seconds * 4.5) * 9;
        const push = (26 + wave) * falloff;
        const denominator = Math.max(distance, 1);
        // Radial pressure, a soft curl, and a wake following the pointer.
        targetX = x / denominator * push - y / denominator * falloff * 9 + pointer.vx * falloff * 1.1;
        targetY = y / denominator * push + x / denominator * falloff * 9 + pointer.vy * falloff * 1.1;
      }
    }
    point.vx = (point.vx + (targetX - point.dx) * 0.065 * step) * damping;
    point.vy = (point.vy + (targetY - point.dy) * 0.065 * step) * damping;
    point.dx += point.vx * step;
    point.dy += point.vy * step;
    if (Math.abs(point.dx) + Math.abs(point.dy) + Math.abs(point.vx) + Math.abs(point.vy) > 0.025) moving = true;
    else if (!pointer.active) point.dx = point.dy = point.vx = point.vy = 0;
  }
  return moving;
}
