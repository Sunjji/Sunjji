/* eslint-disable @next/next/no-img-element */
"use client";

import { supabase } from "@/supabase/client";
import dayjs from "dayjs";
import { nanoid } from "nanoid";
import { useRef, useState } from "react";
import { FaArrowRight, FaSpinner } from "react-icons/fa";

type Profile = {
  id: string;
  nickname: string;
  createdAt: string;
  imageUrl: string;
  comment: string;
};

interface UserProfileProps {
  profile: Profile;
  updateProfile: (profile: Profile) => void;
}

function UserProfile({ profile, updateProfile }: UserProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [nickname, setNickname] = useState(profile.nickname);
  const [comment, setComment] = useState(profile.comment);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // 파일을 선택하면 이미지 파일 상태 및 미리보기 URL 업데이트
  const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // 이미지 또는 이미지 없음 클릭 시 파일 선택 창 열기
  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // 저장 버튼을 누르면
  const handleClickSave = async () => {
    // 로딩 시작
    setIsLoading(true);

    const updatedProfile: {
      nickname: string;
      comment: string;
      imageUrl?: string;
    } = { nickname, comment };

    // 이미지 파일 스토리지에 업로드
    if (imageFile) {
      const uniqueFileName = `${nanoid()}`;
      await supabase.storage
        .from("profile-image")
        .upload(uniqueFileName, imageFile);
      updatedProfile.imageUrl = `https://kudrchaizgkzyjzrkhhy.supabase.co/storage/v1/object/public/profile-image/${uniqueFileName}`;
    }

    // 만든 프로필을 슈파베이스에 보내기
    await supabase.from("profiles").update(updatedProfile).eq("id", profile.id);

    // 화면에 프로필 업데이트
    const newProfile: Profile = {
      id: profile.id,
      nickname: updatedProfile.nickname,
      comment: updatedProfile.comment,
      imageUrl: updatedProfile.imageUrl || profile.imageUrl,
      createdAt: profile.createdAt,
    };
    updateProfile(newProfile);

    // 수정 모드 해제 및 상태 초기화
    setIsEditing(false);
    setPreviewUrl(null);
    setImageFile(null);
    // 로딩 끝
    setIsLoading(false);

    alert("수정되었습니다");
  };

  // 수정 모드 전환
  const handleEditClick = () => {
    setIsEditing(true);
  };

  // 이미지 삭제
  const handleRemoveImage = () => {
    setImageFile(null);
    setPreviewUrl(null);
  };

  return (
    <>
      {!isEditing ? (
        <>
          <div className="flex flex-col items-start mb-4 space-y-4">
            <p className="text-xl w-full">이름: {profile.nickname}</p>
            <img
              className="w-32 h-32 object-cover inline rounded-xl"
              src={profile.imageUrl}
              alt="Profile"
            />
            <p className="text-xl w-full">한 줄 소개: {profile.comment}</p>
            <p className="text-xl w-full">
              계정 생성 날짜:{" "}
              {dayjs(profile.createdAt).format("YYYY년 MM월 DD일")}
            </p>
          </div>
          <button
            className="border border-black px-4 py-1 rounded-lg hover:bg-gray-100"
            onClick={handleEditClick}
          >
            사용자 정보 수정
          </button>
        </>
      ) : (
        <>
          <div className="flex flex-col items-start mb-4 space-y-4 w-full">
            <div className="flex items-center w-full">
              <label className="text-xl w-32">이름: </label>
              <input
                className="border p-2 flex-1"
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
              />
            </div>
            <div className="relative flex items-center w-full">
              <img
                className="w-32 h-32 object-cover block rounded-xl"
                src={profile.imageUrl}
                alt="Profile"
              />
              <FaArrowRight className="mx-4 h-10 w-10 text-gray-400" />
              {previewUrl ? (
                <div className="relative">
                  <img
                    className="w-32 h-32 object-cover block rounded-xl cursor-pointer"
                    src={previewUrl}
                    alt="New Profile Preview"
                    onClick={handleImageClick}
                  />
                  <button
                    onClick={handleRemoveImage}
                    className="absolute top-[-5px] right-[-5px] font-bold bg-red-500 text-white hover:bg-red-700 hover:text-red-200 rounded-md w-7 h-7 text-xl flex items-center justify-center"
                  >
                    X
                  </button>
                </div>
              ) : (
                <div
                  className="w-32 h-32 border-4 border-dashed border-gray-400 flex justify-center items-center rounded-xl cursor-pointer"
                  onClick={handleImageClick}
                >
                  <span className="text-gray-500">이미지 없음</span>
                  <input
                    className="hidden"
                    type="file"
                    ref={fileInputRef}
                    onChange={handleChangeFile}
                  />
                </div>
              )}
            </div>
            <div className="flex items-center w-full">
              <label className="text-xl w-32">한 줄 소개: </label>
              <input
                className="border p-2 flex-1"
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>
          </div>
          <p className="text-xl w-full">
            계정 생성 날짜:{" "}
            {dayjs(profile.createdAt).format("YYYY년 MM월 DD일")}
          </p>
          <button
            className="border border-black px-3 py-1 rounded-lg mt-4 hover:bg-gray-100 inline-flex items-center justify-center"
            onClick={handleClickSave}
            disabled={isLoading}
          >
            {isLoading ? (
              <FaSpinner className="animate-spin h-6 w-6 text-gray-500" />
            ) : (
              "저장"
            )}
          </button>
        </>
      )}
    </>
  );
}

export default UserProfile;
