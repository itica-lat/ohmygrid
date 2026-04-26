import type { FeatureContent } from "../../types";

interface Props {
  content: FeatureContent;
}

export function FeatureCard({ content }: Props) {
  const { icon, title, description } = content;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 10,
        height: "100%",
        justifyContent: "center",
        fontFamily: "var(--font-family)",
      }}
    >
      <span style={{ fontSize: 32, lineHeight: 1 }}>{icon}</span>
      <strong
        style={{
          fontSize: "calc(var(--font-base-size) * 1.05)",
          fontWeight: 700,
          color: "var(--color-text)",
          lineHeight: 1.3,
        }}
      >
        {title}
      </strong>
      <p
        style={{
          margin: 0,
          fontSize: 13,
          color: "rgba(255,255,255,0.58)",
          lineHeight: 1.55,
        }}
      >
        {description}
      </p>
    </div>
  );
}
