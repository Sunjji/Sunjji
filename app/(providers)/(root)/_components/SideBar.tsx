"use client";
import LogInModal from "@/components/LoginModal";
//임시헤더
import { supabase } from "@/supabase/client";
import { useAuthStore } from "@/zustand/auth.store";
import { useModalStore } from "@/zustand/modal.store";
import Link from "next/link";
import { useEffect } from "react";

function SideBar() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const setIsLoggedIn = useAuthStore((state) => state.setIsLoggedIn);
  const isAuthInitialized = useAuthStore((state) => state.isAuthInitialized);
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  const openModal = useModalStore((state) => state.openModal);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);
  //isAuthInitialized를 useEffect를 사용해서 true로 바꿔주는 코드

  // 로그인 모달 띄워주는 함수
  const handleClickLogInButton = async () => {
    openModal(<LogInModal />);
  };

  const handleClickLogOut = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    alert("로그아웃 성공"); //슈파베이스 로그아웃
  };

  return (
    <nav className="bg-point w-[70px] min-h-screen">
      <Link href={"/"} className="font-bold text-2xl">
        홈
      </Link>
      {isAuthInitialized ? ( // isAuthInitialized가 true일때 출력(삼항연산자)
        <div>
          {isLoggedIn ? ( // isLoggedIn이 true일때 출력
            <>
              <Link href={"/my-page"}>마이 페이지</Link>
              <button onClick={handleClickLogOut}>로그아웃</button>
            </>
          ) : (
            // isLoggedIn이 false일때 출력
            <div>
              <button
                onClick={handleClickLogInButton}
                className="font-bold text-2xl pb-3 pt-3"
              >
                로그인
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
    </nav>
  );
}

export default SideBar;
