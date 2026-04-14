export const PLAYER_COLORS = [
  "#ef4444", // red
  "#3b82f6", // blue
  "#22c55e", // green
  "#eab308", // yellow
  "#a855f7", // purple
  "#f97316", // orange
];

export function pickColor(used: string[]): string {
  return PLAYER_COLORS.find((c) => !used.includes(c)) ?? PLAYER_COLORS[0];
}
