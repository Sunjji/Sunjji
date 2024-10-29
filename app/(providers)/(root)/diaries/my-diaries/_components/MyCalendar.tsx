"use client";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import { useEffect, useRef } from "react";
import "../_style/Calendar.css";

type FullCalendarEvent = {
  title: string;
  date: string;
  url: string;
};

function MyCalendar() {
  // const router = useRouter();
  // const [events, setEvents] = useState<FullCalendarEvent[]>([]);
  // const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  // useEffect(() => {
  //   if (!isLoggedIn) return; // 로그인 상태가 아닐 때는 데이터를 불러오지 않음

  //   (async () => {
  //     const { data } = await supabase.auth.getUser();
  //     const authorId = data.user?.id;

  //     const response = await supabase
  //       .from("diaries")
  //       .select()
  //       .eq("authorId", authorId);

  //     const diaries = response.data;

  //     const events = diaries?.map((diary) => ({
  //       title: diary.title,
  //       date: dayjs(diary.createdAt).format("YYYY-MM-DD"),
  //       url: `/diaries/${diary.id}`,
  //     }));
  //     if (!events) return;

  //     setEvents(events);
  //   })();
  // }, [isLoggedIn]);

  // const handleClickCreateDiary = (arg) => {
  //   router.push(`diaries/write`);
  // };
  // // 드래그앤드롭 이벤트 핸들러
  // const handleDropEvent = async (info: EventDragStopArg) => {
  //   const newDate = info.event.startStr;
  //   const splitedUrl = info.event._def.url.split("/");
  //   const diaryId = splitedUrl[splitedUrl.length - 1];
  //   const { error } = await supabase
  //     .from("diaries")
  //     .update({ createdAt: newDate })
  //     .eq("id", diaryId);
  // };
  const calendarRef = useRef<FullCalendar>(null);

  function handleClickNext() {
    console.log("Next", calendarRef.current?.getApi().getDate());
    // const calendarApi = calendarRef.current.getApi();
    // calendarApi.next();
  }
  function handleClickPrev() {
    console.log("Prev", calendarRef.current?.getApi().getDate());

    // const calendarApi = calendarRef.current.getApi();
    // calendarApi.prev();
    // console.log();
  }

  useEffect(() => {
    window.document
      .querySelector("[title='Previous month']")
      ?.addEventListener("click", handleClickPrev);
    window.document
      .querySelector("[title='Next month']")
      ?.addEventListener("click", handleClickNext);
  }, []);

  return (
    <>
      <div className="bg-whitePoint w-full">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          ref={calendarRef}
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
        {/* <button onClick={goPrev}>Go Prev!</button>
        <button onClick={goNext}>Go Next!</button> */}
      </div>
    </>
  );
}

export default MyCalendar;
