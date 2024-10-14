"use client";

import { supabase } from "@/supabase/client";
import { Database } from "@/supabase/database.types";
import { useMutation } from "@tanstack/react-query";
import { nanoid } from "nanoid";
import { useRouter } from "next/navigation";
import React, { ComponentProps, FormEvent } from "react";

type CustomProfileFormEvent = FormEvent<HTMLFormElement> & {
  target: FormEvent<HTMLFormElement>["target"] & {
    image: HTMLFormElement;
    name: HTMLFormElement;
    gender: HTMLFormElement;
    age: HTMLFormElement;
    weight: HTMLFormElement;
    comment: HTMLFormElement;
  };
};

type CreateProfileData = Database["public"]["Tables"]["pets"]["Insert"]; // 타입지정

function CreateNewProfileForm() {
  const router = useRouter;

  const { mutateSubmit } = useMutation({
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
    const age = e.target.age.value;
    const weight = e.target.weight.value;
    const comment = e.target.comment.value;

    if (!image) return alert("이미지가 없어요"); // 이미지 없을시 alert를 출력

    const extension = image.name.split(".").slice(-1)[0]; // 확장자만 따로 배열에서 제외하기 위해 slice와 split를 사용
    const filename = nanoid(); // 이름에서 충돌 없게 무작위 수를 출력하는 nanoid를 사용
    const path = `${filename}.${extension}`; // 두개 합쳐서 파일의 이름이 filename.extension이 되게함

    console.log()

    const storage = await supabase.storage
      .from("pets")
      .upload(path, image, { upsert: true });
    if (storage.error) return alert("이미지 업로드에 실패하셨습니다");

    // const imageUrl = storage.data.fullPath;

    console.log(storage.data.fullPath);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="image" type="file" />
      <input name="name" type="text" />
      <label>
        <input name="gender" value="male" type="radio" />
      </label>
      <label>
        <input name="gender" value="female" type="radio" />
      </label>
      <input name="age" type="number" />
      <input name="weight" type="number" />
      <input name="comment" type="text" />

      <button>제출하기</button>
    </form>
  );
}

export default CreateNewProfileForm;
