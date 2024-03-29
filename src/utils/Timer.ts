import { create } from "zustand";

interface CountDownType {
  startingTime: number;
  remainingTime: number;
  countdown: () => void;
  setStarting: (data: any) => void;
}

export const usePostCountDown = create<CountDownType>((set, get) => ({
  startingTime: 0,
  remainingTime: 0,
  countdown: () => {
    const RemainingTime = () => {
      const { startingTime } = get();
      if (startingTime && startingTime > 0) {
        const currentTime = new Date().getTime();
        const remaining = Math.max(
          0,
          Math.floor((startingTime + 1 * 60 * 60 * 1000 - currentTime) / 1000),
        );

        if (remaining === 0) {
          set(() => ({ startingTime: 0, remainingTime: 0 }));
        } else {
          set((state: any) => ({ ...state, remainingTime: remaining }));
        }
      } else {
        clearInterval(interval);
        set(() => ({ remainingTime: 0 }));
      }
    };

    RemainingTime();

    const interval = setInterval(RemainingTime, 1000);

    return () => clearInterval(interval);
  },

  setStarting: (data) => {
    return set(() => ({ startingTime: data ? data : 0 }));
  },
}));

export const useEditCountDown = create<CountDownType>((set, get) => ({
  startingTime: 0,
  remainingTime: 0,
  countdown: () => {
    const RemainingTime = () => {
      const { startingTime } = get();
      if (startingTime && startingTime > 0) {
        const currentTime = new Date().getTime();
        const remaining = Math.max(
          0,
          Math.floor((startingTime + 3 * 60 * 60 * 1000 - currentTime) / 1000),
        );

        if (remaining === 0) {
          set(() => ({ startingTime: 0, remainingTime: 0 }));
        } else {
          set((state: any) => ({ ...state, remainingTime: remaining }));
        }
      } else {
        clearInterval(interval);
        set(() => ({ remainingTime: 0 }));
      }
    };

    RemainingTime();

    const interval = setInterval(RemainingTime, 1000);

    return () => clearInterval(interval);
  },

  setStarting: (data) => {
    return set(() => ({ startingTime: data ? data : 0 }));
  },
}));

export const useDeleteCountDown = create<CountDownType>((set, get) => ({
  startingTime: 0,
  remainingTime: 0,
  countdown: () => {
    const interval = setInterval(() => {
      const { startingTime } = get();
      if (startingTime && startingTime > 0) {
        const currentTime = new Date().getTime();
        const remaining = Math.max(
          0,
          Math.floor((startingTime + 8 * 60 * 60 * 1000 - currentTime) / 1000),
        );
        if (remaining === 0) {
          clearInterval(interval);
          set(() => ({ startingTime: 0, remainingTime: 0 }));
        } else {
          set((state: any) => ({ ...state, remainingTime: remaining }));
        }
      } else {
        clearInterval(interval);
        set(() => ({ remainingTime: 0 }));
      }
    }, 1000);

    return () => clearInterval(interval);
  },

  setStarting: (data) => {
    return set(() => ({ startingTime: data ? data : 0 }));
  },
}));

export const useBanCountDown = create<CountDownType>((set, get) => ({
  startingTime: 0,
  remainingTime: 0,
  countdown: () => {
    const interval = setInterval(() => {
      const { startingTime } = get();
      if (startingTime && startingTime > 0) {
        const currentTime = new Date().getTime();
        const remaining = Math.max(0, (startingTime - currentTime) / 1000);
        if (remaining === 0) {
          clearInterval(interval);
          set(() => ({ startingTime: 0, remainingTime: 0 }));
        } else {
          set((state: any) => ({ ...state, remainingTime: remaining }));
        }
      } else {
        clearInterval(interval);
        set(() => ({ remainingTime: 0 }));
      }
    }, 100); // interval in milliseconds

    return () => clearInterval(interval);
  },

  setStarting: (data) => {
    return set(() => ({ startingTime: data ? data : 0 }));
  },
}));
