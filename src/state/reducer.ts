import type { EditorState, GridCell, BrandTokens, GridConfig, GridMode, ExportTab } from "../types";
import { BLANK_STATE, INITIAL_STATE } from "./initialState";

export type Action =
  | { type: "SET_MODE"; mode: GridMode }
  | { type: "SET_GRID_CONFIG"; config: Partial<GridConfig> }
  | { type: "ADD_CELL"; cell: GridCell }
  | { type: "UPDATE_CELL"; id: string; updates: Partial<Omit<GridCell, "id">> }
  | { type: "DELETE_CELL"; id: string }
  | { type: "SELECT_CELL"; id: string | null }
  | { type: "SET_BRAND"; brand: Partial<BrandTokens> }
  | { type: "OPEN_EXPORT" }
  | { type: "CLOSE_EXPORT" }
  | { type: "SET_EXPORT_TAB"; tab: ExportTab }
  | { type: "SET_ACTIVE_TEMPLATE"; id: string | null }
  | { type: "RESET" }
  | { type: "LOAD_EXAMPLE" }
  | { type: "LOAD_STATE"; state: EditorState };

export function reducer(state: EditorState, action: Action): EditorState {
  switch (action.type) {
    case "SET_MODE":
      return { ...state, mode: action.mode };
    case "SET_GRID_CONFIG":
      return { ...state, gridConfig: { ...state.gridConfig, ...action.config } };
    case "ADD_CELL":
      return { ...state, cells: [...state.cells, action.cell], selectedCellId: action.cell.id };
    case "UPDATE_CELL":
      return {
        ...state,
        cells: state.cells.map((c) => (c.id === action.id ? { ...c, ...action.updates } : c)),
      };
    case "DELETE_CELL":
      return {
        ...state,
        cells: state.cells.filter((c) => c.id !== action.id),
        selectedCellId: state.selectedCellId === action.id ? null : state.selectedCellId,
      };
    case "SELECT_CELL":
      return { ...state, selectedCellId: action.id };
    case "SET_BRAND":
      return { ...state, brand: { ...state.brand, ...action.brand } };
    case "OPEN_EXPORT":
      return { ...state, isExportModalOpen: true };
    case "CLOSE_EXPORT":
      return { ...state, isExportModalOpen: false };
    case "SET_EXPORT_TAB":
      return { ...state, exportTab: action.tab };
    case "SET_ACTIVE_TEMPLATE":
      return { ...state, activeTemplateId: action.id };
    case "RESET":
      return { ...BLANK_STATE, brand: state.brand };
    case "LOAD_EXAMPLE":
      return { ...INITIAL_STATE };
    case "LOAD_STATE":
      return action.state;
    default:
      return state;
  }
}
