import { useState, useCallback } from "react";
import type { EditorState, ExportTab } from "../types";
import type { Action } from "../state/reducer";
import { generateReactExport, generateHtmlExport } from "../utils/exportUtils";

interface Props {
  state: EditorState;
  dispatch: React.Dispatch<Action>;
}

export function ExportModal({ state, dispatch }: Props) {
  const [copied, setCopied] = useState(false);

  const { exportTab } = state;
  const code = exportTab === "react" ? generateReactExport(state) : generateHtmlExport(state);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [code]);

  const handleDownload = useCallback(() => {
    const ext = exportTab === "react" ? "tsx" : "html";
    const mime = exportTab === "react" ? "text/plain" : "text/html";
    const blob = new Blob([code], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bento-grid.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  }, [code, exportTab]);

  const setTab = (tab: ExportTab) => dispatch({ type: "SET_EXPORT_TAB", tab });

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.7)",
        backdropFilter: "blur(8px)",
      }}
      onClick={() => dispatch({ type: "CLOSE_EXPORT" })}
    >
      <div
        className="glass-strong"
        style={{
          width: 720,
          maxWidth: "90vw",
          maxHeight: "85vh",
          borderRadius: 20,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal header */}
        <div
          style={{
            padding: "18px 20px 14px",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <span style={{ fontWeight: 700, fontSize: 15, color: "#f8fafc" }}>Export Code</span>
          <div style={{ flex: 1 }} />

          {/* Tab switcher */}
          <div
            style={{
              display: "flex",
              gap: 2,
              background: "rgba(255,255,255,0.06)",
              borderRadius: 8,
              padding: 3,
            }}
          >
            {(["react", "html"] as ExportTab[]).map((tab) => (
              <button
                key={tab}
                className={`tab-btn${exportTab === tab ? " active" : ""}`}
                onClick={() => setTab(tab)}
                style={{ minWidth: 80 }}
              >
                {tab === "react" ? "⚛ React TSX" : "🌐 HTML/CSS"}
              </button>
            ))}
          </div>

          {/* Copy + Download */}
          <button className="btn-ghost" style={{ fontSize: 12 }} onClick={handleCopy}>
            {copied ? "✓ Copied!" : "Copy"}
          </button>
          <button className="btn-primary" style={{ fontSize: 12 }} onClick={handleDownload}>
            ↓ Download
          </button>

          {/* Close */}
          <button
            className="btn-icon"
            onClick={() => dispatch({ type: "CLOSE_EXPORT" })}
            style={{ marginLeft: 4 }}
          >
            ✕
          </button>
        </div>

        {/* Info bar */}
        <div
          style={{
            padding: "8px 20px",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            background: "rgba(99,102,241,0.06)",
            fontSize: 12,
            color: "rgba(255,255,255,0.5)",
          }}
        >
          {exportTab === "react"
            ? "Self-contained TSX component with brand tokens as CSS variables. Paste into any React project."
            : "Standalone HTML file with embedded styles. No dependencies required — open in any browser."}
        </div>

        {/* Code */}
        <div
          style={{
            flex: 1,
            overflow: "auto",
            padding: 16,
          }}
        >
          <pre
            style={{
              margin: 0,
              fontFamily: 'ui-monospace, Consolas, "Courier New", monospace',
              fontSize: 12,
              lineHeight: 1.6,
              color: "rgba(255,255,255,0.82)",
              whiteSpace: "pre",
              tabSize: 2,
            }}
          >
            {code}
          </pre>
        </div>
      </div>
    </div>
  );
}
