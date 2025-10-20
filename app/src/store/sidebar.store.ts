import { create } from "zustand/react";

interface SidebarStore {
  aiSidebarOpen: boolean;
  foldersSidebarOpen: boolean;
  toggleAiSidebar: () => void;
  toggleFoldersSidebar: () => void;
  setAiSidebarOpen: (open: boolean) => void;
  setFoldersSidebarOpen: (open: boolean) => void;
}

const useSidebarStore = create<SidebarStore>((set) => ({
  aiSidebarOpen: false,
  foldersSidebarOpen: false, // Start closed - mobile will use this, desktop ignores it

  toggleAiSidebar: () => set((state) => ({ aiSidebarOpen: !state.aiSidebarOpen })),

  toggleFoldersSidebar: () => set((state) => ({ foldersSidebarOpen: !state.foldersSidebarOpen })),

  setAiSidebarOpen: (open: boolean) => set(() => ({ aiSidebarOpen: open })),

  setFoldersSidebarOpen: (open: boolean) => set(() => ({ foldersSidebarOpen: open })),
}));

export default useSidebarStore;
