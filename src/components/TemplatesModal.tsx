import { useState, useEffect } from "react";
import type { Action } from "../state/reducer";
import type { GridCell, GridConfig, BrandTokens } from "../types";
import { TEMPLATES } from "../utils/templates";
import { loadSavedTemplates, deleteSavedTemplate } from "../utils/localStorage";
import type { SavedTemplate } from "../types";
import { useT } from "../lib/i18n";

interface Props {
  currentBrand: BrandTokens;
  currentGridConfig: GridConfig;
  currentCells: GridCell[];
  dispatch: React.Dispatch<Action>;
  onClose: () => void;
}

export function TemplatesModal({ currentBrand, dispatch, onClose }: Props) {
  const [saved, setSaved] = useState<SavedTemplate[]>(() => loadSavedTemplates());
  const t = useT();

  // Reload saved templates when modal opens (in case TopBar saved one)
  useEffect(() => {
    setSaved(loadSavedTemplates());
  }, []);

  function loadTemplate(gridConfig: GridConfig, cells: GridCell[], brand: BrandTokens) {
    let counter = Date.now();
    dispatch({
      type: "LOAD_STATE",
      state: {
        mode: "template",
        gridConfig,
        cells: cells.map((c) => ({ ...c, id: `tpl-${counter++}` })),
        selectedCellId: null,
        brand,
        isExportModalOpen: false,
        exportTab: "react",
        activeTemplateId: null,
      },
    });
    onClose();
  }

  function handleDeleteSaved(id: string) {
    deleteSavedTemplate(id);
    setSaved((prev) => prev.filter((t) => t.id !== id));
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
          width: 560,
          maxHeight: "80vh",
          borderRadius: 16,
          border: "1px solid rgba(255,255,255,0.12)",
          padding: 28,
          display: "flex",
          flexDirection: "column",
          gap: 20,
          overflowY: "auto",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: "#f8fafc" }}>
            {t("templates.title")}
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

        {/* Saved templates */}
        {saved.length > 0 && (
          <section>
            <p className="section-label">{t("templates.savedLayouts")}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {saved.map((t) => (
                <TemplateRow
                  key={t.id}
                  name={t.name}
                  columns={t.gridConfig.columns}
                  rows={t.gridConfig.rows}
                  cellCount={t.cells.length}
                  createdAt={t.createdAt}
                  onLoad={() => loadTemplate(t.gridConfig, t.cells, t.brand ?? currentBrand)}
                  onDelete={() => handleDeleteSaved(t.id)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Built-in templates */}
        <section>
          <p className="section-label">{t("templates.builtin")}</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {TEMPLATES.map((t) => (
              <TemplateRow
                key={t.id}
                name={t.name}
                columns={t.config.columns}
                rows={t.config.rows}
                cellCount={t.cells.length}
                onLoad={() => loadTemplate(t.config, t.cells, currentBrand)}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function TemplateRow({
  name,
  columns,
  rows,
  cellCount,
  createdAt,
  onLoad,
  onDelete,
}: {
  name: string;
  columns: number;
  rows: number;
  cellCount: number;
  createdAt?: number;
  onLoad: () => void;
  onDelete?: () => void;
}) {
  const t = useT();
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "10px 14px",
        borderRadius: 10,
        border: "1px solid rgba(255,255,255,0.07)",
        background: "rgba(255,255,255,0.03)",
      }}
    >
      {/* Mini grid preview */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${Math.min(columns, 4)}, 1fr)`,
          gap: 2,
          width: 40,
          flexShrink: 0,
        }}
      >
        {Array.from({ length: Math.min(columns * Math.min(rows, 2), 12) }).map((_, i) => (
          <div
            key={i}
            style={{ height: 5, borderRadius: 2, background: "rgba(99,102,241,0.45)" }}
          />
        ))}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            margin: 0,
            fontSize: 13,
            fontWeight: 600,
            color: "#f8fafc",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {name}
        </p>
        <p style={{ margin: 0, fontSize: 11, color: "rgba(255,255,255,0.3)" }}>
          {columns}×{rows} · {cellCount}{" "}
          {cellCount === 1 ? t("templates.cellSingular") : t("templates.cellPlural")}
          {createdAt && <> · {new Date(createdAt).toLocaleDateString()}</>}
        </p>
      </div>

      <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
        <button
          className="btn-primary"
          style={{ height: 28, padding: "0 14px", fontSize: 12 }}
          onClick={onLoad}
        >
          {t("templates.load")}
        </button>
        {onDelete && (
          <button
            onClick={onDelete}
            style={{
              height: 28,
              padding: "0 10px",
              borderRadius: 7,
              border: "1px solid rgba(239,68,68,0.22)",
              background: "rgba(239,68,68,0.06)",
              color: "#f87171",
              fontSize: 12,
              cursor: "pointer",
            }}
          >
            {t("templates.delete")}
          </button>
        )}
      </div>
    </div>
  );
}
