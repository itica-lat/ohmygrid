import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { GridCell, GridConfig, BrandTokens, GridMode } from "../types";
import type { Action } from "../state/reducer";
import { newId, createDefaultContent } from "../state/initialState";
import { brandToCssVars } from "../utils/brandCssVars";
import { TextCell } from "./cells/TextCell";
import { ImageCell } from "./cells/ImageCell";
import { StatCard } from "./cells/StatCard";
import { FeatureCard } from "./cells/FeatureCard";
import { TagCloud } from "./cells/TagCloud";
import { CodeSnippet } from "./cells/CodeSnippet";
import { BannerCell } from "./cells/BannerCell";
import { SkeletonCell } from "./cells/SkeletonCell";

interface Props {
  cells: GridCell[];
  gridConfig: GridConfig;
  brand: BrandTokens;
  selectedCellId: string | null;
  mode: GridMode;
  dispatch: React.Dispatch<Action>;
}

interface DragState {
  startCol: number;
  startRow: number;
  endCol: number;
  endRow: number;
}

function cellOccupies(cell: GridCell, col: number, row: number): boolean {
  return (
    col >= cell.colStart &&
    col < cell.colStart + cell.colSpan &&
    row >= cell.rowStart &&
    row < cell.rowStart + cell.rowSpan
  );
}

function isAreaFree(
  cells: GridCell[],
  colStart: number,
  rowStart: number,
  colSpan: number,
  rowSpan: number,
): boolean {
  for (let c = colStart; c < colStart + colSpan; c++) {
    for (let r = rowStart; r < rowStart + rowSpan; r++) {
      if (cells.some((cell) => cellOccupies(cell, c, r))) return false;
    }
  }
  return true;
}

function isSlotOccupied(cells: GridCell[], col: number, row: number): boolean {
  return cells.some((cell) => cellOccupies(cell, col, row));
}

function isAreaFreeExcept(
  cells: GridCell[],
  excludeId: string,
  colStart: number,
  rowStart: number,
  colSpan: number,
  rowSpan: number,
): boolean {
  return isAreaFree(
    cells.filter((c) => c.id !== excludeId),
    colStart,
    rowStart,
    colSpan,
    rowSpan,
  );
}

function renderCellContent(cell: GridCell, logo?: string) {
  switch (cell.content.type) {
    case "text":
      return <TextCell content={cell.content} />;
    case "image":
      return <ImageCell content={cell.content} />;
    case "stat":
      return <StatCard content={cell.content} />;
    case "feature":
      return <FeatureCard content={cell.content} />;
    case "tagcloud":
      return <TagCloud content={cell.content} />;
    case "code":
      return <CodeSnippet content={cell.content} />;
    case "banner":
      return <BannerCell content={cell.content} logo={logo} />;
  }
}

