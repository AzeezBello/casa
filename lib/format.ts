/** Compact naira price, e.g. 185000000 -> "₦185M", 1500000000 -> "₦1.5B". */
export function formatNaira(amount: number): string {
  if (amount >= 1_000_000_000) return `₦${trim(amount / 1_000_000_000)}B`;
  if (amount >= 1_000_000) return `₦${trim(amount / 1_000_000)}M`;
  return `₦${amount.toLocaleString("en-NG")}`;
}

function trim(n: number): string {
  return n.toFixed(1).replace(/\.0$/, "");
}
