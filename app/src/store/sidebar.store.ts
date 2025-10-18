import { create } from "zustand/react";

interface SidebarStore {
  aiSidebarOpen: boolean;
  foldersSidebarOpen: boolean;
  toggleAiSidebar: () => void;
  toggleFoldersSidebar: () => void;
}

const useSidebarStore = create<SidebarStore>((set) => ({
  aiSidebarOpen: false,
  foldersSidebarOpen: true,

  toggleAiSidebar: () => set((state) => ({ aiSidebarOpen: !state.aiSidebarOpen })),

  toggleFoldersSidebar: () => set((state) => ({ foldersSidebarOpen: !state.foldersSidebarOpen })),
}));

export default useSidebarStore;