export function Canvas({ cells, gridConfig, brand, selectedCellId, mode, dispatch }: Props) {
  const { columns, rows, gap, padding } = gridConfig;
  const [drag, setDrag] = useState<DragState | null>(null);
  const [hoveredSlot, setHoveredSlot] = useState<{ col: number; row: number } | null>(null);
  const [loadingCells, setLoadingCells] = useState<Set<string>>(new Set());
  const [draggingCellId, setDraggingCellId] = useState<string | null>(null);
  const cellRects = useRef<Map<string, DOMRect>>(new Map());

  const handleSlotMouseDown = useCallback(
    (col: number, row: number, e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      window.getSelection()?.removeAllRanges();
      if (isSlotOccupied(cells, col, row)) return;
      setDrag({ startCol: col, startRow: row, endCol: col, endRow: row });
    },
    [cells],
  );

  const handleSlotMouseEnter = useCallback(
    (col: number, row: number) => {
      setHoveredSlot({ col, row });
      if (drag) {
        setDrag((prev) => (prev ? { ...prev, endCol: col, endRow: row } : null));
      }
    },
    [drag],
  );

  const handleMouseUp = useCallback(() => {
    if (drag) {
      const colStart = Math.min(drag.startCol, drag.endCol);
      const rowStart = Math.min(drag.startRow, drag.endRow);
      const colSpan = Math.abs(drag.endCol - drag.startCol) + 1;
      const rowSpan = Math.abs(drag.endRow - drag.startRow) + 1;
      if (isAreaFree(cells, colStart, rowStart, colSpan, rowSpan)) {
        const id = newId();
        dispatch({
          type: "ADD_CELL",
          cell: {
            id,
            colStart,
            rowStart,
            colSpan,
            rowSpan,
            content: createDefaultContent("text"),
          },
        });
        setLoadingCells((prev) => new Set(prev).add(id));
        setTimeout(() => {
          setLoadingCells((prev) => {
            const next = new Set(prev);
            next.delete(id);
            return next;
          });
        }, 500);
      }
      setDrag(null);
    }
  }, [drag, cells, dispatch]);

  const handleCanvasClick = useCallback(() => {
    if (draggingCellId) return;
    dispatch({ type: "SELECT_CELL", id: null });
  }, [dispatch, draggingCellId]);

  // Determine drag selection range
  const dragColStart = drag ? Math.min(drag.startCol, drag.endCol) : 0;
  const dragRowStart = drag ? Math.min(drag.startRow, drag.endRow) : 0;
  const dragColEnd = drag ? Math.max(drag.startCol, drag.endCol) : 0;
  const dragRowEnd = drag ? Math.max(drag.startRow, drag.endRow) : 0;

  function isInDragSelection(col: number, row: number): boolean {
    return (
      !!drag && col >= dragColStart && col <= dragColEnd && row >= dragRowStart && row <= dragRowEnd
    );
  }

  const dragIsValid = drag
    ? isAreaFree(
        cells,
        dragColStart,
        dragRowStart,
        dragColEnd - dragColStart + 1,
        dragRowEnd - dragRowStart + 1,
      )
    : true;

  const cssVars = brandToCssVars(brand);

  return (
    <div
      className="relative flex-1 overflow-auto"
      style={{ padding: 32 }}
      onMouseUp={handleMouseUp}
      onClick={handleCanvasClick}
    >
      {/* Canvas frame */}
      <div
        className="relative mx-auto rounded-2xl overflow-hidden"
        style={
          {
            ...cssVars,
            background: brand.colorBackground,
            minHeight: 480,
            padding,
            fontFamily: brand.fontFamily,
            "--color-text": brand.colorText,
          } as React.CSSProperties
        }
      >
        {/* CSS Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
            gridTemplateRows: `repeat(${rows}, minmax(100px, 1fr))`,
            gap,
            position: "relative",
          }}
        >
          {/* Cells */}
          <AnimatePresence mode="popLayout">
            {cells.map((cell) => {
              const isSelected = cell.id === selectedCellId;
              const cellBg = cell.customBackground ?? "rgba(255,255,255,0.06)";
              const cellRadius = cell.customBorderRadius ?? "var(--radius-scale)";
              const cellPad =
                cell.customPadding ?? "calc(var(--font-base-size, 16px) * var(--spacing-scale, 1))";
              return (
                <motion.div
                  layout
                  layoutId={cell.id}
                  key={cell.id}
                  initial={{ opacity: 0, scale: 0.95, y: 16 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -16 }}
                  whileHover={{ scale: 1.02 }}
                  drag={mode === "free" ? true : false}
                  dragMomentum={false}
                  dragElastic={0}
                  onDragStart={() => {
                    setDraggingCellId(cell.id);
                    const el = document.getElementById(`cell-${cell.id}`);
                    if (el) cellRects.current.set(cell.id, el.getBoundingClientRect());
                  }}
                  onDragEnd={(_, info) => {
                    const rect = cellRects.current.get(cell.id);
                    cellRects.current.delete(cell.id);
                    setDraggingCellId(null);
                    if (
                      !rect ||
                      (Math.abs(info.offset.x) < rect.width * 0.3 &&
                        Math.abs(info.offset.y) < rect.height * 0.3)
                    )
                      return;
                    const colDelta = Math.round(info.offset.x / rect.width);
                    const rowDelta = Math.round(info.offset.y / rect.height);
                    if (colDelta === 0 && rowDelta === 0) return;
                    const newCol = Math.max(
                      1,
                      Math.min(columns - cell.colSpan + 1, cell.colStart + colDelta),
                    );
                    const newRow = Math.max(
                      1,
                      Math.min(rows - cell.rowSpan + 1, cell.rowStart + rowDelta),
                    );
                    if (newCol === cell.colStart && newRow === cell.rowStart) return;
                    if (
                      isAreaFreeExcept(cells, cell.id, newCol, newRow, cell.colSpan, cell.rowSpan)
                    ) {
                      dispatch({
                        type: "UPDATE_CELL",
                        id: cell.id,
                        updates: { colStart: newCol, rowStart: newRow },
                      });
                    }
                  }}
                  className={`glass-card${isSelected ? " selected" : ""}`}
                  style={{
                    gridColumn: `${cell.colStart} / span ${cell.colSpan}`,
                    gridRow: `${cell.rowStart} / span ${cell.rowSpan}`,
                    background: cellBg,
                    borderRadius: cellRadius,
                    padding: cellPad,
                    overflow: "hidden",
                    cursor: mode === "free" ? "grab" : "pointer",
                    position: "relative",
                    zIndex: 10,
                  }}
                  onClick={(e) => {
                    if (draggingCellId === cell.id) return;
                    e.stopPropagation();
                    dispatch({ type: "SELECT_CELL", id: cell.id });
                  }}
                >
                  {loadingCells.has(cell.id) ? (
                    <SkeletonCell />
                  ) : (
                    renderCellContent(cell, brand.logo)
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Free-mode drag overlay */}
          {mode === "free" && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "grid",
                gridTemplateColumns: `repeat(${columns}, 1fr)`,
                gridTemplateRows: `repeat(${rows}, minmax(100px, 1fr))`,
                gap,
                pointerEvents: "none",
                zIndex: 5,
                userSelect: drag ? "none" : undefined,
              }}
            >
              {Array.from({ length: rows }, (_, ri) =>
                Array.from({ length: columns }, (_, ci) => {
                  const col = ci + 1;
                  const row = ri + 1;
                  const occupied = isSlotOccupied(cells, col, row);
                  const inDrag = isInDragSelection(col, row);
                  const hovered =
                    !occupied && !drag && hoveredSlot?.col === col && hoveredSlot?.row === row;
                  return (
                    <div
                      key={`${col}-${row}`}
                      style={{
                        gridColumn: col,
                        gridRow: row,
                        pointerEvents: occupied ? "none" : "auto",
                        borderRadius: "var(--radius-scale)",
                        border: inDrag
                          ? `2px solid ${dragIsValid ? "rgba(99,102,241,0.7)" : "rgba(239,68,68,0.7)"}`
                          : hovered
                            ? "1.5px dashed rgba(255,255,255,0.2)"
                            : "1px dashed rgba(255,255,255,0.07)",
                        background: inDrag
                          ? dragIsValid
                            ? "rgba(99,102,241,0.12)"
                            : "rgba(239,68,68,0.1)"
                          : "transparent",
                        transition: "border-color 0.1s, background 0.1s",
                        cursor: occupied ? "default" : "crosshair",
                      }}
                      onMouseDown={(e) => handleSlotMouseDown(col, row, e)}
                      onMouseEnter={() => handleSlotMouseEnter(col, row)}
                      onMouseLeave={() => setHoveredSlot(null)}
                      onDragStart={(e) => e.preventDefault()}
                    />
                  );
                }),
              )}
            </div>
          )}
        </div>

        {/* Empty-state hint for free mode */}
        {mode === "free" && cells.length === 0 && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              pointerEvents: "none",
            }}
          >
            <span style={{ fontSize: 36 }}>⊞</span>
            <p
              style={{
                margin: 0,
                color: "rgba(255,255,255,0.3)",
                fontSize: 14,
                fontFamily: brand.fontFamily,
              }}
            >
              Drag on the grid to add a cell
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
