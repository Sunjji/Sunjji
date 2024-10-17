"use client";

import { supabase } from "@/supabase/client";
import { useAuthStore } from "@/zustand/auth.store";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

type FullCalendarEvent = {
  title: string;
  date: string;
  url: string;
};

function HomePage() {
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
        .eq("authorId", authorId);

      const diaries = response.data;

      const events = diaries?.map((diary) => ({
        title: diary.title,
        date: dayjs(diary.createdAt).format("YYYY-MM-DD"),
        url: `/diaries/${diary.id}/detail`,
      }));
      if (!events) return;

      setEvents(events);
    })();
  }, [isLoggedIn]);

  // // 드래그앤드롭 이벤트 핸들러
  // const handleDropEvent = async (info: EventDragStopArg) => {
  //   // 드래그 후 변경된 날짜를 YYYY-MM-DD 형식으로 가져오기
  //   const newDate = dayjs(info.event..end).format("YYYY-MM-DD");

  //   try {
  //     const { data, error } = await supabase
  //       .from("diaries")
  //       .update({ createdAt: `${newDate}T00:00:00Z` }) // 시간을 00:00:00으로 고정해서 저장
  //       .eq("id", info.event.id); // event.id로 해당 일기 업데이트

  //     if (error) {
  //       throw error;
  //     }

  //     console.log("드래그 후 변경된 날짜:", newDate);
  //   } catch (error) {
  //     console.error("날짜 업데이트 오류:", error);
  //   }
  // };

  const handleDropEvent = (info) => {
    console.log(info.event); // 전체 이벤트 객체를 콘솔에 출력

    // 추가로 이벤트 속성을 개별적으로 보고 싶다면:
    console.log("Event Title:", info.event.title); // 이벤트 제목
    console.log("Event Start:", info.event.start); // 시작 시간
    console.log("Event End:", info.event.end); // 종료 시간
  };

  return (
    <>
      <div className="mt-[30px] ml-[50px] rounded-[8px] border bg-point absolute z-0 w-[600px] h-[400px]">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          height="400px"
          headerToolbar={{
            start: "prev",
            center: "title",
            end: "next",
          }}
          editable={true}
          droppable={true}
          locale={"ko"}
          eventBackgroundColor="pink"
          eventBorderColor="pink"
          events={events}
          // 로그인 상태일 때만 드롭 이벤트 핸들러를 활성화
          eventDrop={isLoggedIn ? handleDropEvent : undefined}
        />
      </div>
    </>
  );
}

export default HomePage;
