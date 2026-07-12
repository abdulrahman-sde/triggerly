import { create } from "zustand";

type WorkflowRunState = {
  runId: string | null;
  setRunId: (runId: string | null) => void;
};

export const useWorkflowRun = create<WorkflowRunState>((set) => ({
  runId: null,
  setRunId: (runId) => set({ runId }),
}));
