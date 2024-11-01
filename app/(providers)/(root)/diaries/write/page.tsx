/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
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
import Button from "../_components/Button";
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
  const [category, setCategory] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const [selectedPetIds, setSelectedPetIds] = useState<number[]>([]);

  const openModal = useModalStore((state) => state.openModal);
  const [pets, setPets] = useState<Tables<"pets">[]>([]);
  const [firstPet, setFirstPet] = useState<Tables<"pets">>();
  const currentUserId = useAuthStore((state) => state.currentUserId);

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
        .eq("id", currentUserId!);

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

    const { error } = await supabase
      .from("diaries")
      .insert({
        title,
        content,
        isPublic,
        imageUrl: result.data?.fullPath || "",
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

  const handleClickOpenModal = () => {
    openModal(<ChooseMyPets setSelectedPetIds={setSelectedPetIds} />);
  };

  return (
    <Page title={"작성 페이지"}>
      <form
        onSubmit={handleSubmitButton}
        className="flex flex-col bg-[#FEFBF2] rounded-[8px]"
      >
        <div className="grid grid-cols-3 gap-x-3 p-5 bg-[#FFFEFA] rounded-[8px] w-full">
          <div className="col-span-3 flex gap-x-4 items-center mb-4">
            <Link href={"/my-page"}>
              <div className="text-sm p-2 flex gap-x-2 text-BrownPoint border rounded-[8px] w-auto h-[50px] items-center">
                <img
                  className="rounded-full w-8 h-8 object-cover"
                  src={`${baseURL}${firstPet?.imageUrl}`}
                  alt="펫 이미지"
                />
                <div className="flex flex-col">
                  <p>
                    {firstPet?.name} · {firstPet?.breed} · {firstPet?.gender}
                  </p>

                  <p>{firstPet?.weight}</p>
                </div>
              </div>
            </Link>

            {pets.map((pet) => (
              <Link key={pet.id} href={"/my-page"}>
                <div className="text-sm p-2 flex gap-x-2 text-BrownPoint border rounded-[8px] w-auto h-[50px] items-center">
                  <img
                    className="rounded-full w-8 h-8 object-cover"
                    src={`${baseURL}${pet.imageUrl}`}
                    alt="펫 이미지"
                  />
                  <div className="flex flex-col">
                    <p>
                      {pet.name} · {pet.breed} · {pet.gender}
                    </p>

                    <p>{pet.weight}</p>
                  </div>
                </div>
              </Link>
            ))}

            <button
              type="button"
              className="p-2 text-BrownPoint border rounded-[8px] w-[100px] h-[50px]"
              onClick={handleClickOpenModal}
            >
              +
            </button>
            <div className="flex gap-x-4 ml-auto">
              <IsPublicToggle isPublic={isPublic} setIsPublic={setIsPublic} />
              <button
                type="submit"
                className="text-BrownPoint border py-2 rounded-[8px] w-[100px] h-[40px] font-semibold text-center"
              >
                저장하기
              </button>
            </div>
          </div>

          <div className="col-span-1">
            <div className="flex gap-x-4 mb-4 ">
              {/* 미완성 */}
              <Button
                setCategory={setCategory}
                category={category}
                buttonLabel="일기"
              />

              <Button
                setCategory={setCategory}
                category={category}
                buttonLabel="사고 뭉치"
              />

              <Button
                setCategory={setCategory}
                category={category}
                buttonLabel="자랑 일기"
              />
            </div>

            {/* 제목 10글자 넘으면 ...으로 바꿔주기 */}
            <div className="flex flex-col gap-y-4">
              <textarea
                className="border rounded-lg p-2 resize-none hover:border-gray-400 placeholder:text-BrownPoint"
                placeholder="제목"
                onChange={(e) => setTitle(e.target.value)}
                rows={1}
              />

              <textarea
                className="border rounded-lg p-2 resize-none hover:border-gray-400 placeholder:text-BrownPoint"
                placeholder="메모"
                onChange={(e) => setMemo(e.target.value)}
                rows={13}
              />
            </div>
          </div>

          <textarea
            className="border rounded-lg p-2 resize-none hover:border-gray-400 placeholder:text-BrownPoint"
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

                <span className="block mt-4 px-1 py-2 border rounded-[8px] text-BrownPoint text-center text-sm">
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
