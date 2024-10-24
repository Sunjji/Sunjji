"use client";

import Page from "@/app/_page/Page";
import { supabase } from "@/supabase/client";
import { Tables } from "@/supabase/database.types";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Bounce, toast } from "react-toastify";
import Comments from "../_components/Comments";

const baseURL =
  "https://kudrchaizgkzyjzrkhhy.supabase.co/storage/v1/object/public/";

function DiaryDetailPage() {
  const params = useParams();
  const [diaryData, setDiaryData] = useState<Tables<"diaries">>();
  const [profileData, setProfileData] = useState<Tables<"profiles">[]>();
  const [pets, setPets] = useState<Tables<"pets">[]>();
  const [isUser, setIsUser] = useState(false);
  const [isClicked, setIsClicked] = useState([false, false, false]); // 컴포넌트화?/미완성
  const router = useRouter();

  const { diaryId } = params;

  const handleClick = (index: number) => {
    const newClickedState = [false, false, false]; // 초기화
    newClickedState[index] = !isClicked[index]; // 클릭한 버튼만 반전
    setIsClicked(newClickedState);
  };

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

        const { data: response, error } = await supabase
          .from("pets")
          .select("*")
          .eq("butlerId", diaries.authorId);
        if (error) {
          return console.log("error", error);
        } else {
          setPets(response);
        }

        console.log(profiles);
        setDiaryData(diaries);
        setProfileData([profiles!]);
      }

      const userResponse = await supabase.auth.getUser();
      const data = userResponse.data.user;
      const userId = data?.id;

      if (diaries.authorId === userId) return setIsUser(true);
    })();
  }, []);

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
      toast("💚 일기가 삭제되었습니다", {
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
      });
      router.push("/diaries");
    }
  };

  if (!diaryData || !profileData) {
    return <p className="p-5">로딩 중...</p>;
  }

  return (
    <Page>
      <div className="grid grid-cols-3 text-[#A17762]">
        <div className="flex gap-x-4 col-span-3">
          <div className="flex gap-x-4 mb-4">
            <button
              onClick={() => handleClick(0)}
              type="button"
              className={`border px-3 py-2 rounded-[8px] ${
                isClicked[0] ? "bg-[#A17762] text-point" : " bg-point"
              } transition`}
            >
              공개 일기
            </button>
            <button
              onClick={() => handleClick(1)}
              type="button"
              className={`border px-3 py-2 rounded-[8px] ${
                isClicked[1] ? "bg-[#A17762] text-point" : " bg-point"
              } transition`}
            >
              오늘의 사고 뭉치
            </button>
            <button
              onClick={() => handleClick(2)}
              type="button"
              className={`border px-3 py-2 rounded-[8px] ${
                isClicked[2] ? "bg-[#A17762] text-point" : " bg-point"
              } transition`}
            >
              이것 좀 보세요 ~!
            </button>
          </div>
        </div>

        <div className="col-span-1 gap-4">
          <div className="flex flex-col gap-y-2">
            {/* 제목 */}
            <h2 className="text-lg font-bold">{diaryData.title}</h2>

            {/* 일기 사진 */}
            <img className="w-full" src={`${baseURL}${diaryData.imageUrl}`} />

            {/* 글쓴이 */}
            {/* {profileData.map((profiles) => (
            <p key={profiles.id}>글쓴이: {profiles.nickname}</p>
          ))} */}

            {/* 일기 내용 */}
            <p className=" w-full text-sm">{diaryData.content}</p>

            {/* 자기 일기라면 편집, 삭제 버튼 띄우기 */}
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
            <Comments />
          </div>
        </div>

        <div className="col-span-1 w-full">
          {profileData.map((profile) => (
            <div key={profile.id} className="flex gap-x-4">
              <img
                className="rounded-full w-14 h-14 object-cover"
                src={`${profile.imageUrl}`}
                alt="프로필이미지"
              />
              <div className="flex">
                {pets?.map((pet) => (
                  <div
                    className="grid grid-cols-3 gap-x-4 items-center text-sm"
                    key={pet.id}
                  >
                    <p className="col-span-1 text-xl font-semibold ">
                      {profile.nickname}
                    </p>
                    <p className="col-span-2">
                      {pet.name} · {pet.gender}
                    </p>
                    <p className="col-span-3">
                      {pet.weight} / {pet.age}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* 한 줄 메모 들어갈 자리 */}
          <p>
            한 줄 메모: <br />
            {diaryData.content}
          </p>
        </div>
      </div>
    </Page>
  );
}

export default DiaryDetailPage;
