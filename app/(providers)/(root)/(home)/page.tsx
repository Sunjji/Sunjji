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

        <div className="rounded-r-3xl bg-whitePoint p-5">
          <HomeCalendar />
        </div>
      </div>
    </Page>
  );
}

export default HomePage;
