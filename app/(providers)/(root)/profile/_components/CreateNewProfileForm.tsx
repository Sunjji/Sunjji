"use client";

import { supabase } from "@/supabase/client";
import { Database } from "@/supabase/database.types";
import { useMutation } from "@tanstack/react-query";
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
      <input name="weight " type="number" />
      <input name="comment " type="text" />

      <button>제출하기</button>
    </form>
  );
}

export default CreateNewProfileForm;
