"use client";

import { supabase } from "@/supabase/client";
import { Tables } from "@/supabase/database.types";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import HeartButton from "../_components/HeartButton";
import CommentsPage from "./comments/page";

const baseURL =
  "https://kudrchaizgkzyjzrkhhy.supabase.co/storage/v1/object/public/";

function DiaryDetailPage() {
  const params = useParams();
  const [diaryData, setDiaryData] = useState<Tables<"diaries">>();
  const [profileData, setProfileData] = useState<Tables<"profiles">[]>();
  const [isUser, setIsUser] = useState(false);
  const router = useRouter();

  const { diaryId } = params;

  useEffect(() => {
    (async () => {
      const { data: diaries, error } = await supabase
        .from("diaries")
        .select("*")
        .eq("id", Number(diaryId))
        .single();

      const profiles = await supabase.from("profiles").select("*");

      const profilesData = profiles.data;

      if (error) {
        return console.log("error", error);
      } else {
        const profiles = profilesData?.find(
          (data) => data.id === diaries.authorId
        );
        console.log(profiles);
        setDiaryData(diaries);
        setProfileData([profiles!]);
      }

      const userResponse = await supabase.auth.getUser();
      const data = userResponse.data.user;
      const userId = data?.id;

      if (diaries.authorId === userId) return setIsUser(true);
    })();
  }, [diaryId]);

  const handleClickDeleteButton = async () => {
    const response = await supabase
      .from("diaries")
      .select("*")
      .eq("id", Number(diaryId))
      .single();
    console.log(response);

    const data = await supabase
      .from("diaries")
      .delete()
      .eq("id", Number(diaryId));

    if (!data) {
      console.log("error");
    } else {
      alert("삭제되었습니다");
      router.push("/diaries");
    }
  };

  if (!diaryData || !profileData) {
    return <p className="p-5">로딩 중...</p>;
  }

  return (
    <div className="p-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-y-2">
          <h2 className="text-lg font-bold">{diaryData.title}</h2>
          {profileData.map((profiles) => (
            <p key={profiles.id}>글쓴이: {profiles.nickname}</p>
          ))}
          <img className="w-32" src={`${baseURL}${diaryData.imageUrl}`} />
          <p className="text-sm">{diaryData.content}</p>

          <HeartButton diaryId={diaryData.id.toString()} />

          {isUser && (
            <div className="mt-10 flex flex-col lg:flex-row gap-2">
              <Link
                className="border rounded-lg w-72 text-center py-2 hover:brightness-90 active:brightness-50"
                href={`/diaries/${diaryData.id}/edit`}
              >
                편집하기
              </Link>

              <button
                className="border rounded-lg w-72 text-center py-2 hover:border-gray-400 active:brightness-50"
                onClick={handleClickDeleteButton}
              >
                삭제하기
              </button>
            </div>
          )}
        </div>

        <div className="flex md:justify-end sm:justify-start sm:pt-5">
          <CommentsPage />
        </div>
      </div>
    </div>
  );
}

export default DiaryDetailPage;
