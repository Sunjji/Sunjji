/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";

import api from "@/api/api";
import Page from "@/app/(providers)/(root)/_components/Page/Page";
import { supabase } from "@/supabase/client";
import { Tables } from "@/supabase/database.types";
import { useAuthStore } from "@/zustand/auth.store";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { getToastOptions } from "../../_components/getToastOptions";
import Comments from "../_components/Comments";
import dayjs from "dayjs";

const baseURL =
  "https://kudrchaizgkzyjzrkhhy.supabase.co/storage/v1/object/public/";

function DiaryDetailPage() {
  const params = useParams();
  const { diaryId } = params;
  const [diaries, setDiaries] = useState<Tables<"diaries">>();
  const [profiles, setProfiles] = useState<Tables<"profiles">>();
  const [firstPet, setFirstPet] = useState<Tables<"pets">>();
  // const [pets, setPets] = useState<Tables<"pets">[]>([]);
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

        const { data: firstPet, error } = await supabase
          .from("pets")
          .select("*")
          .eq("id", profile.firstPetId)
          .single();
        if (error) {
          return console.log("firstPet error", error);
        }

        const { data: pets } = await supabase
          .from("pets")
          .select("*")
          .eq("butlerId", profile.id);
        if (!pets) {
          return console.log("pets error");
        }

        setDiaries(diaries);
        setProfiles(profile);
        setFirstPet(firstPet);
        // setPets(pets);
      }
    })();
  }, []);

  const handleClickDeleteButton = async () => {
    await api.diaries.getDiary(diaryId.toString());

    const deleteDiary = await api.diaries.deleteDiary(diaryId.toString());

    if (!deleteDiary) {
      console.log("error");
    } else {
      toast("💚 일기가 삭제되었습니다", getToastOptions("success"));
      router.push("/diaries");
    }
  };

  if (!diaries || !profiles) {
    return <p className="p-5">로딩 중...</p>;
  }

  return (
    <Page>
      <ToastContainer />
      <div className="grid grid-cols-3 text-[#A17762]">
        <div className="flex gap-x-4 col-span-3 absolute top-[82px] left-[430px] ">
          <div className="flex gap-x-10 mb-4">
            {/* 미완성 */}
            <button
              onClick={() => handleClick(0)}
              type="button"
              className="rounded-[8px] w-[150px] h-[70px] text-3xl text-opacity-50 font-semibold text-BrownPoint bg-whitePoint text-center transition duration-300 hover:bg-BrownPoint hover:text-white"
            >
              공개 일기
            </button>
            <button
              onClick={() => handleClick(1)}
              type="button"
              className="rounded-[8px] w-[150px] h-[70px] text-3xl text-opacity-50 font-semibold text-BrownPoint bg-whitePoint text-center transition duration-300 hover:bg-BrownPoint hover:text-white"
            >
              오늘의 <br /> 사고 뭉치
            </button>
            <button
              onClick={() => handleClick(2)}
              type="button"
              className="rounded-[8px] w-[150px] h-[70px] text-3xl text-opacity-50 font-semibold text-BrownPoint bg-whitePoint text-center transition duration-300 hover:bg-BrownPoint hover:text-white"
            >
              이것 좀 <br /> 보세요 ~!
            </button>
          </div>
        </div>
        <div className="bg-whitePoint flex w-[1200px] p-7 rounded-[8px]">
        <div className="col-span-1 gap-4">
          <div className="flex flex-col gap-y-3">
            {/* 제목 */}
            <h2 className="text-2xl font-bold">{diaries.title}</h2>

            {/* 일기 사진 */}
            <div className="aspect-w-4 aspect-h-3 w-[430px]">
              <img className="w-full h-full object-cover" src={`${baseURL}${diaries.imageUrl}`} />
            </div>

            {/* 작성 시간 */}
            <p className="text-xl">{dayjs(profiles.createdAt).format('YYYY.MM.DD A hh:mm')}</p>

            {/* 일기 내용 */}
            <p className=" w-full text-lg">{diaries.content}</p>

            {/* 자기 일기라면 편집, 삭제 버튼 띄우기 */}
            {diaries.authorId === currentUserId ? (
              <div className="mt-5 flex flex-col lg:flex-row gap-2">
                <Link
                  className="border rounded-lg w-[212px] text-center py-2 hover:brightness-90 active:brightness-50"
                  href={`/diaries/${diaries.id}/edit`}
                >
                  편집하기
                </Link>

                <button
                  className="border rounded-lg w-[212px] text-center py-2 hover:border-gray-400 active:brightness-50"
                  onClick={handleClickDeleteButton}
                >
                  삭제하기
                </button>
              </div>
            ) : null}
          </div>

          
        </div>

        <div className="col-span-1 w-full mt-[46px] ml-7">
          <div key={profiles.id} className="flex gap-x-4">
            <img
              className="rounded-full w-14 h-14 object-cover"
              src={`${profiles.imageUrl}`}
              alt="프로필이미지"
            />
            <div className="flex">
              <div
                className="grid grid-cols-3 gap-x-4 items-center text-sm"
                key={firstPet?.id}
              >
                <p className="col-span-1 text-xl font-semibold ">
                  {profiles.nickname}
                </p>
                <p className="col-span-2">
                  {firstPet?.name} · {firstPet?.gender}
                </p>
                <p className="col-span-3">
                  {firstPet?.weight}kg / {firstPet?.age}세
                </p>
              </div>
            </div>
          </div>

          {/* 한 줄 메모 들어갈 자리 */}
          <p className="text-2xl ml-2 mt-8">
            한 줄 메모: <br /> <br />
            {diaries.comment}
          </p>

          {/* {pets.map((pet) => (
            <p>{pet.name}</p>
          ))} */}
        </div>
        <div className="col-span-1 md:justify-end sm:justify-start sm:pt-5">
          <Comments />
        </div>
        </div>
      </div>
    </Page>
  );
}

export default DiaryDetailPage;
