"use client";

import { supabase } from "@/supabase/client";
import { useAuthStore } from "@/zustand/auth.store";
import { PropsWithChildren, useEffect } from "react";

function AuthProvider({ children }: PropsWithChildren) {
  const logIn = useAuthStore((state) => state.logIn);
  const logOut = useAuthStore((state) => state.logOut);
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  const setCurrentUserId = useAuthStore((state) => state.setCurrentUserId);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || null); // 로그인된 사용자가 있으면 ID 저장
    };

    fetchUser();

    supabase.auth.onAuthStateChange((event, session) => {
      console.log("session?.user", session?.user);
      if (session?.user) {
        setCurrentUserId(session.user.id);
        logIn();
      } else {
        logOut();
        setCurrentUserId(null);
      }

      initializeAuth();
    });
  }, [setCurrentUserId]);

  return children;
}

export default AuthProvider;
