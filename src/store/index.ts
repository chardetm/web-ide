import { create } from "zustand";

type AppState = {
  previewIframeUrl: string;
  setPreviewIframeUrl: (url: string) => void;

  codeZoomLevel: number;
  increaseCodeZoomLevel: () => void;
  decreaseCodeZoomLevel: () => void;
};

export const useAppStore = create<AppState>()((set) => ({
  previewIframeUrl: "",
  setPreviewIframeUrl: (url) => set({ previewIframeUrl: url }),
  codeZoomLevel: 10,
  increaseCodeZoomLevel: () =>
    set((state) => ({ codeZoomLevel: Math.min(state.codeZoomLevel + 1, 20) })),
  decreaseCodeZoomLevel: () =>
    set((state) => ({ codeZoomLevel: Math.max(2, state.codeZoomLevel - 1) })),
}));  
