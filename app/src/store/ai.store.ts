import { aiServerHealthCheck } from "@/actions/ai.actions";
import { create } from "zustand/react";

interface AiStore {
  isAiServerReachable: boolean;
  setAiServerReachable: (reachable: boolean) => void;
  checkAiServerReachability: () => Promise<void>;
}

const useAiStore = create<AiStore>((set) => ({
  isAiServerReachable: true,
  setAiServerReachable: (reachable: boolean) => set({ isAiServerReachable: reachable }),

  checkAiServerReachability: async () => {
    const result = await aiServerHealthCheck();
    set({ isAiServerReachable: result.status });
  }
}));

export default useAiStore;
