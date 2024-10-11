"use client";
//임시헤더
import { supabase } from "@/supabase/client";
import { useAuthStore } from "@/zustand/auth.store";
import Link from "next/link";
import React, { useEffect } from "react";

function Header() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const setIsLoggedIn = useAuthStore((state) => state.setIsLoggedIn);
  const isAuthInitialized = useAuthStore((state) => state.isAuthInitialized);
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);
  //isAuthInitialized를 useEffect를 사용해서 true로 바꿔주는 코드

  const handleClickLogOut = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    alert("로그아웃 성공");
  };

  console.log(isAuthInitialized);

  return (
    <header>
      {isAuthInitialized ? (
        <div>
          {isLoggedIn ? (
            <>
              <button onClick={handleClickLogOut}>로그아웃</button>
            </>
          ) : (
            <div>
              <button>
                <Link href={"/log-in"} className="font-bold text-2xl pb-3 pt-3">
                  로그인
                </Link>
              </button>
              <button>
                <Link
                  href={"/sign-up"}
                  className="font-bold text-2xl pb-3 pt-3"
                >
                  회원가입
                </Link>
              </button>
            </div>
          )}
        </div>
      ) : null}
    </header>
  );
}

export default Header;
