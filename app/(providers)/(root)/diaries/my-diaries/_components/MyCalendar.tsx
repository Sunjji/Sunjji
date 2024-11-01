"use client";
import api from "@/api/api";
import { useAuthStore } from "@/zustand/auth.store";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import DiaryBox from "../../_components/DiaryBox";

function MyCalendar() {
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
    <>
      <div className="bg-whitePoint w-full">
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

        {myDiaries?.map((diary) => (
          <DiaryBox key={diary.id} diary={diary} />
        ))}
      </div>
    </>
  );
}

export default MyCalendar;
