"use client";

import { supabase } from "@/supabase/client";
import { KakaoIdentityData, kakaoInfo } from "@/types/type";
import { useAuthStore } from "@/zustand/auth.store";
import { PropsWithChildren, useEffect } from "react";

function AuthProvider({ children }: PropsWithChildren) {
  const logIn = useAuthStore((state) => state.logIn);
  const logOut = useAuthStore((state) => state.logOut);
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  const currentUserId = useAuthStore((state) => state.currentUserId);
  const setCurrentUserId = useAuthStore((state) => state.setCurrentUserId);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || null); // 로그인된 사용자가 있으면 ID 저장
    };

    fetchUser();

    const initializeKakaoLogInUserProfile = async (
      userId: string,
      kakaoInfo: kakaoInfo
    ) => {
      const { nickname, imageUrl } = kakaoInfo;

      await supabase
        .from("profiles")
        .upsert(
          { id: userId, nickname, imageUrl },
          { ignoreDuplicates: false }
        );
    };

    supabase.auth.onAuthStateChange((event, session) => {
      console.log("session?.user", session?.user);

      if (session?.user) {
        setCurrentUserId(session.user.id);
        logIn();

        if (
          session.user.identities?.find(
            (identity) => identity.provider === "kakao"
          )
        ) {
          const kakaoIdentityData = session.user.identities?.find(
            (identity) => identity.provider === "kakao"
          )?.identity_data as KakaoIdentityData;

          if (kakaoIdentityData) {
            const profileData = {
              nickname: kakaoIdentityData.user_name,
              imageUrl: kakaoIdentityData.avatar_url,
            };
            initializeKakaoLogInUserProfile(session.user.id, profileData);
          }
        }
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
