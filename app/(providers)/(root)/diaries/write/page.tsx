"use client";

import api from "@/api/api";
import { supabase } from "@/supabase/client";
import { Tables } from "@/supabase/database.types";
import { useAuthStore } from "@/zustand/auth.store";
import { useModalStore } from "@/zustand/modal.store";
import { useQuery } from "@tanstack/react-query";
import { nanoid } from "nanoid";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ComponentProps, useEffect, useState } from "react";
import { Bounce, toast } from "react-toastify";
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

  const [isSelected, setIsSelected] = useState(false);

  const openModal = useModalStore((state) => state.openModal);

  const currentUserId = useAuthStore((state) => state.currentUserId);

  console.log(currentUserId);
  const [pets, setPets] = useState<Tables<"pets">[]>([]);
  const [isClicked, setIsClicked] = useState([false, false, false]);
  const router = useRouter();

  useEffect(() => {
    if (file) {
      setImageUrl(URL.createObjectURL(file));
    }
  }, [file]);

  const { data: myPets } = useQuery({
    queryKey: ["pets"],
    enabled: !!currentUserId,
    queryFn: () => api.pets.getMyPets(currentUserId!),
  });

  useEffect(() => {
    if (!myPets) {
      return console.log("pets error");
    } else {
      setPets(myPets);
    }
  }, [myPets]);

  const handleSubmitButton: ComponentProps<"form">["onSubmit"] = async (e) => {
    e.preventDefault();

    if (!title)
      return toast("💛 제목을 작성해 주세요", {
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
          backgroundColor: "#FFF9C4",
          color: "#F9A825",
          fontFamily: "MongxYamiyomiL",
        },
      });
    if (!memo)
      return toast("💛 한 줄 메모를 작성해 주세요", {
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
          backgroundColor: "#FFF9C4",
          color: "#F9A825",
          fontFamily: "MongxYamiyomiL",
        },
      });
    if (!content)
      return toast("💛 오늘의 일기를 작성해 주세요", {
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
          backgroundColor: "#FFF9C4",
          color: "#F9A825",
          fontFamily: "MongxYamiyomiL",
        },
      });

    if (!imageUrl)
      return toast("💛 사진을 선택해 주세요", {
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
          backgroundColor: "#FFF9C4",
          color: "#F9A825",
          fontFamily: "MongxYamiyomiL",
        },
      });

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
        toast("💚 공개 일기가 작성되었습니다", {
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
      } else {
        toast("💚 비공개 일기가 작성되었습니다", {
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
    }
  };

  const handleClick = (index: number) => {
    const newClickedState = [false, false, false]; // 초기화
    newClickedState[index] = !isClicked[index]; // 클릭한 버튼만 반전
    setIsClicked(newClickedState);
  };

  const handleClickOpenModal = () => {
    openModal(
      <ChooseMyPets isSelected={isSelected} setIsSelected={setIsSelected} />
    );
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

            {pets.map((pet) => (
              <Link href={"/my-page"}>
                {isSelected ? (
                  <div
                    key={pet.id}
                    className="text-sm p-2flex gap-x-2 text-[#A17762] border  rounded-[8px] w-auto h-[50px] items-center"
                  >
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
                ) : null}
              </Link>
            ))}

            {/* <Link href={"/my-page"}>
              <div className="text-sm p-2flex gap-x-2 text-[#A17762] border  rounded-[8px] w-auto h-[50px] items-center">
                <img
                  className="rounded-full w-8 h-8 object-cover"
                  src={`${baseURL}${pets[0].imageUrl}`}
                  alt="펫 이미지"
                />
                <div className="flex flex-col">
                  <p>
                    {pets[0].name} · {pets[0].gender}
                  </p>

                  <p>
                    {pets[0].weight} / {pets[0].age}
                  </p>
                </div>
              </div>
            </Link> */}

            <button
              type="button"
              className="p-2 text-[#A17762] border rounded-[8px] w-[100px] h-[50px]"
              onClick={handleClickOpenModal}
            >
              +
            </button>

            {/*

            기본은 대표펫(아직 기능은 없음)으로 설정된 펫 한 마리에 + 버튼..
            + 버튼을 누르면 자기가 가지고 있는 펫 목록 중에 선택을 하여 일기 작성할 수 있게 하기

            */}

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
                저장 일기
              </button>
            </div>
            <div className="flex flex-col gap-y-4">
              <textarea
                className="border rounded-lg p-2 resize-none hover:border-gray-400 placeholder:text-[#A17762]"
                placeholder="제목"
                onChange={(e) => setTitle(e.target.value)}
                rows={1}
              />

              {/* 한 줄 메모가 뭔지 몰라서 기능 없음 */}
              <textarea
                className="border rounded-lg p-2 resize-none hover:border-gray-400 placeholder:text-[#A17762]"
                placeholder="한 줄 메모"
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
