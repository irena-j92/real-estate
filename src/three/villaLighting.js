export const clamp = (value, min = 0, max = 1) => Math.max(min, Math.min(max, value));
export function villaLighting(night) {
  const dusk = clamp(night);
  return {
    sun: 3.6 * (1 - dusk) + 0.35,
    sky: 1.8 * (1 - dusk) + 0.32,
    exposure: 0.96 * (1 - dusk) + 0.82 * dusk,
    rooms: [0, 1, 2, 3].map(index => clamp((dusk - 0.3 - index * 0.09) / 0.28)),
    path: clamp((dusk - 0.7) / 0.3),
  };
}
