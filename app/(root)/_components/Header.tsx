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
    alert("로그아웃 성공"); //슈파베이스 로그아웃
  };

  console.log(isAuthInitialized);

  return (
    <header>
      {isAuthInitialized ? ( // isAuthInitialized가 true일때 출력(삼항연산자)
        <div>
          {isLoggedIn ? ( // isLoggedIn이 true일때 출력
            <>
              <button onClick={handleClickLogOut}>로그아웃</button>
            </>
          ) : (
            // isLoggedIn이 false일때 출력
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
      {/* isAuthInitialized가 false일때 null을 출력 */}
    </header>
  );
}

export default Header;
