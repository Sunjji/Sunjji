"use client";

import { supabase } from "@/supabase/client";
import { nanoid } from "nanoid";
import { useParams, useRouter } from "next/navigation";
import React, { ComponentProps, useEffect, useState } from "react";

type PetProfileEditProps = {
  params: {
    butlerId: string;
  };
  id: number;
  weight: number;
  age: number;
  gender: string;
  name: string;
  comment: string;
};

function PetProfileEditPage(props: PetProfileEditProps) {
  const params = useParams();
  const [weight, setWeight] = useState(1);
  const [age, setAge] = useState(1);
  const [gender, setGender] = useState("");
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [imageFile, setImageFile] = useState<File>();
  const [imageUrl, setImageUrl] = useState("");
  const [currentImageUrl, setCurrentImageUrl] = useState("");
  const router = useRouter();
  const petId = Number(params.petId);
  const baseURL =
    "https://kudrchaizgkzyjzrkhhy.supabase.co/storage/v1/object/public/";

  useEffect(() => {
    (async () => {
      const response = await supabase
        .from("pets")
        .select("*")
        .eq("id", petId)
        .single();
      const pet = response.data;

      console.log("response", response);

      setWeight(pet.weight);
      setAge(pet.age);
      setGender(pet.gender);
      setName(pet.name);
      setComment(pet.comment);
      setImageUrl(baseURL + pet.imageUrl);
      setCurrentImageUrl(response.data.currentImageUrl);
    })();
  }, [petId]);
  useEffect(() => {
    if (imageFile) {
      setImageUrl(URL.createObjectURL(imageFile));
    }
  }, [imageFile]);

  const handleFormSubmitButton: ComponentProps<"form">["onSubmit"] = async (
    e
  ) => {
    e.preventDefault();

    let imageFixPath = currentImageUrl;

    if (imageFile) {
      const extension = imageFile?.name.split(".").slice(-1)[0];
      const filename = nanoid();
      imageFixPath = `${filename}.${extension}`;

      const storage = await supabase.storage
        .from("pets")
        .upload(imageFixPath, imageFile, { upsert: true });

      if (!storage.data) {
        return alert("사진 수정에 실패하셨어요");
      }
      imageFixPath = storage.data.fullPath;
    }

    const response = await supabase
      .from("pets")
      .update({
        weight: weight,
        age: age,
        gender: gender,
        name: name,
        comment: comment,
        imageUrl: imageFixPath,
      })
      .eq("id", petId)
      .select("*");

    router.push("/my-page");
    alert("수정이 완료되었습니다");
  };

  return (
    <form onSubmit={handleFormSubmitButton}>
      <h1 className="text-3xl">반려동물 프로필 수정</h1>
      {imageUrl ? (
        <img src={imageUrl} />
      ) : (
        currentImageUrl && (
          <img
            src={`https://kudrchaizgkzyjzrkhhy.supabase.co/storage/v1/object/public/${currentImageUrl}`}
          />
        )
      )}
      <h2 className="text-2xl">이미지 첨부</h2>
      <input
        name="image"
        type="file"
        onChange={(e) => setImageFile(e.target.files?.[0])}
      />

      <h2 className="text-2xl">이름</h2>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        name="name"
        id="name"
        type="text"
        autoFocus
      />

      <div>
        <h2 className="text-2xl">성별</h2>
        <label htmlFor="male">수컷</label>
        <input
          checked={gender === "수컷"}
          onChange={(e) => setGender(e.target.value)}
          name="gender"
          id="수컷"
          value="수컷"
          type="radio"
        />
        <label htmlFor="female">암컷</label>
        <input
          checked={gender === "암컷"}
          onChange={(e) => setGender(e.target.value)}
          name="gender"
          id="암컷"
          value="암컷"
          type="radio"
        />
      </div>

      <h2 className="text-2xl">나이</h2>
      <input
        value={age}
        onChange={(e) => setAge(Number(e.target.value))}
        name="age"
        type="number"
      />

      <h2 className="text-2xl">몸무게</h2>
      <input
        value={weight}
        onChange={(e) => setWeight(Number(e.target.value))}
        name="weight"
        type="number"
      />

      <h2 className="text-2xl">한 줄 소개</h2>
      <input
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        name="comment"
        type="text"
      />

      <br />
      <button className="text-2xl bg-white">제출하기</button>
    </form>
  );
}

export default PetProfileEditPage;
