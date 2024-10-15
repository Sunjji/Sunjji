import { supabase } from "@/supabase/client";
import Link from "next/link";
import { useEffect, useState } from "react";

type DiariesType = {
  params: {
    diaryId: string;
  };

  id: number;
  title: string;
  content: string;
  imageUrl: string;
  isPublic: boolean;
};

function DiariesCardPage() {
  const [diaries, setDiaries] = useState<DiariesType[]>([]);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.from("diaries").select("*");
      if (error) {
        console.error("error", error);
      } else {
        setDiaries(data);
        console.log(data);
      }
    })();
  }, []);

  return (
    <div>
      <ul>
        {diaries
          .filter((diary) => diary.isPublic)
          .map((diary) => (
            <li key={diary.id}>
              <Link
                className="flex gap-x-3"
                href={`/diaries/${diary.id}/detail`}
              >
                <p>{diary.id}</p>
                <h2>제목: {diary.title}</h2>
              </Link>
            </li>
          ))}

        {diaries
          .filter((diary) => !diary.isPublic)
          .map((diary) => (
            <li className="text-red-500" key={diary.id}>
              <Link
                className="flex gap-x-3"
                href={`/diaries/${diary.id}/detail`}
              >
                <p>{diary.id}</p>
                <h2>제목: {diary.title}</h2>
              </Link>
            </li>
          ))}
      </ul>
    </div>
  );
}

export default DiariesCardPage;
