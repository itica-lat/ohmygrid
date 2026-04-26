import { useReducer, useEffect, useCallback, useState } from "react";
import { reducer } from "./state/reducer";
import { INITIAL_STATE } from "./state/initialState";
import type { EditorState } from "./types";
import { TopBar } from "./components/TopBar";
import { BrandPanel } from "./components/BrandPanel";
import { Canvas } from "./components/Canvas";
import { CellEditor } from "./components/CellEditor";
import { ExportModal } from "./components/ExportModal";
import { ImportModal } from "./components/ImportModal";
import { TemplatesModal } from "./components/TemplatesModal";

const STORAGE_KEY = "ohmygrid-state-v1";

function loadSavedState(): EditorState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as EditorState;
  } catch {
    return null;
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, null, () => {
    const saved = loadSavedState();
    return saved ?? INITIAL_STATE;
  });

  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);

  // Auto-save on every state change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Storage quota exceeded — ignore
    }
  }, [state]);

  const selectedCell = state.cells.find((c) => c.id === state.selectedCellId) ?? null;

  const handleDispatch = useCallback(dispatch, [dispatch]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        overflow: "hidden",
        background: "#0a0a0f",
        color: "#f8fafc",
      }}
    >
      {/* Top bar */}
      <TopBar
        mode={state.mode}
        gridConfig={state.gridConfig}
        brand={state.brand}
        cells={state.cells}
        cellCount={state.cells.length}
        activeTemplateId={state.activeTemplateId}
        onOpenImport={() => setIsImportOpen(true)}
        onOpenTemplates={() => setIsTemplatesOpen(true)}
        dispatch={handleDispatch}
      />

      {/* Main layout */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden", minHeight: 0 }}>
        {/* Left sidebar — brand panel */}
        <BrandPanel brand={state.brand} dispatch={handleDispatch} />

        {/* Center — canvas */}
        <Canvas
          cells={state.cells}
          gridConfig={state.gridConfig}
          brand={state.brand}
          selectedCellId={state.selectedCellId}
          mode={state.mode}
          dispatch={handleDispatch}
        />

        {/* Right sidebar — cell editor */}
        <CellEditor
          cell={selectedCell}
          cells={state.cells}
          gridConfig={state.gridConfig}
          mode={state.mode}
          brand={state.brand}
          dispatch={handleDispatch}
        />
      </div>

      {/* Export modal */}
      {state.isExportModalOpen && <ExportModal state={state} dispatch={handleDispatch} />}

      {/* Import modal */}
      {isImportOpen && (
        <ImportModal
          currentBrand={state.brand}
          dispatch={handleDispatch}
          onClose={() => setIsImportOpen(false)}
        />
      )}

      {/* Templates modal */}
      {isTemplatesOpen && (
        <TemplatesModal
          currentBrand={state.brand}
          currentGridConfig={state.gridConfig}
          currentCells={state.cells}
          dispatch={handleDispatch}
          onClose={() => setIsTemplatesOpen(false)}
        />
      )}
    </div>
  );
}

export default App;
