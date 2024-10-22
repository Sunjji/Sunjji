"use client";
import LogInModal from "@/components/LoginModal";
//임시헤더
import { supabase } from "@/supabase/client";
import { useAuthStore } from "@/zustand/auth.store";
import { useModalStore } from "@/zustand/modal.store";
import Link from "next/link";
import { useRouter } from "next/navigation";

function SideBar() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const setIsLoggedIn = useAuthStore((state) => state.setIsLoggedIn);
  const isAuthInitialized = useAuthStore((state) => state.isAuthInitialized);
  const openModal = useModalStore((state) => state.openModal);
  const router = useRouter();

  // 로그인 모달 띄워주는 함수
  const handleClickLogInButton = async () => {
    openModal(<LogInModal />);
  };

  const handleClickLogOut = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    alert("로그아웃 성공"); //슈파베이스 로그아웃
    router.push("/");
  };

  return (
    <>
      <nav className="ml-5 w-[150px] min-h-screen fixed z-10">
        <img
          className="w-[250px] mb-5"
          src="http://localhost:3000/assets/img/logo.png"
          alt="logo"
        />
        <Link href={"/my-page"} className="font-bold text-2xl">
          프로필(대충 해놓은거임)
        </Link>
        <br />
        <Link href={"/"} className="block mt-5 mb-5 font-bold text-2xl">
          홈
        </Link>
        {isAuthInitialized ? ( // isAuthInitialized가 true일때 출력(삼항연산자)
          <div>
            {isLoggedIn ? ( // isLoggedIn이 true일때 출력
              <>
                <Link className="block text-sm mb-5" href={"/my-page"}>
                  마이페이지
                </Link>
                <Link className="block mb-5" href={"/diaries"}>
                  공개일기
                </Link>
                <Link className="block mb-5" href={"/views/userView"}>
                  내 일기
                </Link>
                <button onClick={handleClickLogOut}>로그아웃</button>
              </>
            ) : (
              // isLoggedIn이 false일때 출력
              <div>
                <Link className="font-bold text-2xl mb-5" href={"/diaries"}>
                  공개일기
                </Link>
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
      <div className="w-[75px]" />
    </>
  );
}

export default SideBar;
