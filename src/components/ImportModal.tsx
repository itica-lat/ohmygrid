import { useState, useRef } from "react";
import type { Action } from "../state/reducer";
import { parseExportFile } from "../utils/importParser";
import type { GridCell, GridConfig, BrandTokens } from "../types";
import { useT } from "../lib/i18n";

interface Props {
  currentBrand: BrandTokens;
  dispatch: React.Dispatch<Action>;
  onClose: () => void;
}

interface ParsedPreview {
  gridConfig: GridConfig;
  cells: GridCell[];
  brand?: Partial<BrandTokens>;
}

export function ImportModal({ currentBrand, dispatch, onClose }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [parsed, setParsed] = useState<ParsedPreview | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const t = useT();

  async function handleFile(f: File) {
    setFile(f);
    setParsed(null);
    setError(null);
    try {
      const text = await f.text();
      const result = parseExportFile(text, f.name);
      if (!result) {
        setError(t("import.parseError"));
        return;
      }
      setParsed(result);
    } catch {
      setError(t("import.unexpectedError"));
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }

  function handleConfirm() {
    if (!parsed) return;
    dispatch({
      type: "LOAD_STATE",
      state: {
        mode: "free",
        gridConfig: parsed.gridConfig,
        cells: parsed.cells,
        selectedCellId: null,
        brand: parsed.brand ? { ...currentBrand, ...parsed.brand } : currentBrand,
        isExportModalOpen: false,
        exportTab: "react",
        activeTemplateId: null,
      },
    });
    onClose();
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        background: "rgba(0,0,0,0.65)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="glass-strong"
        style={{
          width: 460,
          borderRadius: 16,
          border: "1px solid rgba(255,255,255,0.12)",
          padding: 28,
          display: "flex",
          flexDirection: "column",
          gap: 18,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: "#f8fafc" }}>
            {t("import.title")}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              color: "rgba(255,255,255,0.4)",
              fontSize: 20,
              cursor: "pointer",
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>

        <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.5 }}>
          {t("import.instruction.before")}{" "}
          <strong style={{ color: "rgba(255,255,255,0.65)" }}>.tsx</strong>{" "}
          {t("import.instruction.or")}{" "}
          <strong style={{ color: "rgba(255,255,255,0.65)" }}>.html</strong>{" "}
          {t("import.instruction.after")}
        </p>

        {/* Drop zone */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          style={{
            border: "2px dashed rgba(99,102,241,0.35)",
            borderRadius: 12,
            padding: "32px 20px",
            textAlign: "center",
            cursor: "pointer",
            background: "rgba(99,102,241,0.04)",
            transition: "border-color 0.15s ease",
          }}
        >
          <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.4)" }}>
            {file ? file.name : t("import.dropZone")}
          </p>
          <input
            ref={inputRef}
            type="file"
            accept=".tsx,.html,.htm"
            style={{ display: "none" }}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
            }}
          />
        </div>

        {/* Error */}
        {error && (
          <div
            style={{
              background: "rgba(239,68,68,0.09)",
              border: "1px solid rgba(239,68,68,0.25)",
              borderRadius: 8,
              padding: "10px 14px",
              fontSize: 13,
              color: "#fca5a5",
            }}
          >
            {error}
          </div>
        )}

        {/* Preview */}
        {parsed && (
          <div
            style={{
              background: "rgba(99,102,241,0.07)",
              border: "1px solid rgba(99,102,241,0.2)",
              borderRadius: 10,
              padding: "12px 16px",
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: 13,
                color: "#a5b4fc",
                fontWeight: 600,
                marginBottom: 8,
              }}
            >
              {t("import.ready")}
            </p>
            <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
              <Stat label={t("import.cells")} value={String(parsed.cells.length)} />
              <Stat label={t("import.columns")} value={String(parsed.gridConfig.columns)} />
              <Stat label={t("import.rows")} value={String(parsed.gridConfig.rows)} />
              {parsed.brand && <Stat label={t("import.brand")} value={t("import.included")} />}
            </div>
          </div>
        )}

        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button className="btn-ghost" onClick={onClose}>
            {t("import.cancel")}
          </button>
          <button
            className="btn-primary"
            onClick={handleConfirm}
            disabled={!parsed}
            style={{ opacity: parsed ? 1 : 0.4, cursor: parsed ? "pointer" : "not-allowed" }}
          >
            {t("import.importLayout")}
          </button>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p
        style={{
          margin: 0,
          fontSize: 10,
          color: "rgba(255,255,255,0.35)",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
        }}
      >
        {label}
      </p>
      <p style={{ margin: 0, fontSize: 16, fontWeight: 600, color: "#f8fafc" }}>{value}</p>
    </div>
  );
}
