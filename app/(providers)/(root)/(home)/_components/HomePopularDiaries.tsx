/* eslint-disable @next/next/no-img-element */
import api from "@/api/api";
import { useQuery } from "@tanstack/react-query";
import DiaryBox from "../../diaries/_components/DiaryBox";

function HomePopularDiaries() {
  const { data: popularDiaries = [] } = useQuery({
    queryKey: ["diaries", { type: "popular" }],
    queryFn: api.diaries.getPopularDiaries,
  });

  return (
    <section className="rounded-2xl bg-whitePoint p-5 h-full flex flex-col justify-between max-h-full overflow-hidden">
      <h6 className="mb-4 text-2xl font-bold text-[#A1776280]">
        이달의 인기 일기
      </h6>
      <ul className="overflow-scroll grow max-h-full flex flex-col gap-y-5">
        {popularDiaries.map((diary) => (
          <li key={diary.id}>
            <DiaryBox diary={diary} key={diary.id} />
          </li>
        ))}
      </ul>
    </section>
  );
}

export default HomePopularDiaries;
