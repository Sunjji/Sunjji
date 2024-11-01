/* eslint-disable @next/next/no-img-element */
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
import {
  FaBookOpen,
  FaSignInAlt,
  FaSignOutAlt,
  FaUserPlus,
} from "react-icons/fa";
import { FaBookBookmark, FaHouse } from "react-icons/fa6";
import { IoMdSettings } from "react-icons/io";
import { toast } from "react-toastify";
import { getToastOptions } from "./getToastOptions";
import UserProfile from "./UserProfile";

dayjs.locale("ko");

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

  // const handleClickMyProfile = async () => {
  //   const { data: diaries } = await supabase
  //     .from("diaries")
  //     .select("*, author:profiles (*), comments(id)");
  // };

  const handleClickLogOut = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    toast("💚 로그아웃 되었습니다", getToastOptions("success")); //슈파베이스 로그아웃
    router.push("/");
  };

  return (
    <nav className="p-5 pr-0 w-[200px] min-h-screen fixed z-10">
      <Link href={"/"}>
        <img
          className="w-[250px] mb-5"
          src="http://localhost:3000/assets/img/logo.png"
          alt="logo"
        />
      </Link>
      <Link href={"/my-page"} className="font-bold text-2xl">
        {isLoggedIn ? <UserProfile /> : null}
      </Link>
      <br />

      {isAuthInitialized ? ( // isAuthInitialized가 true일때 출력(삼항연산자)
        <div className="text-BrownPoint font-bold">
          <Link className="flex gap-x-3 items-center mb-5" href={"/"}>
            <FaHouse /> 홈
          </Link>
          {isLoggedIn ? ( // isLoggedIn이 true일때 출력
            <>
              <Link
                className="flex gap-x-3 items-center mb-5"
                href={"/diaries"}
              >
                <FaBookOpen /> 모두의 일기
              </Link>
              <Link
                className="flex gap-x-3 items-center mb-5"
                href={"/diaries/my-diaries"}
              >
                <FaBookBookmark /> 내 일기
              </Link>

              <Link
                className="flex gap-x-3 items-center mb-5"
                href={"/my-page"}
              >
                <IoMdSettings /> 설정하기
              </Link>

              <button
                className="flex gap-x-3 items-center"
                onClick={handleClickLogOut}
              >
                <FaSignOutAlt /> 로그아웃
              </button>
            </>
          ) : (
            // isLoggedIn이 false일때 출력
            <div className="font-bold">
              <Link
                className="flex gap-x-3 items-center pb-3"
                href={"/diaries"}
              >
                <FaBookOpen /> 모두의 일기
              </Link>
              <button
                onClick={handleClickLogInButton}
                className="flex gap-x-3 items-center pb-3 pt-3"
              >
                <FaSignInAlt /> 로그인
              </button>
              <button>
                <Link
                  href={"/sign-up"}
                  className="flex gap-x-3 items-center pb-3 pt-3"
                >
                  <FaUserPlus /> 회원가입
                </Link>
              </button>
            </div>
          )}
        </div>
      ) : null}
    </nav>
  );
}

export default SideBar;
