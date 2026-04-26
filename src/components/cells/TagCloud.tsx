import type { TagCloudContent } from "../../types";

interface Props {
  content: TagCloudContent;
}

export function TagCloud({ content }: Props) {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 6,
        alignContent: "center",
        height: "100%",
        fontFamily: "var(--font-family)",
      }}
    >
      {content.tags.map((tag, i) => (
        <span
          key={i}
          style={{
            background: "rgba(255,255,255,0.07)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 9999,
            padding: "4px 12px",
            fontSize: 12,
            fontWeight: 500,
            color: "rgba(255,255,255,0.78)",
            whiteSpace: "nowrap",
          }}
        >
          {tag}
        </span>
      ))}
    </div>
  );
}
