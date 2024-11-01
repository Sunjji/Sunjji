"use client";

import Page from "@/app/(providers)/(root)/_components/Page/Page";
import { useAuthStore } from "@/zustand/auth.store";
import dayjs from "dayjs";
import HomeCalendar from "./_components/HomeCalendar";
import HomeMyPets from "./_components/HomeMyPets";
import HomePopularDiaries from "./_components/HomePopularDiaries";
import HomeRecentDiaries from "./_components/HomeRecentDiaries";

function HomePage() {
  const title = dayjs().format("DD dddd");
  const isAuthInitialized = useAuthStore((state) => state.isAuthInitialized);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  return (
    <Page title={title}>
      {/* 메인 컨텐츠 */}
      <div className="w-full grid grid-cols-3 gap-x-10 grow overflow-hidden">
        <HomePopularDiaries />
        {isAuthInitialized ? (
          isLoggedIn ? (
            <HomeMyPets />
          ) : (
            <HomeRecentDiaries />
          )
        ) : (
          <div></div>
        )}
      </div>

      {/* 오른쪽 끝에 위치할 HomeCalendar */}
      <div className="absolute top-0 right-0 mt-10 mr-10 w-[350px] h-[calc(100%-80px)] rounded-tr-3xl rounded-r-3xl bg-whitePoint">
        <HomeCalendar />
      </div>
    </Page>
  );
}

export default HomePage;
