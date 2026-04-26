import type { TextContent } from "../../types";

const SIZE_MAP: Record<string, string> = {
  sm: "calc(var(--font-base-size) * 0.9)",
  md: "calc(var(--font-base-size) * 1.1)",
  lg: "calc(var(--font-base-size) * 1.4)",
  xl: "calc(var(--font-base-size) * 1.8)",
  "2xl": "calc(var(--font-base-size) * 2.4)",
};

interface Props {
  content: TextContent;
}

export function TextCell({ content }: Props) {
  const { heading, subheading, body, align, headingSize } = content;
  return (
    <div
      style={{
        textAlign: align,
        display: "flex",
        flexDirection: "column",
        gap: "6px",
        height: "100%",
        justifyContent: "center",
        fontFamily: "var(--font-family)",
      }}
    >
      {heading && (
        <h2
          style={{
            margin: 0,
            fontSize: SIZE_MAP[headingSize] ?? SIZE_MAP.lg,
            color: "var(--color-text)",
            fontWeight: 700,
            lineHeight: 1.2,
            letterSpacing: "-0.02em",
          }}
        >
          {heading}
        </h2>
      )}
      {subheading && (
        <p
          style={{
            margin: 0,
            fontSize: "calc(var(--font-base-size) * 0.9)",
            color: "rgba(255,255,255,0.55)",
            fontWeight: 500,
          }}
        >
          {subheading}
        </p>
      )}
      {body && (
        <p
          style={{
            margin: 0,
            fontSize: "var(--font-base-size)",
            color: "rgba(255,255,255,0.72)",
            lineHeight: 1.6,
          }}
        >
          {body}
        </p>
      )}
    </div>
  );
}
