import { useState } from "react";
import type { GridMode, GridConfig, BrandTokens } from "../types";
import type { Action } from "../state/reducer";
import { TEMPLATES } from "../utils/templates";
import { saveTemplate } from "../utils/localStorage";

interface Props {
  mode: GridMode;
  gridConfig: GridConfig;
  brand: BrandTokens;
  cellCount: number;
  activeTemplateId: string | null;
  cells: import("../types").GridCell[];
  onOpenImport: () => void;
  onOpenTemplates: () => void;
  dispatch: React.Dispatch<Action>;
}

// ─── Divider ──────────────────────────────────────────────────────────────────

function Sep() {
  return (
    <div style={{ width: 1, height: 18, background: "rgba(255,255,255,0.09)", flexShrink: 0 }} />
  );
}

// ─── Number stepper ───────────────────────────────────────────────────────────

function Stepper({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
      <span style={{ fontSize: 11, color: "rgba(255,255,255,0.38)", letterSpacing: "0.04em" }}>
        {label}
      </span>
      <button
        onClick={() => onChange(Math.max(min, value - 1))}
        style={{
          width: 22,
          height: 22,
          borderRadius: 5,
          border: "1px solid rgba(255,255,255,0.1)",
          background: "transparent",
          color: "rgba(255,255,255,0.5)",
          cursor: "pointer",
          fontSize: 14,
          lineHeight: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        −
      </button>
      <span
        style={{
          fontSize: 13,
          fontWeight: 500,
          color: "#f8fafc",
          minWidth: 18,
          textAlign: "center",
        }}
      >
        {value}
      </span>
      <button
        onClick={() => onChange(Math.min(max, value + 1))}
        style={{
          width: 22,
          height: 22,
          borderRadius: 5,
          border: "1px solid rgba(255,255,255,0.1)",
          background: "transparent",
          color: "rgba(255,255,255,0.5)",
          cursor: "pointer",
          fontSize: 14,
          lineHeight: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        +
      </button>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function TopBar({
  mode,
  gridConfig,
  brand,
  cellCount,
  activeTemplateId,
  cells,
  onOpenImport,
  onOpenTemplates,
  dispatch,
}: Props) {
  const { columns, rows, gap } = gridConfig;
  const [savingName, setSavingName] = useState("");
  const [showSaveInput, setShowSaveInput] = useState(false);

  function handleTemplateApply(templateId: string) {
    const tpl = TEMPLATES.find((t) => t.id === templateId);
    if (!tpl) return;
    let idCounter = Date.now();
    dispatch({
      type: "LOAD_STATE",
      state: {
        mode: "template",
        gridConfig: tpl.config,
        cells: tpl.cells.map((c) => ({ ...c, id: `tpl-${idCounter++}` })),
        selectedCellId: null,
        brand, // ← preserve current brand
        isExportModalOpen: false,
        exportTab: "react",
        activeTemplateId: templateId,
      },
    });
  }

  function handleSaveTemplate() {
    const name = savingName.trim();
    if (!name) return;
    saveTemplate(name, gridConfig, cells, brand);
    setSavingName("");
    setShowSaveInput(false);
    onOpenTemplates(); // open templates modal to show the newly saved one
  }

  return (
    <div
      style={{
        height: 52,
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "0 16px",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        background: "rgba(10,10,15,0.95)",
        backdropFilter: "blur(16px)",
        flexShrink: 0,
        position: "relative",
        zIndex: 50,
      }}
    >
      {/* Wordmark */}
      <span
        style={{
          fontWeight: 700,
          fontSize: 14,
          letterSpacing: "-0.03em",
          color: "#f8fafc",
          userSelect: "none",
          flexShrink: 0,
        }}
      >
        oh<span style={{ color: "#6366f1" }}>my</span>grid
      </span>

      <Sep />

      {/* Mode toggle — pill segment */}
      <div
        style={{
          display: "flex",
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 8,
          padding: 3,
          gap: 2,
        }}
      >
        {(["free", "template"] as GridMode[]).map((m) => (
          <button
            key={m}
            onClick={() => dispatch({ type: "SET_MODE", mode: m })}
            style={{
              padding: "4px 14px",
              borderRadius: 6,
              border: "none",
              fontSize: 12,
              fontWeight: 500,
              cursor: "pointer",
              transition: "all 0.12s ease",
              background: mode === m ? "rgba(99,102,241,0.85)" : "transparent",
              color: mode === m ? "#fff" : "rgba(255,255,255,0.4)",
            }}
          >
            {m === "free" ? "Free" : "Template"}
          </button>
        ))}
      </div>

      {/* Template picker */}
      {mode === "template" && (
        <select
          className="input-base"
          style={{ width: 176, height: 30, padding: "0 10px", fontSize: 12 }}
          value={activeTemplateId ?? ""}
          onChange={(e) => {
            if (e.target.value) handleTemplateApply(e.target.value);
          }}
        >
          <option value="">Built-in templates…</option>
          {TEMPLATES.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
      )}

      <Sep />

      {/* Grid dimension steppers */}
      <Stepper
        label="Cols"
        value={columns}
        min={1}
        max={12}
        onChange={(v) => dispatch({ type: "SET_GRID_CONFIG", config: { columns: v } })}
      />
      <Sep />
      <Stepper
        label="Rows"
        value={rows}
        min={1}
        max={12}
        onChange={(v) => dispatch({ type: "SET_GRID_CONFIG", config: { rows: v } })}
      />
      <Sep />

      {/* Gap slider */}
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.38)", letterSpacing: "0.04em" }}>
          Gap
        </span>
        <input
          type="range"
          min={0}
          max={48}
          step={4}
          value={gap}
          onChange={(e) => dispatch({ type: "SET_GRID_CONFIG", config: { gap: +e.target.value } })}
          style={{ width: 72, accentColor: "#6366f1" }}
        />
        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", minWidth: 28 }}>{gap}px</span>
      </div>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Cell count badge */}
      <span style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", flexShrink: 0 }}>
        {cellCount} cell{cellCount !== 1 ? "s" : ""}
      </span>

      <Sep />

      {/* Save template inline input or button */}
      {showSaveInput ? (
        <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
          <input
            type="text"
            autoFocus
            value={savingName}
            onChange={(e) => setSavingName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSaveTemplate();
              if (e.key === "Escape") setShowSaveInput(false);
            }}
            placeholder="Template name…"
            className="input-base"
            style={{ width: 148, height: 28, padding: "0 8px", fontSize: 12 }}
          />
          <button
            className="btn-primary"
            style={{ height: 28, padding: "0 12px", fontSize: 12 }}
            onClick={handleSaveTemplate}
          >
            Save
          </button>
          <button
            className="btn-ghost"
            style={{ height: 28, padding: "0 10px", fontSize: 12 }}
            onClick={() => setShowSaveInput(false)}
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          className="btn-ghost"
          style={{ height: 28, padding: "0 12px", fontSize: 12 }}
          onClick={() => setShowSaveInput(true)}
        >
          Save Layout
        </button>
      )}

      {/* Templates library */}
      <button
        className="btn-ghost"
        style={{ height: 28, padding: "0 12px", fontSize: 12 }}
        onClick={onOpenTemplates}
      >
        Templates
      </button>

      {/* Import */}
      <button
        className="btn-ghost"
        style={{ height: 28, padding: "0 12px", fontSize: 12 }}
        onClick={onOpenImport}
      >
        Import
      </button>

      <Sep />

      {/* Reset / Example */}
      <button
        className="btn-ghost"
        style={{ height: 28, padding: "0 10px", fontSize: 12 }}
        onClick={() => dispatch({ type: "RESET" })}
      >
        Reset
      </button>
      <button
        className="btn-ghost"
        style={{ height: 28, padding: "0 10px", fontSize: 12 }}
        onClick={() => dispatch({ type: "LOAD_EXAMPLE" })}
      >
        Example
      </button>

      {/* Export */}
      <button
        className="btn-primary"
        style={{ height: 28, padding: "0 14px", fontSize: 12 }}
        onClick={() => dispatch({ type: "OPEN_EXPORT" })}
      >
        Export
      </button>
    </div>
  );
}
