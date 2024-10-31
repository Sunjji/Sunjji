/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import api from "@/api/api";
import { supabase } from "@/supabase/client";
import { KakaoIdentityData } from "@/types/type";
import { useAuthStore } from "@/zustand/auth.store";
import { useQuery } from "@tanstack/react-query";
import { PropsWithChildren, useEffect } from "react";

function AuthProvider({ children }: PropsWithChildren) {
  const logIn = useAuthStore((state) => state.logIn);
  const logOut = useAuthStore((state) => state.logOut);
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  const setCurrentUserId = useAuthStore((state) => state.setCurrentUserId);
  const currentUserId = useAuthStore((state) => state.currentUserId);
  const setProfile = useAuthStore((state) => state.setProfile);
  console.log("currentUserId", currentUserId);
  const { data: myProfile } = useQuery({
    queryKey: ["myProfile"],
    queryFn: api.profiles.getMyProfile,
    enabled: !!currentUserId,
  });

  useEffect(() => {
    setProfile(myProfile || null);
  }, [myProfile]);

  useEffect(() => {
    supabase.auth.onAuthStateChange((_event, session) => {
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
            initializeKakaoLogInUserProfile(session.user.id, kakaoIdentityData);
          }
        }
      } else {
        logOut();
        setCurrentUserId(null);
      }

      initializeAuth();
    });
  }, []);

  return children;
}
async function initializeKakaoLogInUserProfile(
  userId: string,
  kakaoInfo: KakaoIdentityData
) {
  const { avatar_url: imageUrl, user_name: nickname } = kakaoInfo;
  const { data: profile } = await supabase
    .from("profiles")
    .select("customImage, imageUrl") //
    .eq("id", userId)
    .single();

  if (!profile?.customImage) {
    await supabase
      .from("profiles")
      .upsert({ id: userId, nickname, imageUrl }, { ignoreDuplicates: false });
  }
}

export default AuthProvider;
