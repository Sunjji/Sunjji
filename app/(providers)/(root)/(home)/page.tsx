"use client";

import { supabase } from "@/supabase/client";
import { useAuthStore } from "@/zustand/auth.store";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

function HomePage() {
  const [events, setEvents] = useState([]);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  useEffect(() => {
    if (!isLoggedIn) return;

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

      setEvents(events);

      console.log("response", response);
    })();
  }, [isLoggedIn]);

  return (
    <>
      <div className="mt-[30px] ml-[50px] rounded-[8px] w-full  border bg-point absolute z-0">
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
        />
      </div>
    </>
  );
}

export default HomePage;
