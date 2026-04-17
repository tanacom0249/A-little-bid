import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const useUserStore = create(
  persist(
    (set) => ({
      user: null,
      token: "",

      setUser: (data) => set({ user: data.user, token: data.token }),

      logout: () => set({ token: "", user: null }),
    }),
    {
      name: "userState",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export default useUserStore;
