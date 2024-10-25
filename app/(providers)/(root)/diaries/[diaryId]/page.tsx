"use client";

import api from "@/api/api";
import Page from "@/app/(providers)/(root)/_components/Page/Page";
import { supabase } from "@/supabase/client";
import { Tables } from "@/supabase/database.types";
import { useAuthStore } from "@/zustand/auth.store";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Bounce, toast } from "react-toastify";
import Comments from "../_components/Comments";

const baseURL =
  "https://kudrchaizgkzyjzrkhhy.supabase.co/storage/v1/object/public/";

function DiaryDetailPage() {
  const successToast = {
    position: "top-right",
    closeButton: false,
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
    transition: Bounce,
    style: {
      backgroundColor: "#E3F4E5",
      color: "#2E7D32",
      fontFamily: "MongxYamiyomiL",
    },
  };
  const params = useParams();
  const { diaryId } = params;
  const [diaries, setDiaries] = useState<Tables<"diaries">>();
  const [profiles, setProfiles] = useState<Tables<"profiles">>();
  const [pets, setPets] = useState<Tables<"pets">>();
  const currentUserId = useAuthStore((state) => state.currentUserId);
  const [isClicked, setIsClicked] = useState([false, false, false]); // 컴포넌트화?/미완성
  const router = useRouter();

  const handleClick = (index: number) => {
    const newClickedState = [false, false, false]; // 초기화
    newClickedState[index] = !isClicked[index]; // 클릭한 버튼만 반전
    setIsClicked(newClickedState);
  };

  useEffect(() => {
    (async () => {
      const { data: diaries, error } = await api.diaries.getDiary(
        diaryId.toString()
      );

      const { data: profiles } = await supabase.from("profiles").select("*");

      if (error) {
        return console.log("diaries error", error);
      } else {
        const profile = profiles?.find((data) => data.id === diaries.authorId);

        const { data: pets, error } = await supabase
          .from("pets")
          .select("*")
          .eq("butlerId", diaries.authorId)
          .single();
        if (error) {
          return console.log("pets error", error);
        }

        setDiaries(diaries);
        setProfiles(profile);
        setPets(pets);
      }
    })();
  }, []);

  const handleClickDeleteButton = async () => {
    await api.diaries.getDiary(diaryId.toString());

    const deleteDiary = await api.diaries.deleteDiary(diaryId.toString());

    if (!deleteDiary) {
      console.log("error");
    } else {
      toast("💚 일기가 삭제되었습니다", successToast);
      router.push("/diaries");
    }
  };

  if (!diaries || !profiles) {
    return <p className="p-5">로딩 중...</p>;
  }

  return (
    <Page>
      <div className="grid grid-cols-3 text-[#A17762]">
        <div className="flex gap-x-4 col-span-3">
          <div className="flex gap-x-4 mb-4">
            {/* 미완성 */}
            <button
              onClick={() => handleClick(0)}
              type="button"
              className="border px-3 py-2 rounded-[8px]"
            >
              공개 일기
            </button>
            <button
              onClick={() => handleClick(1)}
              type="button"
              className="border px-3 py-2 rounded-[8px]"
            >
              오늘의 사고 뭉치
            </button>
            <button
              onClick={() => handleClick(2)}
              type="button"
              className="border px-3 py-2 rounded-[8px]"
            >
              이것 좀 보세요 ~!
            </button>
          </div>
        </div>

        <div className="col-span-1 gap-4">
          <div className="flex flex-col gap-y-2">
            {/* 제목 */}
            <h2 className="text-lg font-bold">{diaries.title}</h2>

            {/* 일기 사진 */}
            <img className="w-full" src={`${baseURL}${diaries.imageUrl}`} />

            {/* 글쓴이 */}

            <p>글쓴이: {profiles.nickname}</p>

            {/* 일기 내용 */}
            <p className=" w-full text-sm">{diaries.content}</p>

            {/* 자기 일기라면 편집, 삭제 버튼 띄우기 */}
            {diaries.authorId === currentUserId ? (
              <div className="mt-10 flex flex-col lg:flex-row gap-2">
                <Link
                  className="border rounded-lg w-72 text-center py-2 hover:brightness-90 active:brightness-50"
                  href={`/diaries/${diaries.id}/edit`}
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
            ) : null}
          </div>

          <div className="flex md:justify-end sm:justify-start sm:pt-5">
            <Comments />
          </div>
        </div>

        <div className="col-span-1 w-full">
          <div key={profiles.id} className="flex gap-x-4">
            <img
              className="rounded-full w-14 h-14 object-cover"
              src={`${profiles.imageUrl}`}
              alt="프로필이미지"
            />
            <div className="flex">
              <div
                className="grid grid-cols-3 gap-x-4 items-center text-sm"
                key={pets?.id}
              >
                <p className="col-span-1 text-xl font-semibold ">
                  {profiles.nickname}
                </p>
                <p className="col-span-2">
                  {pets?.name} · {pets?.gender}
                </p>
                <p className="col-span-3">
                  {pets?.weight}kg / {pets?.age}세
                </p>
              </div>
            </div>
          </div>

          {/* 한 줄 메모 들어갈 자리 */}
          <p>
            한 줄 메모: <br />
            {diaries.comment}
          </p>
        </div>
      </div>
    </Page>
  );
}

export default DiaryDetailPage;
