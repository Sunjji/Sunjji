"use client";

import { supabase } from "@/supabase/client";
import { Database } from "@/supabase/database.types";
import { useMutation } from "@tanstack/react-query";
import { nanoid } from "nanoid";
import { useRouter } from "next/navigation";
import { ComponentProps, FormEvent } from "react";

type CustomProfileFormEvent = FormEvent<HTMLFormElement> & {
  target: FormEvent<HTMLFormElement>["target"] & {
    image: HTMLInputElement;
    name: HTMLInputElement;
    gender: HTMLInputElement;
    age: HTMLInputElement;
    weight: HTMLInputElement;
    comment: HTMLInputElement;
  };
};

type CreateProfileData = Database["public"]["Tables"]["pets"]["Insert"]; // 타입지정

function CreateNewProfileForm() {
  const router = useRouter();

  const { mutateAsync } = useMutation({
    mutationFn: async (data: CreateProfileData) =>
      await supabase.from("pets").insert(data).select("*").single(), //슈파베이스의 pets 테이블로 정보를 넣음
  });

  const handleSubmit: ComponentProps<"form">["onSubmit"] = async (
    e: CustomProfileFormEvent
  ) => {
    e.preventDefault();
    console.log(e.target);
    const image = e.target.image.files?.[0];
    const name = e.target.name.value;
    const gender = e.target.gender.value;
    const age = Number(e.target.age.value);
    const weight = Number(e.target.weight.value);
    const comment = e.target.comment.value;

    if (!image) return alert("이미지가 없어요"); // 이미지 없을시 alert를 출력dd

    const extension = image.name.split(".").slice(-1)[0]; // extension이라는 변수에 .jpg .png 이런거만 따로 저장하는 코드
    const filename = nanoid(); // 이름에서 충돌 없게 무작위 수를 출력하는 nanoid를 사용(filename에 담음)
    const path = `${filename}.${extension}`; // 두개 합쳐서 파일의 이름이 filename.extension이 되게함

    const storage = await supabase.storage
      .from("pets")
      .upload(path, image, { upsert: true });
    if (storage.error) return alert("이미지 업로드에 실패하셨습니다");

    const imageUrl = storage.data.fullPath;
    const data: CreateProfileData = {
      imageUrl,
      name,
      gender,
      age,
      weight,
      comment,
    };

    const { data: pets, error } = await mutateAsync(data); //pets를 사용하지 않아서 생기는 오류, 나중에 수정예정(사용에는 지장없음)

    if (error) return alert("페이지 작성 실패");

    alert("프로필 등록 성공 ");
    router.push("/my-page");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1 className="text-3xl">반려동물 등록</h1>
      <h2 className="text-2xl">이미지 첨부</h2>
      <input name="image" type="file" />

      <h2 className="text-2xl">이름</h2>
      <input name="name" id="name" type="text" autoFocus />

      <div>
        <h2 className="text-2xl">성별</h2>
        <label htmlFor="male">수컷</label>
        <input name="gender" id="male" value="male" type="radio" />
        <label htmlFor="female">암컷</label>
        <input name="gender" id="female" value="female" type="radio" />
      </div>

      <h2 className="text-2xl">나이</h2>
      <input name="age" type="number" />

      <h2 className="text-2xl">몸무게</h2>
      <input name="weight" type="number" />

      <h2 className="text-2xl">한 줄 소개</h2>
      <input name="comment" type="text" />

      <br />
      <button className="text-2xl bg-white">제출하기</button>
    </form>
  );
}

export default CreateNewProfileForm;
