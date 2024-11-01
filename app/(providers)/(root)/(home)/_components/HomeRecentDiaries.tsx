"use client";
import api from "@/api/api";
import { useQuery } from "@tanstack/react-query";
import DiaryBox from "../../diaries/_components/DiaryBox";

function HomeRecentDiaries() {
  const { data: diaries = [] } = useQuery({
    queryKey: ["recentDiaries"],
    queryFn: api.diaries.getRecentDiaries,
  });

  if (diaries === null) return null;

  return (
    <section className="rounded-2xl bg-whitePoint p-5 h-full flex flex-col justify-between max-h-full overflow-hidden">
      <h6 className="mb-4 text-2xl font-bold text-[#A1776280]">
        현재 뜨고 있는 최신 일기
      </h6>
      <ul className="overflow-scroll grow max-h-full flex flex-col gap-y-5">
        {diaries.map((diary) => (
          <li key={diary.id}>
            <DiaryBox diary={diary} key={diary.id} />
          </li>
        ))}
      </ul>
    </section>
  );
}

export default HomeRecentDiaries;
