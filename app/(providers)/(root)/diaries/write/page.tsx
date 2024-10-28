"use client";

import { supabase } from "@/supabase/client";
import { Tables } from "@/supabase/database.types";
import { useAuthStore } from "@/zustand/auth.store";
import { useModalStore } from "@/zustand/modal.store";
import { nanoid } from "nanoid";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ComponentProps, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getToastOptions } from "../../_components/getToastOptions";
import Page from "../../_components/Page/Page";
import ChooseMyPets from "../_components/ChooseMyPets ";
import IsPublicToggle from "../_components/IsPublicToggle";

const baseURL =
  "https://kudrchaizgkzyjzrkhhy.supabase.co/storage/v1/object/public/";

function DiaryWritePage() {
  const [file, setFile] = useState<null | File>(null);
  const [isPublic, setIsPublic] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [memo, setMemo] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const [selectedPetIds, setSelectedPetIds] = useState<number[]>([]);

  const openModal = useModalStore((state) => state.openModal);
  const [pets, setPets] = useState<Tables<"pets">[]>([]);
  const [firstPet, setFirstPet] = useState<Tables<"pets">>();
  const currentUserId = useAuthStore((state) => state.currentUserId);

  const [isClicked, setIsClicked] = useState([false, false, false]); // 미완성
  const router = useRouter();

  useEffect(() => {
    if (file) {
      setImageUrl(URL.createObjectURL(file));
    }
  }, [file]);

  useEffect(() => {
    (async () => {
      const { data: pets } = await supabase
        .from("pets")
        .select("*")
        .in("id", selectedPetIds);

      if (!pets) {
        return console.log("pets error");
      } else {
        setPets(pets);
      }
    })();
  }, [selectedPetIds]);

  useEffect(() => {
    (async () => {
      const { data: profiles } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", currentUserId);

      if (!profiles) return;

      const { data: pets, error } = await supabase
        .from("pets")
        .select("*")
        .in(
          "id",
          profiles!.map((data) => data.firstPetId)
        )
        .single();
      if (!pets) return console.log("pets error", error);
      setFirstPet(pets);
    })();
  }, [currentUserId, pets]);

  const handleSubmitButton: ComponentProps<"form">["onSubmit"] = async (e) => {
    e.preventDefault();

    if (!title)
      return toast("💛 제목을 작성해 주세요", getToastOptions("warning"));
    if (!memo)
      return toast("💛 한 줄 메모를 작성해 주세요", getToastOptions("warning"));
    if (!content)
      return toast(
        "💛 오늘의 일기를 작성해 주세요",
        getToastOptions("warning")
      );

    if (!imageUrl)
      return toast("💛 사진을 선택해 주세요", getToastOptions("warning"));

    const filename = nanoid();
    const extension = file!.name.split(".").slice(-1)[0];
    const path = `${filename}.${extension}`;

    const result = await supabase.storage
      .from("diaries")
      .upload(path, file!, { upsert: true });
    console.log(result);

    const { error } = await supabase
      .from("diaries")
      .insert({
        title,
        content,
        isPublic,
        imageUrl: result.data?.fullPath,
        comment: memo,
      })
      .select();

    if (error) {
      console.error("Error", error);
    } else {
      if (isPublic) {
        toast("💚 공개 일기가 작성되었습니다", getToastOptions("success"));
        router.push("/diaries");
      } else {
        toast("💚 비공개 일기가 작성되었습니다", getToastOptions("success"));
        router.push("/diaries");
      }
    }
  };

  const handleClick = (index: number) => {
    const newClickedState = [false, false, false]; // 초기화
    newClickedState[index] = !isClicked[index]; // 클릭한 버튼만 반전
    setIsClicked(newClickedState);
  };

  const handleClickOpenModal = () => {
    openModal(<ChooseMyPets setSelectedPetIds={setSelectedPetIds} />);
  };

  return (
    <Page>
      <form
        onSubmit={handleSubmitButton}
        className="flex flex-col bg-[#FEFBF2] rounded-[8px]"
      >
        <div className="absolute top-[46px] ml-36">
          <IsPublicToggle isPublic={isPublic} setIsPublic={setIsPublic} />
        </div>

        <div className="grid grid-cols-3 gap-x-3 p-5 bg-[#FFFEFA] rounded-[8px] w-full">
          <div className="col-span-3 flex gap-x-4 items-center mb-4">
            <p className="text-[#A17762]">오늘 어떤 변화가 있었나요?</p>

            <Link href={"/my-page"}>
              <div className="text-sm p-2 flex gap-x-2 text-[#A17762] border  rounded-[8px] w-auto h-[50px] items-center">
                <img
                  className="rounded-full w-8 h-8 object-cover"
                  src={`${baseURL}${firstPet?.imageUrl}`}
                  alt="펫 이미지"
                />
                <div className="flex flex-col">
                  <p>
                    {firstPet?.name} · {firstPet?.gender}
                  </p>

                  <p>
                    {firstPet?.weight} / {firstPet?.age}
                  </p>
                </div>
              </div>
            </Link>

            {pets.map((pet) => (
              <Link key={pet.id} href={"/my-page"}>
                <div className="text-sm p-2 flex gap-x-2 text-[#A17762] border  rounded-[8px] w-auto h-[50px] items-center">
                  <img
                    className="rounded-full w-8 h-8 object-cover"
                    src={`${baseURL}${pet.imageUrl}`}
                    alt="펫 이미지"
                  />
                  <div className="flex flex-col">
                    <p>
                      {pet.name} · {pet.gender}
                    </p>

                    <p>
                      {pet.weight} / {pet.age}
                    </p>
                  </div>
                </div>
              </Link>
            ))}

            <button
              type="button"
              className="p-2 text-[#A17762] border rounded-[8px] w-[100px] h-[50px]"
              onClick={handleClickOpenModal}
            >
              +
            </button>

            <button
              type="submit"
              className="text-[#A17762] border ml-auto py-2 rounded-[8px] w-[100px] h-[40px] font-semibold text-center"
            >
              저장하기
            </button>
          </div>

          <div className="col-span-1">
            <div className="flex gap-x-4 mb-4">
              {/* 미완성 */}
              {isPublic ? (
                <button
                  onClick={() => handleClick(0)}
                  type="button"
                  className={`border px-3 py-2 rounded-[8px] ${
                    isClicked[0]
                      ? "bg-[#A17762] text-point"
                      : "text-[#A17762] bg-point"
                  } transition`}
                >
                  공개 일기
                </button>
              ) : null}
              <button
                onClick={() => handleClick(1)}
                type="button"
                className={`border px-3 py-2 rounded-[8px] ${
                  isClicked[1]
                    ? "bg-[#A17762] text-point"
                    : "text-[#A17762] bg-point"
                } transition`}
              >
                사고 뭉치
              </button>
              <button
                onClick={() => handleClick(2)}
                type="button"
                className={`border px-3 py-2 rounded-[8px] ${
                  isClicked[2]
                    ? "bg-[#A17762] text-point"
                    : "text-[#A17762] bg-point"
                } transition`}
              >
                자랑 일기
              </button>
            </div>
            <div className="flex flex-col gap-y-4">
              <textarea
                className="border rounded-lg p-2 resize-none hover:border-gray-400 placeholder:text-[#A17762]"
                placeholder="제목"
                onChange={(e) => setTitle(e.target.value)}
                rows={1}
              />

              <textarea
                className="border rounded-lg p-2 resize-none hover:border-gray-400 placeholder:text-[#A17762]"
                placeholder="메모"
                onChange={(e) => setMemo(e.target.value)}
                rows={13}
              />
            </div>
          </div>

          <textarea
            className="border rounded-lg p-2 resize-none hover:border-gray-400 placeholder:text-[#A17762]"
            placeholder="오늘의 일기"
            onChange={(e) => setContent(e.target.value)}
            rows={16}
          />

          <div className="flex flex-col">
            <img
              className={imageUrl !== "" ? "w-full rounded-[8px]" : ""}
              src={imageUrl}
            />

            <div className="flex flex-col gap-y-2 ">
              <label htmlFor="file">
                <input
                  id="file"
                  type="file"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="hidden"
                />

                <span className="block mt-4 px-1 py-2 border rounded-[8px] text-[#A17762] text-center text-sm">
                  사진 첨부하기
                </span>
              </label>
            </div>
          </div>
        </div>
      </form>
    </Page>
  );
}
export default DiaryWritePage;
