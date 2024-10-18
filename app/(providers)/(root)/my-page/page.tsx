/* eslint-disable @next/next/no-img-element */
"use client";

import { supabase } from "@/supabase/client";
import dayjs from "dayjs";
import { nanoid } from "nanoid";
import Link from "next/link";
import { useEffect, useState } from "react";
import AllPet from "../_components/AllPet";

type Profile = {
  id: string;
  nickname: string;
  createdAt: string;
  imageUrl: string;
  comment: string;
};

function MyPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [nickname, setNickname] = useState("");
  const [comment, setComment] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isProfileEditing, setIsProfileEditing] = useState(false);

  useEffect(() => {
    const getCurrentUser = async () => {
      // 슈파베이스에서 유저 정보 가져오기
      const response = await supabase.auth.getUser();
      const user = response.data.user;

      // 슈파베이스에서 유저와 연결된 프로필 가져오기
      const { data: profilesData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id);

      // 유저와 연결된 프로필을 화면에 띄우기
      if (profilesData) {
        setProfile(profilesData[0]);
        setNickname(profilesData[0].nickname);
        setComment(profilesData[0].comment);
      }
    };
    getCurrentUser();
  }, []);

  // 파일을 선택되면 이미지 파일 상태 업데이트
  const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleEditPetProfileButton = () => {
    setIsProfileEditing(true);
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
    await supabase
      .from("profiles")
      .update(updatedProfile)
      .eq("id", profile?.id);

    // 만든 프로필을 화면에 띄우기
    const newProfile = {
      id: profile?.id,
      nickname: updatedProfile.nickname,
      comment: updatedProfile.comment,
      imageUrl: updatedProfile.imageUrl || profile?.imageUrl,
    };
    setProfile(newProfile);
    setImageFile(null);

    // 수정 모드 해제
    setIsEditing(false);
  };

  // 수정 모드 전환
  const handleEditClick = () => {
    setIsEditing(true);
  };

  return (
    <main className="flex justify-center">
      <section className="bg-white p-5 mt-10">
        <h1 className="text-3xl mb-5 font-bold">마이 페이지</h1>
        {profile ? (
          <>
            {!isEditing ? (
              // 일반 모드
              <>
                <p className="text-xl">이름: {profile.nickname}</p>
                <img
                  className="w-32 inline rounded-xl"
                  src={profile.imageUrl}
                  alt="Profile"
                />
                <p className="text-xl">한 줄 소개: {profile.comment}</p>{" "}
                <p className="text-xl">
                  계정 생성 날짜:{" "}
                  {dayjs(profile.createdAt).format("YYYY년 MM월 DD일")}
                </p>
                {/* 사용자 정보 수정 버튼 */}
                <button
                  className="border border-black px-2 py-1 rounded-lg"
                  onClick={handleEditClick}
                >
                  사용자 정보 수정
                </button>
              </>
            ) : (
              // 수정 모드
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
                />{" "}
                <p className="text-xl">
                  계정 생성 날짜:{" "}
                  {dayjs(profile.createdAt).format("YYYY년 MM월 DD일")}
                </p>
                {/* 저장 버튼 */}
                <button
                  className="border border-black px-2 py-1 rounded-lg"
                  onClick={handleClickSave}
                >
                  저장
                </button>
              </>
            )}

            {isProfileEditing ? (
              <>
                <Link href={"/profile/petprofile"}>
                  <button className="border border-black px-2 py-1 rounded-lg">
                    펫 프로필 추가등록
                  </button>
                </Link>
              </>
            ) : (
              <>
                <Link href={"/profile/petprofile"}>
                  <button
                    className="border border-black px-2 py-1 rounded-lg"
                    onClick={handleEditPetProfileButton}
                  >
                    펫 프로필 등록
                  </button>
                </Link>
              </>
            )}
          </>
        ) : (
          // 로딩 중
          <p>사용자 정보를 불러오는 중입니다...</p>
        )}
        <AllPet />
      </section>
    </main>
  );
}

export default MyPage;
