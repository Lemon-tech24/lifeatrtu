"use client";
import { useTimerStoreType } from "@/types/useTimeStoreType";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useTimeStore = create<useTimerStoreType>()(
  persist(
    (set, get) => ({
      time: 90,
      trigger: false,
      decrease: () => {
        if (get().time <= 0) return set(() => ({ time: 90, trigger: false }));

        return set(() => ({ time: get().time - 1, trigger: true }));
      },
    }),
    { name: "ATimer" }
  )
);
