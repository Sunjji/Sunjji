"use client";

import api from "@/api/api";
import Page from "@/app/(providers)/(root)/_components/Page/Page";
import { useAuthStore } from "@/zustand/auth.store";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import DiariesWriteButton from "../_components/DiariesWriteButton";
import DiaryBox from "../_components/DiaryBox";
import "./_style/Calendar.css";

function PublicPage() {
  const calendarRef = useRef<FullCalendar>(null);
  const [month, setMonth] = useState<number | null>(null); //달
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const profile = useAuthStore((state) => state.profile);

  const { data: myDiaries } = useQuery({
    queryKey: ["myDiaries", { month }],
    queryFn: () => api.diaries.getMyDiariesOnMonth(month!),
    enabled: !!isLoggedIn && !!profile && !!month,
  });

  const handleClickNext = () => {
    const currentMonth = dayjs(calendarRef.current?.getApi().getDate()).month();
    console.log(currentMonth);
    setMonth(currentMonth);
  };
  const handleClickPrev = () => {
    const currentMonth = dayjs(calendarRef.current?.getApi().getDate()).month();

    console.log(currentMonth);
    setMonth(currentMonth);
  };

  useEffect(() => {
    const currentMonth = dayjs(calendarRef.current?.getApi().getDate()).month();
    setMonth(currentMonth);
  }, []);

  useEffect(() => {
    const prevButton = document.querySelector<HTMLButtonElement>(
      "[title='Previous month']"
    );
    const nextButton = document.querySelector<HTMLButtonElement>(
      "[title='Next month']"
    );

    if (!prevButton || !nextButton) return;

    prevButton.addEventListener("click", handleClickPrev);
    nextButton.addEventListener("click", handleClickNext);
  }, []);

  return (
    <Page title="모두의 집사 일기">
      {/* 일기쓰기 버튼 */}
      <div className="absolute top-20 right-[84px]">
        <DiariesWriteButton />
      </div>

      {/* 클릭하면 일기 상세페이지로 들어감 */}
      <div className="bg-whitePoint p-5 rounded-2xl overflow-y-hidden grow flex flex-col">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          height="auto"
          headerToolbar={{
            start: "prev",
            center: "title",
            end: "next",
          }}
          titleFormat={{ month: "long" }}
          locale={"ko"}
          contentHeight={0}
        />
        <div className="grid lg:grid-cols-3 md:grid-cols-1 gap-10 overflow-scroll">
          {myDiaries?.map((diary) => (
            <DiaryBox key={diary.id} diary={diary} />
          ))}
        </div>
      </div>
    </Page>
  );
}

export default PublicPage;
