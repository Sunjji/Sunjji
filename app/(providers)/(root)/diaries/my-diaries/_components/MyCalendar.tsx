"use client";
import { supabase } from "@/supabase/client";
import { useAuthStore } from "@/zustand/auth.store";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import dayjs from "dayjs";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import DiariesProfile from "../../_components/DiariesProfile";
import "../_style/Calendar.css";

function MyCalendar() {
  const IMAGE_BASE_URL =
    "https://kudrchaizgkzyjzrkhhy.supabase.co/storage/v1/object/public/";

  // const router = useRouter();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const [month, setMonth] = useState(null); //달
  const [myDiarys, setMyDiarys] = useState<
    { id: string; title: string; content: string }[] | null
  >(null); // 다이어리 상태
  useEffect(() => {
    if (!isLoggedIn) return; // 로그인 상태가 아닐 때는 데이터를 불러오지 않음

    (async () => {
      const { data } = await supabase.auth.getUser();
      const authorId = data.user?.id;
      const calendarRef = useRef<FullCalendar>(null);
      const [diaryData, setDiaryDate] = useState<
        { id: string; title: string; content: string }[] | null
      >(null); //다이어리

      const handleClickNext = () => {
        const currentMonth =
          dayjs(calendarRef.current?.getApi().getDate()).month() + 1;
        console.log(currentMonth);
        setMonth(currentMonth);
      };
      const handleClickPrev = () => {
        const currentMonth =
          dayjs(calendarRef.current?.getApi().getDate()).month() + 1;
        console.log(currentMonth);
        setMonth(currentMonth);
      };

      const currentMonth =
        dayjs(calendarRef.current?.getApi().getDate()).month() + 1;
      console.log(currentMonth);
      setMonth(currentMonth);

      const myDiarys = await supabase
        .from("diaries")
        .select("*")
        .eq("authorId", authorId)
        .like("created_at", `%-${currentMonth}-%`);

      setMyDiarys(myDiarys);
    })();
  }, [isLoggedIn, month]);

  return (
    <>
      <div className="bg-whitePoint w-full">
        <FullCalendar
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

        {myDiarys?.map((diary) => (
          <Link className="text-BrownPoint" href={`/diaries/${diary.id}`}>
            <div className="relative group rounded-[8px] bg-whitePoint hover:border-BrownPoint transition border pb-4">
              <div className="flex items-center py-2">
                <DiariesProfile diary={diary} />
              </div>
              {/* 이미지를 비율에 맞춰서 표시 */}
              <div className="aspect-w-4 aspect-h-3 w-full">
                <img
                  className="object-cover w-full h-full"
                  src={`${IMAGE_BASE_URL}/${diary.imageUrl}`}
                  alt="일기 사진"
                />
              </div>
              {/* 좋아요 댓글 버튼 */}
              <div className=" flex gap-2 pt-3 z-0 relative px-4">
                <HeartButton diaryId={diary.id} />
                <CommentButton commentsCount={diary.comments.length} />
              </div>

              <div className="grow flex justify-between items-center px-4">
                <div className="mt-[10px] mb-1 font-semibold">
                  <p>{diary.title}</p>
                </div>
                <div className=" text-sm font-bold pr-2">
                  {dayjs(diary.createdAt).format("YYYY.MM.DD A hh:mm")}
                </div>
              </div>

              <div className="mt-2 px-4">
                {/* 18글자까지만 보여주고, 글자가 길면 "..." 표시 */}
                <p>
                  {diary.content.length > 18
                    ? diary.content.slice(0, 18) + "..."
                    : diary.content}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}

export default MyCalendar;
