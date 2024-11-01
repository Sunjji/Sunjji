"use client";
import { supabase } from "@/supabase/client";
import { useAuthStore } from "@/zustand/auth.store";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { EventDragStopArg } from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import FullCalendar from "@fullcalendar/react";
import dayjs from "dayjs";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import "../_style/Calendar.css";

type FullCalendarEvent = {
  title: string;
  date: string;
  url: string;
};

function HomeCalendar() {
  const router = useRouter();
  const [events, setEvents] = useState<FullCalendarEvent[]>([]);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  useEffect(() => {
    if (!isLoggedIn) return; // 로그인 상태가 아닐 때는 데이터를 불러오지 않음

    (async () => {
      const { data } = await supabase.auth.getUser();
      const authorId = data.user?.id;

      const response = await supabase
        .from("diaries")
        .select()
        .eq("authorId", authorId!);

      const diaries = response.data;

      const events = diaries?.map((diary) => ({
        title: diary.title,
        date: dayjs(diary.createdAt).format("YYYY-MM-DD"),
        url: `/diaries/${diary.id}`,
      }));
      if (!events) return;

      setEvents(events);
    })();
  }, [isLoggedIn]);

  const handleClickCreateDiary = () => {
    router.push(`diaries/write`);
  };
  // 드래그앤드롭 이벤트 핸들러
  const handleDropEvent = async (info: EventDragStopArg) => {
    const newDate = info.event.startStr;
    const splitedUrl = (info.event as any)._def.url.split("/");
    const diaryId = splitedUrl[splitedUrl.length - 1];
    try {
      const { error } = await supabase
        .from("diaries")
        .update({ createdAt: newDate })
        .eq("id", diaryId);

      if (error) {
        throw error;
      }

      console.log("드래그 후 변경된 날짜:", newDate);
    } catch (error) {
      console.error("날짜 업데이트 오류:", error);
    }
  };
  const handleDayCellContent = (arg: any) => {
    const dayNumber = arg.dayNumberText.replace("일", "");
    return dayNumber;
  };

  const handleDayHeaderContent = (arg: any) => {
    // 요일 배열
    const weekdays = ["ㅤ일", "ㅤ월", "ㅤ화", "ㅤ수", "ㅤ목", "ㅤ금", "ㅤ토"];
    // 요일 인덱스를 구하여 반환
    return weekdays[arg.date.getDay()]; // getDay()는 0 (일요일)부터 6 (토요일)까지 반환
  };

  return (
    <>
      <div className="rounded-[8px] bg-whitePoint w-full">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          // height="420px"
          headerToolbar={{
            start: "prev",
            center: "title",
            end: "next",
          }}
          expandRows={true}
          editable={true}
          navLinks={true}
          droppable={true}
          locale={"ko"}
          eventBackgroundColor="#E3F4E5"
          eventTextColor="#2E7D32"
          navLinkDayClick={handleClickCreateDiary}
          events={events}
          eventDrop={handleDropEvent} //드래그앤드롭하면 일기 날짜도 바귐
          dayCellContent={handleDayCellContent} //"일"삭제
          dayHeaderContent={handleDayHeaderContent} //"요일 칸 맞추기용"
        />
      </div>
      {events.length > 0 && (
        <div className=" bg-whitePoint w-full">
          <FullCalendar
            plugins={[listPlugin, interactionPlugin]}
            initialView="listMonth"
            height="220px"
            events={events} // 현재 날짜에 맞는 이벤트만 필터링
            locale={"ko"}
            displayEventTime={false}
            eventBackgroundColor="#E3F4E5"
            headerToolbar={{
              start: "",
              center: "",
              end: "",
            }}
          />
        </div>
      )}
    </>
  );
}

export default HomeCalendar;
