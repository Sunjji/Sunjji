/* eslint-disable @next/next/no-img-element */
"use client";

import { supabase } from "@/supabase/client";
import dayjs from "dayjs";
import { nanoid } from "nanoid";
import { useState } from "react";

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

  // 파일을 선택되면 이미지 파일 상태 업데이트
  const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  // 저장 버튼을 누르면
  const handleClickSave = async () => {
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
    const newProfile = {
      id: profile.id,
      nickname: updatedProfile.nickname,
      comment: updatedProfile.comment,
      imageUrl: updatedProfile.imageUrl || profile.imageUrl,
    };
    updateProfile(newProfile);

    // 수정 모드 해제
    setIsEditing(false);
  };

  // 수정 모드 전환
  const handleEditClick = () => {
    setIsEditing(true);
  };

  return (
    <>
      {!isEditing ? (
        <>
          <p className="text-xl">이름: {profile.nickname}</p>
          <img
            className="w-32 inline rounded-xl"
            src={profile.imageUrl}
            alt="Profile"
          />
          <p className="text-xl">한 줄 소개: {profile.comment}</p>
          <p className="text-xl">
            계정 생성 날짜:{" "}
            {dayjs(profile.createdAt).format("YYYY년 MM월 DD일")}
          </p>
          <button
            className="border border-black px-2 py-1 rounded-lg"
            onClick={handleEditClick}
          >
            사용자 정보 수정
          </button>
        </>
      ) : (
        <>
          <label className="text-xl float-left">이름: </label>
          <input
            className="border p-2 block"
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
          <img
            className="w-32 block rounded-xl"
            src={profile.imageUrl}
            alt="Profile"
          />
          <p className="text-xl">프로필 사진 변경</p>
          <input
            className="border p-2 block"
            type="file"
            onChange={handleChangeFile}
          />
          <label className="text-xl float-left">한 줄 소개: </label>
          <input
            className="border p-2 block"
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <p className="text-xl">
            계정 생성 날짜:{" "}
            {dayjs(profile.createdAt).format("YYYY년 MM월 DD일")}
          </p>
          <button
            className="border border-black px-2 py-1 rounded-lg"
            onClick={handleClickSave}
          >
            저장
          </button>
        </>
      )}
    </>
  );
}

export default UserProfile;
