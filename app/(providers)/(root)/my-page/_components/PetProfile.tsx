"use client";

import { supabase } from "@/supabase/client";
import { Database } from "@/supabase/database.types";
import { nanoid } from "nanoid";
import { useRouter } from "next/navigation";
import React, { FormEvent, useEffect, useState } from "react";

type CreateProfileData = Database["public"]["Tables"]["pets"]["Insert"];

const PetProfile = () => {
  const [formData, setFormData] = useState<CreateProfileData>({
    weight: 1,
    age: 1,
    gender: "수컷", // 기본값 설정
    name: "",
    comment: "",
    imageUrl: "", // 이미지 URL 필드 추가
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>("");
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [formVisible, setFormVisible] = useState<boolean>(false); // 폼 가시성 상태 추가
  const router = useRouter();

  useEffect(() => {
    if (imageFile) {
      const objectUrl = URL.createObjectURL(imageFile);
      setImagePreviewUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [imageFile]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageFile(e.target.files?.[0] || null);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatusMessage(""); // 이전 메시지 초기화

    const extension = imageFile!.name.split(".").pop();
    const filename = `${nanoid()}.${extension}`;

    // 이미지 업로드
    const { data, error: uploadError } = await supabase.storage
      .from("pets")
      .upload(filename, imageFile!, { upsert: true });

    if (uploadError) {
      setStatusMessage("사진 업로드에 실패했습니다.");
      return;
    }

    const imagePath = data?.fullPath || "";

    // 데이터베이스에 반려동물 정보 등록
    const petData: CreateProfileData = { ...formData, imageUrl: imagePath };

    const { error: insertError } = await supabase.from("pets").insert(petData);

    if (insertError) {
      setStatusMessage(`오류 발생: ${insertError.message}`);
    } else {
      setStatusMessage("프로필이 성공적으로 등록되었습니다.");
      // 폼 데이터 초기화
      setFormData({
        weight: 1,
        age: 1,
        gender: "수컷",
        name: "",
        comment: "",
        imageUrl: "",
      });
      setImageFile(null);
      setImagePreviewUrl("");
      // 리다이렉트
      router.push("/my-page");
    }
  };

  return (
    <div className="container mx-auto">
      <button
        onClick={() => setFormVisible(true)}
        className="border border-black px-2 py-1 rounded-lg mb-4"
      >
        반려동물 등록
      </button>

      {formVisible && (
        <form onSubmit={handleSubmit} className="mt-4">
          <h1 className="text-3xl">반려동물 등록</h1>
          {statusMessage && (
            <p className="text-green-500 mt-2">{statusMessage}</p>
          )}

          {imagePreviewUrl && (
            <img
              src={imagePreviewUrl}
              alt="Preview"
              className="mt-2 mb-2 w-32 h-32 object-cover"
            />
          )}

          <h2 className="text-2xl mt-2">이미지 첨부</h2>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="border rounded px-2 py-1"
          />

          <div className="mt-4">
            <label className="block text-2xl">이름</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              type="text"
              required
              className="border rounded px-2 py-1 w-full"
            />
          </div>

          <div className="mt-4">
            <label className="block text-2xl">성별</label>
            <label className="mr-4">
              <input
                type="radio"
                name="gender"
                value="수컷"
                checked={formData.gender === "수컷"}
                onChange={handleInputChange}
              />{" "}
              수컷
            </label>
            <label>
              <input
                type="radio"
                name="gender"
                value="암컷"
                checked={formData.gender === "암컷"}
                onChange={handleInputChange}
              />{" "}
              암컷
            </label>
          </div>

          <div className="mt-4">
            <label className="block text-2xl">나이</label>
            <input
              name="age"
              type="number"
              value={formData.age}
              onChange={handleInputChange}
              required
              className="border rounded px-2 py-1 w-full"
            />
          </div>

          <div className="mt-4">
            <label className="block text-2xl">몸무게</label>
            <input
              name="weight"
              type="number"
              value={formData.weight}
              onChange={handleInputChange}
              required
              className="border rounded px-2 py-1 w-full"
            />
          </div>

          <div className="mt-4">
            <label className="block text-2xl">한 줄 소개</label>
            <input
              name="comment"
              value={formData.comment}
              onChange={handleInputChange}
              type="text"
              required
              className="border rounded px-2 py-1 w-full"
            />
          </div>

          <button type="submit" className="mt-4 border border-black px-2 py-1 rounded-lg">
            등록하기
          </button>
        </form>
      )}
    </div>
  );
};

export default PetProfile;
