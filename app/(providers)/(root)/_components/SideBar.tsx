"use client";
import LogInModal from "@/components/LoginModal";
//임시헤더
import { supabase } from "@/supabase/client";
import { useAuthStore } from "@/zustand/auth.store";
import { useModalStore } from "@/zustand/modal.store";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bounce, toast } from "react-toastify";

dayjs.locale("ko");

function SideBar() {
  const succesToast = {
    position: "top-right",
    closeButton: false,
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
    transition: Bounce,
    style: {
      backgroundColor: "#E3F4E5",
      color: "#2E7D32",
      fontFamily: "MongxYamiyomiL",
    },
  };
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const setIsLoggedIn = useAuthStore((state) => state.setIsLoggedIn);
  const isAuthInitialized = useAuthStore((state) => state.isAuthInitialized);
  const openModal = useModalStore((state) => state.openModal);
  const router = useRouter();

  // 로그인 모달 띄워주는 함수
  const handleClickLogInButton = async () => {
    openModal(<LogInModal />);
  };

  const handleClickMyProfile = async () => {
    const { data: diaries } = await supabase
      .from("diaries")
      .select("*, author:profiles (*), comments(id)");
  };

  const baseURL =
    "https://kudrchaizgkzyjzrkhhy.supabase.co/storage/v1/object/public/";

  const handleClickLogOut = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    toast("💚 로그아웃 되었습니다", succesToast); //슈파베이스 로그아웃
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
                <Link className="block mb-5" href={"/diaries/my-diaries"}>
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
