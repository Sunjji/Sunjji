/* eslint-disable @next/next/no-img-element */
"use client";

import { supabase } from "@/supabase/client";
import { Pet } from "@/types/type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { nanoid } from "nanoid";
import React, { FormEvent, useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { toast } from "react-toastify";
import { getToastOptions } from "../../_components/getToastOptions";

const PetProfile = () => {
  const [formData, setFormData] = useState({
    weight: 0,
    gender: "",
    name: "",
    comment: "",
    breed: "",
    imageUrl: "",
    birth: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>("");
  const [formVisible, setFormVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const [selectedGender, setSelectedGender] = useState("");

  const { mutate: createPet } = useMutation({
    mutationFn: async (data: Pet) => {
      const response = await supabase.from("pets").insert(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pets"], exact: true });
      toast("💚 반려동물이 등록되었습니다", getToastOptions("success"));
    },
  });

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

  const selectGender = (gender: string) => {
    setSelectedGender(gender);

    setFormData((prev) => ({
      ...prev,
      gender,
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
      toast("💛 사진을 선택해 주세요", getToastOptions("warning"));
      return;
    }

    if (!formData.name) {
      setIsLoading(false);
      toast("💛 이름을 입력해 주세요", getToastOptions("warning"));
      return;
    }

    if (!["왕자", "공주", "중성"].includes(formData.gender)) {
      setIsLoading(false);
      toast("💛 성별을 선택해 주세요", getToastOptions("warning"));
      return;
    }

    if (formData.weight <= 0) {
      setIsLoading(false);
      toast(
        "💛 몸무게는 0보다 큰 값을 입력해 주세요",
        getToastOptions("warning")
      );
      return;
    }

    if (!formData.breed) {
      setIsLoading(false);
      toast("💛 품종을 입력해 주세요", getToastOptions("warning"));
      return;
    }

    if (!formData.comment) {
      setIsLoading(false);
      toast("💛 한 줄 소개를 입력해 주세요", getToastOptions("warning"));
      return;
    }

    if (!formData.birth) {
      setIsLoading(false);
      toast("💛 생일을 입력해 주세요", getToastOptions("warning"));
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
      toast("❤️ 사진을 업로드에 실패했습니다", getToastOptions("error"));
      return;
    }

    const petData = { ...formData, imageUrl: data.fullPath };

    // 슈파베이스에 반려동물 정보 등록
    createPet(petData as Pet);
    setFormData({
      weight: 0,
      gender: "",
      name: "",
      comment: "",
      breed: "",
      imageUrl: "",
      birth: "",
    });
    setIsLoading(false);
    setImageFile(null);
    setFormVisible(false);
    setImagePreviewUrl("");
  };

  return (
    <div className="text-center">
      {formVisible ? null : (
        <button
          onClick={() => setFormVisible(true)}
          className="text-2xl font-bold "
        >
          +
        </button>
      )}

      {formVisible && (
        <form onSubmit={handleSubmit} className="flex flex-col items-center">
          <h2 className="text-2xl">반려동물 등록</h2>

          {imagePreviewUrl && (
            <img
              src={imagePreviewUrl}
              alt="Preview"
              className="w-32 h-32 rounded-full object-cover my-4"
            />
          )}

          <label className="w-full my-4 p-3 border rounded-lg text-center">
            사진 첨부하기
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          {/* 이름 */}
          <input
            name="name"
            onChange={handleInputChange}
            value={formData.name}
            placeholder="이름"
            type="text"
            className="w-full p-3 border rounded-lg placeholder:text-BrownPoint"
          />

          {/* 품종 */}
          <input
            name="breed"
            onChange={handleInputChange}
            value={formData.breed}
            placeholder="품종"
            type="text"
            className="w-full p-3 my-4 border rounded-lg placeholder:text-BrownPoint"
          />

          {/* 성별 */}
          <div className="flex gap-x-4 w-full">
            <button
              type="button"
              className={`border px-8 py-3 rounded-lg hover:border-BrownPoint
                  ${selectedGender === "왕자" && "border-BrownPoint"}
                  transition`}
              onClick={() => selectGender("왕자")}
            >
              왕자
            </button>
            <button
              type="button"
              className={`border px-8 py-3 rounded-lg hover:border-BrownPoint
                  ${selectedGender === "공주" && "border-BrownPoint"}
                  transition`}
              onClick={() => selectGender("공주")}
            >
              공주
            </button>
            <button
              type="button"
              className={`border px-8 py-3 rounded-lg hover:border-BrownPoint
                  ${selectedGender === "중성" && "border-BrownPoint"}
                  transition`}
              onClick={() => selectGender("중성")}
            >
              중성
            </button>
          </div>

          {/* 몸무게, 생일 */}
          <div className="flex my-4 gap-x-4 w-full">
            <input
              name="weight"
              type="number"
              value={formData.weight}
              onChange={handleInputChange}
              placeholder="몸무게"
              className="border rounded-lg p-3 w-full placeholder:text-BrownPoint"
            />

            <input
              name="birth"
              type="date"
              value={formData.birth}
              onChange={handleInputChange}
              className="border rounded-lg p-3 w-full"
            />
          </div>

          {/* 한 줄 소개 */}
          <input
            name="comment"
            value={formData.comment}
            onChange={handleInputChange}
            type="text"
            placeholder="한 줄 소개"
            className="border rounded-lg mb-4 p-3 w-full placeholder:text-BrownPoint"
          />

          {/* 등록하기 버튼 */}
          <button
            type="submit"
            className="w-full p-3 border rounded-lg hover:border-BrownPoint "
            disabled={isLoading}
          >
            {isLoading ? (
              <FaSpinner className="animate-spin h-6 w-6 m-auto" />
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
