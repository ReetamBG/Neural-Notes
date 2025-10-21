import { create } from "zustand/react";

interface SidebarStore {
  aiSidebarOpen: boolean;
  aiSidebarOpenMobile: boolean;
  foldersSidebarOpen: boolean;
  toggleAiSidebar: () => void;
  toggleAiSidebarMobile: () => void;
  toggleFoldersSidebar: () => void;
}

const useSidebarStore = create<SidebarStore>((set) => ({
  aiSidebarOpen: true,
  aiSidebarOpenMobile: false,
  foldersSidebarOpen: false, // Start closed - mobile will use this, desktop ignores it

  toggleAiSidebar: () => set((state) => ({ aiSidebarOpen: !state.aiSidebarOpen })),

  toggleAiSidebarMobile: () => set((state) => ({ aiSidebarOpenMobile: !state.aiSidebarOpenMobile })),

  toggleFoldersSidebar: () => set((state) => ({ foldersSidebarOpen: !state.foldersSidebarOpen })),
}));

export default useSidebarStore;
