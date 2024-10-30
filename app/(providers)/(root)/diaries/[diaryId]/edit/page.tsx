/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";

import api from "@/api/api";
import { supabase } from "@/supabase/client";
import { Tables } from "@/supabase/database.types";
import { useAuthStore } from "@/zustand/auth.store";
import { useModalStore } from "@/zustand/modal.store";
import { nanoid } from "nanoid";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ComponentProps, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getToastOptions } from "../../../_components/getToastOptions";
import Page from "../../../_components/Page/Page";
import Button from "../../_components/Button";
import ChooseMyPets from "../../_components/ChooseMyPets ";
import IsPublicToggle from "../../_components/IsPublicToggle";

const baseURL =
  "https://kudrchaizgkzyjzrkhhy.supabase.co/storage/v1/object/public/";

function DiaryEditPage() {
  const params = useParams();
  const { diaryId } = params;
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [memo, setMemo] = useState("");
  const [file, setFile] = useState<null | File>(null);
  const [firstPet, setFirstPet] = useState<Tables<"pets">>();
  const [imageUrl, setImageUrl] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const router = useRouter();
  const currentUserId = useAuthStore((state) => state.currentUserId);
  const [pets, setPets] = useState<Tables<"pets">[]>([]);
  const [selectedPetIds, setSelectedPetIds] = useState<number[]>([]);
  const openModal = useModalStore((state) => state.openModal);

  // diaries 정보 가져오기
  useEffect(() => {
    (async () => {
      const { data: diaries } = await api.diaries.getDiary(diaryId.toString());
      if (!diaries) return;

      setTitle(diaries.title);
      setContent(diaries.content);
      setMemo(diaries.comment);
      setImageUrl(baseURL + diaries.imageUrl);
      setIsPublic(diaries.isPublic);
    })();
  }, [diaryId]);

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

  // form 제출 버튼
  const handleSubmitButton: ComponentProps<"form">["onSubmit"] = async (e) => {
    e.preventDefault();

    if (file === null) {
      await supabase
        .from("diaries")
        .update({
          title: title, // 제목
          content: content, // 내용
          comment: memo, // 메모
          isPublic: isPublic, // 공개/비공개
        })
        .eq("id", Number(diaryId));
      toast("💚 일기가 수정 되었습니다", getToastOptions("success"));

      router.push("/diaries");
    } else {
      const filename = nanoid();
      const extension = file!.name.split(".").slice(-1)[0];
      const path = `${filename}.${extension}`;

      const result = await supabase.storage
        .from("diaries")
        .upload(path, file!, { upsert: true });
      console.log(result);
      await supabase
        .from("diaries")
        .update({
          imageUrl: result.data?.fullPath,
        })
        .eq("id", Number(diaryId));

      toast("💚 사진이 변경 되었습니다", getToastOptions("success"));
      router.push("/diaries");
    }
  };

  const handleClickOpenModal = () => {
    openModal(<ChooseMyPets setSelectedPetIds={setSelectedPetIds} />);
  };

  return (
    <Page title={"수정 페이지"}>
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
                <div className="text-sm p-2 flex gap-x-2 text-BrownPoint border rounded-[8px] w-auto h-[50px] items-center">
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
                수정하기
              </button>
            </div>
          </div>

          <div className="col-span-1">
            <div className="flex gap-x-4 mb-4 ">
              {/* 미완성 */}
              <Button buttonLabel="일기" />

              <Button buttonLabel="사고 뭉치" />

              <Button buttonLabel="자랑 일기" />
            </div>

            {/* 제목 10글자 넘으면 ...으로 바꿔주기 */}
            <div className="flex flex-col gap-y-4">
              <textarea
                onChange={(e) => setTitle(e.target.value)}
                value={title}
                placeholder="제목"
                className="border rounded-lg p-2 resize-none hover:border-gray-400 placeholder:text-BrownPoint"
                rows={2}
              />

              <textarea
                onChange={(e) => setMemo(e.target.value)}
                value={memo}
                placeholder="메모"
                className="border rounded-lg p-2 resize-none hover:border-gray-400 placeholder:text-BrownPoint"
                rows={13}
              />
            </div>
          </div>

          <textarea
            onChange={(e) => setContent(e.target.value)}
            value={content}
            placeholder="내용"
            className="border rounded-lg p-2 resize-none hover:border-gray-400 placeholder:text-BrownPoint"
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
                  사진 수정하기
                </span>
              </label>
            </div>
          </div>
        </div>
      </form>
    </Page>
  );
}

export default DiaryEditPage;
