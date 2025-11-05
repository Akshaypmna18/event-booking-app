import { create } from "zustand";

interface AppState {
  btnText: string;
}

export const useStore = create<AppState>(() => ({
  btnText: "Click me",
}));
