"use client";

import { supabase } from "@/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import HeartButton from "../_components/HeartButton";
import CommentsPage from "./comments/page";

type DiaryDetailPageProps = {
  params: {
    diaryId: string;
  };
};

const baseURL =
  "https://kudrchaizgkzyjzrkhhy.supabase.co/storage/v1/object/public/";

function DiaryDetailPage(props: DiaryDetailPageProps) {
  const [diaryData, setDiaryData] = useState<any>(null);
  const [profileData, setProfileData] = useState<any>(null);
  const [isUser, setIsUser] = useState(false);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const diariesResponse = await supabase
        .from("diaries")
        .select("*")
        .eq("id", Number(props.params.diaryId))
        .single();

      const profilesResponse = await supabase.from("profiles").select("*");
      const profilesData = profilesResponse.data;

      const profilesNicknameData = profilesData?.find(
        (data) => data.id === diariesResponse.data.authorId
      );

      setDiaryData(diariesResponse.data);
      setProfileData(profilesNicknameData);

      const userResponse = await supabase.auth.getUser();
      const data = userResponse.data.user;
      const userId = data?.id;

      if (diariesResponse.data.authorId === userId) return setIsUser(true);
    })();
  }, []);

  const handleClickDeleteButton = async () => {
    const deleteResponse = await supabase
      .from("diaries")
      .select("*")
      .eq("id", Number(props.params.diaryId))
      .single();

    const { error: deleteDataError } = await supabase
      .from("diaries")
      .delete()
      .eq("id", deleteResponse.data.id);

    if (deleteDataError) {
      console.log("error", deleteDataError);
    } else {
      alert("삭제되었습니다");
      router.push("/diaries");
    }
  };

  if (!diaryData || !profileData) {
    return <p>로딩 중...</p>;
  }

  return (
    <div className="p-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-y-2">
          <h2 className="text-lg font-bold">{diaryData.title}</h2>
          <p>글쓴이: {profileData.nickname}</p>

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
          <CommentsPage
            params={{ diaryId: diaryData.id.toString() }}
            id={diaryData.id.toString()}
            content={diaryData.content}
          />
        </div>
      </div>
    </div>
  );
}

export default DiaryDetailPage;
