import type { StatContent, TrendDirection } from "../../types";

function trendColor(dir: TrendDirection): string {
  if (dir === "up") return "#34d399";
  if (dir === "down") return "#f87171";
  return "rgba(255,255,255,0.45)";
}

function trendIcon(dir: TrendDirection): string {
  if (dir === "up") return "↑";
  if (dir === "down") return "↓";
  return "→";
}

interface Props {
  content: StatContent;
}

export function StatCard({ content }: Props) {
  const { label, value, trend, trendDirection } = content;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 6,
        height: "100%",
        justifyContent: "center",
        fontFamily: "var(--font-family)",
      }}
    >
      <span
        style={{
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "0.07em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.38)",
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: "calc(var(--font-base-size) * 2.2)",
          fontWeight: 700,
          color: "var(--color-text)",
          lineHeight: 1.05,
          letterSpacing: "-0.03em",
        }}
      >
        {value}
      </span>
      <span
        style={{
          fontSize: 12,
          fontWeight: 600,
          color: trendColor(trendDirection),
          display: "flex",
          alignItems: "center",
          gap: 3,
        }}
      >
        <span style={{ fontSize: 14 }}>{trendIcon(trendDirection)}</span>
        {trend}
      </span>
    </div>
  );
}
