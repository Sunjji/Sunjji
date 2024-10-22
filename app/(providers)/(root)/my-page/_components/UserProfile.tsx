import { supabase } from "@/supabase/client";
import dayjs from "dayjs";
import { nanoid } from "nanoid";
import { useRef, useState } from "react";
import { FaSpinner } from "react-icons/fa";

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

  const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleClickSave = async () => {
    setIsLoading(true);

    const updatedProfile: {
      nickname: string;
      comment: string;
      imageUrl?: string;
    } = { nickname, comment };

    if (imageFile) {
      const uniqueFileName = `${nanoid()}`;
      await supabase.storage
        .from("profile-image")
        .upload(uniqueFileName, imageFile);
      updatedProfile.imageUrl = `https://kudrchaizgkzyjzrkhhy.supabase.co/storage/v1/object/public/profile-image/${uniqueFileName}`;
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

    alert("수정되었습니다");
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setPreviewUrl(null);
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
          <div className="bg-white shadow-lg rounded-lg p-6 max-w-sm">
            <div className="flex justify-center mb-4">
              <img
                className="w-32 h-32 object-cover inline rounded-xl"
                src={profile.imageUrl}
                alt="Profile"
              />
            </div>
            <p className="bg-white p-4 text-gray-500 rounded-md shadow-lg mb-2">
              이름: {profile.nickname}
            </p>
            <p className="bg-white p-4 rounded-md shadow-lg pb-16">
              <h2 className="text-gray-500">집사 소개: {profile.comment}</h2>
            </p>
            <p className="bg-white p-4 text-gray-500 mt-2 rounded-md shadow-lg">
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
          <div className="bg-white shadow-lg rounded-lg p-6 max-w-sm">
            <div className="flex justify-center mb-4">
              <img
                className="w-32 h-32 object-cover inline rounded-xl"
                src={previewUrl || profile.imageUrl}
                alt="Profile"
              />
            </div>
            <div className="flex justify-center">
              <button
                className="px-4 py-1 w-full rounded-md shadow-lg hover:bg-gray-100"
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
            <p className="bg-white p-4 text-gray-500 rounded-md shadow-lg mb-2">
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="border p-2 rounded-lg w-full"
              />
            </p>
            <p className="bg-white p-4 rounded-md shadow-lg pb-16">
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="border p-2 rounded-lg w-full text-gray-500"
              />
            </p>
            <p className="bg-white p-4 text-gray-500 mt-2 rounded-md shadow-lg">
              계정 생성 날짜:{" "}
              {dayjs(profile.createdAt).format("YYYY년 MM월 DD일")}
            </p>
          </div>
          <button
            className="border border-black px-4 py-1 rounded-lg hover:bg-gray-100"
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
