/* eslint-disable @next/next/no-img-element */
"use client";

import { supabase } from "@/supabase/client";
import { nanoid } from "nanoid";
import React, { FormEvent, useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { Bounce, toast } from "react-toastify";

const PetProfile = () => {
  const successToast = {
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
  };

  const failToast = {
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
      backgroundColor: "#F9C1BD",
      color: "#D32F2F",
      fontFamily: "MongxYamiyomiL",
    },
  };

  const waringToast = {
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
  };

  const [formData, setFormData] = useState({
    weight: 0,
    age: 0,
    gender: "",
    name: "",
    comment: "",
    imageUrl: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>("");
  const [formVisible, setFormVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);

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
    setIsLoading(true);

    if (!imageFile) {
      setIsLoading(false);
      toast("💛 사진을 선택해 주세요", waringToast);
      return;
    }

    if (!formData.name) {
      setIsLoading(false);
      toast("💛 이름을 입력해 주세요", waringToast);
      return;
    }

    if (!["수컷", "암컷"].includes(formData.gender)) {
      setIsLoading(false);
      toast("💛 성별을 선택해 주세요", waringToast);
      return;
    }

    if (formData.age <= 0) {
      setIsLoading(false);
      toast("💛 나이는 0보다 큰 값을 입력해 주세요", waringToast);
      return;
    }

    if (formData.weight <= 0) {
      setIsLoading(false);
      toast("💛 몸무게는 0보다 큰 값을 입력해 주세요", waringToast);
      return;
    }

    if (!formData.comment) {
      setIsLoading(false);
      toast("💛 한 줄 소개를 입력해 주세요", waringToast);
      return;
    }

    const extension = imageFile!.name.split(".").pop();
    const filename = `${nanoid()}.${extension}`;

    // 이미지 업로드
    const { data, error: uploadError } = await supabase.storage
      .from("pets")
      .upload(filename, imageFile!, { upsert: true });

    if (uploadError) {
      setIsLoading(false);
      toast("❤️ 사진을 업로드에 실패했습니다", failToast);
      return;
    }

    const imagePath = data?.fullPath || "";

    // 슈파베이스에 반려동물 정보 등록
    const petData = { ...formData, imageUrl: imagePath };
    const { error } = await supabase.from("pets").insert(petData);

    if (error) {
      setIsLoading(false);
      toast("❤️ 반려동물 등록에 실패했습니다", failToast);
    } else {
    }
    toast("💚 반려동물이 등록되었습니다", successToast);

    setFormData({
      weight: 0,
      age: 0,
      gender: "",
      name: "",
      comment: "",
      imageUrl: "",
    });
    setIsLoading(false);
    setImageFile(null);
    setFormVisible(false);
    setImagePreviewUrl("");
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
              className="border rounded px-2 py-1 w-full"
            />
          </div>
          <button
            type="submit"
            className="mt-4 border border-black px-2 py-1 rounded-lg"
            disabled={isLoading}
          >
            {isLoading ? (
              <FaSpinner className="animate-spin h-6 w-6 text-BrownPoint" />
            ) : (
              "등록하기"
            )}
          </button>
        </form>
      )}
    </div>
  );
};

export default PetProfile;
