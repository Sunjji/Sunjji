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

    const extension = image.name.split(".").slice(-1)[0]; // 확장자만 따로 배열에서 제외하기 위해 slice와 split를 사용
    const filename = nanoid(); // 이름에서 충돌 없게 무작위 수를 출력하는 nanoid를 사용
    const path = `${filename}.${extension}`; // 두개 합쳐서 파일의 이름이 filename.extension이 되게함

    console.log();

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

    if (!name) return alert("이름을 입력해주세요");
    if (!gender) return alert("성별을 입력해주세요");
    if (!age) return alert("나이를 입력해주세요");
    if (!weight) return alert("무게를 입력해주세요");
    if (!comment) return alert("댓글을 입력해주세요");

    const { data:  error } = await mutateAsync(data);

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
