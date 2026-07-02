import type { ReactFlowInstance } from "@xyflow/react";
import { create } from "zustand";

type State = {
  editorState: ReactFlowInstance | null;
};

type Actions = {
  setEditorState: (state: ReactFlowInstance | null) => void;
};

export const useEditorStore = create<State & Actions>((set) => ({
  editorState: null,
  setEditorState: (state) => set({ editorState: state }),
}));
