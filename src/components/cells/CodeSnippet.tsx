import type { CodeContent } from "../../types";

interface Props {
  content: CodeContent;
}

export function CodeSnippet({ content }: Props) {
  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      {content.language && (
        <span
          style={{
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.3)",
            fontFamily: "var(--font-family)",
          }}
        >
          {content.language}
        </span>
      )}
      <pre
        style={{
          margin: 0,
          flex: 1,
          fontFamily: 'ui-monospace, Consolas, "Courier New", monospace',
          fontSize: 12,
          lineHeight: 1.65,
          color: "rgba(255,255,255,0.82)",
          overflow: "auto",
          background: "rgba(0,0,0,0.25)",
          borderRadius: 8,
          padding: 10,
          tabSize: 2,
          whiteSpace: "pre",
        }}
      >
        <code>{content.code}</code>
      </pre>
    </div>
  );
}
