/* eslint-disable @next/next/no-img-element */
"use client";

import { supabase } from "@/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import HeartButton from "../_components/HeartButton";
import WriteCommentsPage from "./comments/page";

type DiaryDetailPageProps = {
  params: {
    diaryId: string;
  };
};

const baseURL =
  "https://kudrchaizgkzyjzrkhhy.supabase.co/storage/v1/object/public/";

function DiaryDetailPage(props: DiaryDetailPageProps) {
  const [diaryData, setDiaryData] = useState<any>(null); // diaryData의 타입을 any로 변경
  const [profileData, setProfileData] = useState<any>(null); // profileData의 타입을 any로 변경
  const [isUser, setIsUser] = useState(false);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const diariesResponse = await supabase
        .from("diaries")
        .select("*")
        .eq("id", Number(props.params.diaryId))
        .single();

      // profile 정보 가져오기
      const profilesResponse = await supabase.from("profiles").select("*");
      const profilesData = profilesResponse.data;

      // profile id와 diary authorId를 찾아 비교해서 같은 것만 저장하기
      const profilesNicknameData = profilesData?.find(
        (data) => data.id === diariesResponse.data.authorId
      );

      setDiaryData(diariesResponse.data);
      setProfileData(profilesNicknameData);

      // 자기가 작성한 일기라면 isUser에 true를 주고 아니면 false를 준다.
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
      router.push("/views/publicView");
    }
  };

  if (!diaryData || !profileData) {
    return <p>로딩 중...</p>; // 로딩 상태 처리
  }

  return (
    <div>
      <div className="flex">
        <div>
          <p>
            {/* 임시로 사진 사이즈 조절함 */}
            사진:
            <img
              className="w-32"
              src={`${baseURL}${diaryData.imageUrl}`}
              alt="Diary"
            />
          </p>
          <p>제목: {diaryData.title}</p>
          <p>내용: {diaryData.content}</p>
          <p>글쓴이: {profileData.nickname}</p>
          <HeartButton diaryId={diaryData.id.toString()} />
        </div>

        <div className="ml-auto">
          <WriteCommentsPage
            params={{ diaryId: diaryData.id.toString() }}
            id={Number(diaryData.id)}
            content={diaryData.content}
          />
        </div>
      </div>
      {/* 자기가 작성한 일기라면 편집, 삭제버튼 띄우고, 아니라면 아무것도 띄우지 않는다 */}
      {isUser ? (
        <>
          <Link
            className="border w-72 inline-block text-center active:brightness-75"
            href={`/diaries/${diaryData.id}/edit`}
          >
            편집하기
          </Link>

          <button
            className="border w-72 inline-block text-center active:brightness-75"
            onClick={handleClickDeleteButton}
          >
            삭제하기
          </button>
        </>
      ) : null}
    </div>
  );
}

export default DiaryDetailPage;
