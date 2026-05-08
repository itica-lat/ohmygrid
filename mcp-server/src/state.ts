import type {
  GridCell,
  GridConfig,
  BrandTokens,
  EditorState,
  CellContent,
  GridMode,
} from "../../src/types";
import { BLANK_STATE, INITIAL_STATE, newId } from "../../src/state/initialState";

// ─── Overlap check (ported from CellEditor.tsx) ────────────────────────────

function cellsOverlap(
  a: { colStart: number; rowStart: number; colSpan: number; rowSpan: number },
  b: { colStart: number; rowStart: number; colSpan: number; rowSpan: number },
): boolean {
  return (
    a.colStart < b.colStart + b.colSpan &&
    a.colStart + a.colSpan > b.colStart &&
    a.rowStart < b.rowStart + b.rowSpan &&
    a.rowStart + a.rowSpan > b.rowStart
  );
}

export function wouldOverlap(
  cells: GridCell[],
  currentId: string,
  geo: { colStart: number; rowStart: number; colSpan: number; rowSpan: number },
): boolean {
  return cells.some((c) => c.id !== currentId && cellsOverlap(c, geo));
}

// ─── Content builder ───────────────────────────────────────────────────────

type ContentFields = Record<string, unknown>;

export function buildContent(type: CellContent["type"], fields: ContentFields): CellContent {
  switch (type) {
    case "text":
      return {
        type: "text",
        heading: (fields.heading as string) ?? "",
        subheading: (fields.subheading as string) ?? "",
        body: (fields.body as string) ?? "",
        align: (fields.align as CellContent & { type: "text" })["align"] ?? "left",
        headingSize: (fields.headingSize as CellContent & { type: "text" })["headingSize"] ?? "md",
      };
    case "image":
      return {
        type: "image",
        src: (fields.src as string) ?? "",
        alt: (fields.alt as string) ?? "",
        fit: (fields.fit as CellContent & { type: "image" })["fit"] ?? "cover",
        position: (fields.position as string) ?? "center center",
      };
    case "stat":
      return {
        type: "stat",
        label: (fields.label as string) ?? "",
        value: (fields.value as string) ?? "",
        trend: (fields.trend as string) ?? "",
        trendDirection:
          (fields.trendDirection as CellContent & { type: "stat" })["trendDirection"] ?? "up",
      };
    case "feature":
      return {
        type: "feature",
        icon: (fields.icon as string) ?? "",
        title: (fields.title as string) ?? "",
        description: (fields.description as string) ?? "",
      };
    case "tagcloud":
      return {
        type: "tagcloud",
        tags: (fields.tags as string[]) ?? [],
      };
    case "code":
      return {
        type: "code",
        language: (fields.language as string) ?? "",
        code: (fields.code as string) ?? "",
      };
    case "banner":
      return {
        type: "banner",
        title: (fields.title as string) ?? "",
        subtitle: (fields.subtitle as string) ?? "",
        showLogo: (fields.showLogo as boolean) ?? false,
        logoPosition:
          (fields.logoPosition as CellContent & { type: "banner" })["logoPosition"] ?? "left",
        gradientFrom: (fields.gradientFrom as string) ?? "#6366f1",
        gradientTo: (fields.gradientTo as string) ?? "#06b6d4",
        gradientAngle: (fields.gradientAngle as number) ?? 135,
        textAlign: (fields.textAlign as CellContent & { type: "banner" })["textAlign"] ?? "left",
      };
  }
}

// ─── State Manager ─────────────────────────────────────────────────────────

class StateManager {
  private state: EditorState = { ...BLANK_STATE };

  getState(): EditorState {
    return this.state;
  }

  dispatch(action: Record<string, unknown> & { type: string }): void {
    switch (action.type) {
      case "SET_MODE":
        this.state = { ...this.state, mode: action.mode as GridMode };
        break;
      case "SET_GRID_CONFIG":
        this.state = {
          ...this.state,
          gridConfig: { ...this.state.gridConfig, ...(action.config as Partial<GridConfig>) },
        };
        break;
      case "ADD_CELL":
        this.state = {
          ...this.state,
          cells: [...this.state.cells, action.cell as GridCell],
          selectedCellId: (action.cell as GridCell).id,
        };
        break;
      case "UPDATE_CELL":
        this.state = {
          ...this.state,
          cells: this.state.cells.map((c: GridCell) =>
            c.id === (action.id as string)
              ? { ...c, ...(action.updates as Partial<Omit<GridCell, "id">>) }
              : c,
          ),
        };
        break;
      case "DELETE_CELL":
        this.state = {
          ...this.state,
          cells: this.state.cells.filter((c: GridCell) => c.id !== (action.id as string)),
          selectedCellId:
            this.state.selectedCellId === (action.id as string) ? null : this.state.selectedCellId,
        };
        break;
      case "SELECT_CELL":
        this.state = { ...this.state, selectedCellId: action.id as string | null };
        break;
      case "SET_BRAND":
        this.state = {
          ...this.state,
          brand: { ...this.state.brand, ...(action.brand as Partial<BrandTokens>) },
        };
        break;
      case "SET_ACTIVE_TEMPLATE":
        this.state = { ...this.state, activeTemplateId: action.id as string | null };
        break;
      case "RESET":
        this.state = { ...BLANK_STATE, brand: this.state.brand };
        break;
      case "LOAD_EXAMPLE":
        this.state = { ...INITIAL_STATE };
        break;
      case "LOAD_STATE":
        this.state = action.state as EditorState;
        break;
      default:
        break;
    }
  }

  addCell(cell: GridCell): void {
    this.dispatch({ type: "ADD_CELL", cell });
  }

  updateCell(id: string, updates: Partial<Omit<GridCell, "id">>): void {
    this.dispatch({ type: "UPDATE_CELL", id, updates });
  }

  deleteCell(id: string): void {
    this.dispatch({ type: "DELETE_CELL", id });
  }

  setGridConfig(config: Partial<GridConfig>): void {
    this.dispatch({ type: "SET_GRID_CONFIG", config });
  }

  setBrand(brand: Partial<BrandTokens>): void {
    this.dispatch({ type: "SET_BRAND", brand });
  }

  reset(): void {
    this.dispatch({ type: "RESET" });
  }

  loadExample(): void {
    this.dispatch({ type: "LOAD_EXAMPLE" });
  }

  get cells(): GridCell[] {
    return this.state.cells;
  }

  get gridConfig(): GridConfig {
    return this.state.gridConfig;
  }

  get brand(): BrandTokens {
    return this.state.brand;
  }

  newCellId(): string {
    return newId();
  }
}

export const stateManager = new StateManager();
