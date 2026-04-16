export type BoardOwnership = {
  color: string;
  name?: string;
} | null;

export function maskLabel(value: string): string {
  return value
    .replace(/[\p{L}\p{N}]/gu, "•")
    .replace(/\s+/g, " ");
}

export function OwnershipBadge({
  ownership,
  emptyLabel = "Open",
}: {
  ownership: BoardOwnership;
  emptyLabel?: string;
}) {
  if (!ownership) {
    return (
      <span className="inline-flex items-center rounded-full border border-neutral-800 bg-neutral-900 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
        {emptyLabel}
      </span>
    );
  }

  return (
    <span
      className="inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
      style={{ borderColor: `${ownership.color}66`, backgroundColor: `${ownership.color}20`, color: ownership.color }}
    >
      {ownership.name ?? "Claimed"}
    </span>
  );
}
