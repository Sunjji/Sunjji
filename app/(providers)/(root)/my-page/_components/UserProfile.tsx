/* eslint-disable @next/next/no-img-element */
import { supabase } from "@/supabase/client";
import dayjs from "dayjs";
import { nanoid } from "nanoid";
import { useCallback, useEffect, useRef, useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { IoIosMore } from "react-icons/io";
import { Bounce, toast } from "react-toastify";

interface Profile {
  id: string;
  nickname: string;
  comment: string;
  imageUrl: string;
  createdAt: string;
}

interface UserProfileProps {
  profile: Profile;
  updateProfile: (profile: Profile) => void;
}

function UserProfile({ profile, updateProfile }: UserProfileProps) {
  const succesToast = {
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
  const [isEditing, setIsEditing] = useState(false);
  const [nickname, setNickname] = useState(profile.nickname);
  const [comment, setComment] = useState(profile.comment);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showEditButton, setShowEditButton] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showEditButton && !target.closest(".edit-button-container")) {
        setShowEditButton(false);
      }
    },
    [showEditButton]
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleClickSave = async () => {
    setIsLoading(true);

    console.log(profile.id);

    const updatedProfile: {
      nickname: string;
      comment: string;
      imageUrl?: string;
      customImage?: boolean;
    } = { nickname, comment };

    if (imageFile) {
      const uniqueFileName = `${nanoid()}`;
      await supabase.storage
        .from("profile-image")
        .upload(uniqueFileName, imageFile);
      updatedProfile.imageUrl = `https://kudrchaizgkzyjzrkhhy.supabase.co/storage/v1/object/public/profile-image/${uniqueFileName}`;
      updatedProfile.customImage = true;
    }

    await supabase.from("profiles").update(updatedProfile).eq("id", profile.id);

    const newProfile: Profile = {
      id: profile.id,
      nickname: updatedProfile.nickname,
      comment: updatedProfile.comment,
      imageUrl: updatedProfile.imageUrl || profile.imageUrl,
      createdAt: profile.createdAt,
    };
    updateProfile(newProfile);

    setIsEditing(false);
    setPreviewUrl(null);
    setImageFile(null);
    setIsLoading(false);
    setShowEditButton(false);

    toast("💚 프로필이 수정되었습니다", successToast);
  };

  const handleEditClick = () => {
    setShowEditButton(true);
  };

  const handleConfirmEdit = () => {
    setIsEditing(true);
    setShowEditButton(false);
  };

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <>
      {!isEditing ? (
        <>
          <div className="bg-white shadow-lg rounded-lg px-3 py-5 max-w-sm relative">
            <div className="flex justify-center mb-4">
              <img
                className="w-32 h-32 object-cover inline rounded-xl"
                src={profile.imageUrl}
                alt="Profile"
              />
            </div>
            <p className="bg-white p-4 text-BrownPoint rounded-md shadow-md mb-2">
              이름: {profile.nickname}
            </p>
            <p className="bg-white p-4 rounded-md shadow-md pb-16">
              <h2 className="text-BrownPoint">집사 소개: {profile.comment}</h2>
            </p>
            <p className="bg-white p-4 text-BrownPoint mt-2 rounded-md shadow-md">
              계정 생성 날짜:{" "}
              {dayjs(profile.createdAt).format("YYYY년 MM월 DD일")}
            </p>
            <IoIosMore
              className="w-6 h-6 absolute top-3 right-4 cursor-pointer text-BrownPoint"
              onClick={handleEditClick}
            />
            {showEditButton && (
              <div className="edit-button-container absolute top-[10px] right-[-55px]">
                <button
                  className="text-BrownPoint bg-white border border-BrownPoint hover:bg-point rounded-md px-2 py-1"
                  onClick={handleConfirmEdit}
                >
                  수정하기
                </button>
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          <div className="bg-white shadow-lg rounded-lg p-3 py-5 max-w-sm">
            <div className="flex justify-center mb-4">
              <img
                className="w-32 h-32 object-cover inline rounded-xl"
                src={previewUrl || profile.imageUrl}
                alt="Profile"
              />
            </div>
            <div className="flex justify-center">
              <button
                className="px-4 py-1 w-full rounded-md shadow-lg hover:bg-gray-100 text-BrownPoint"
                onClick={handleImageClick}
              >
                사진 첨부하기
              </button>
              <input
                type="file"
                className="hidden"
                ref={fileInputRef}
                onChange={handleChangeFile}
              />
            </div>
            <p className="bg-white p-4 text-BrownPoint rounded-md shadow-md mb-2">
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="border p-2 rounded-lg w-full"
              />
            </p>
            <p className="bg-white p-4 rounded-md shadow-md">
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="border p-2 rounded-lg w-full text-BrownPoint"
              />
            </p>
            <p className="bg-white p-4 text-BrownPoint my-2 rounded-md shadow-md">
              계정 생성 날짜:{" "}
              {dayjs(profile.createdAt).format("YYYY년 MM월 DD일")}
            </p>
            <button
              className="px-4 py-1 w-full rounded-md shadow-lg hover:bg-gray-100 text-BrownPoint flex justify-center"
              onClick={handleClickSave}
              disabled={isLoading}
            >
              {isLoading ? (
                <FaSpinner className="animate-spin h-6 w-6 text-BrownPoint" />
              ) : (
                "저장"
              )}
            </button>
          </div>
        </>
      )}
    </>
  );
}

export default UserProfile;
