"use client";

import { Dispatch, SetStateAction } from "react";

type IsPublicToggleProps = {
  isPublic: boolean;
  setIsPublic: Dispatch<SetStateAction<boolean>>;
};

function IsPublicToggle({ isPublic, setIsPublic }: IsPublicToggleProps) {
  // 공개/비공개 버튼
  const handleToggleIsPublic = async () => {
    if (isPublic) {
      setIsPublic(false);
    } else {
      setIsPublic(true);
    }
  };
  return (
    <button
      type="button"
      onClick={handleToggleIsPublic}
      className="flex gap-x-5"
    >
      <div
        className={`${
          isPublic ? "bg-blue-500" : "bg-gray-500"
        } w-14 h-7 rounded-3xl`}
      >
        <div
          className={`flex items-center bg-white w-5 h-5 m-1  rounded-3xl ${
            isPublic ? "ml-auto" : null
          } transition`}
        ></div>
      </div>
      <p className={`${isPublic ? "text-red-500" : "text-black"}`}>
        {isPublic ? "공개 일기" : "비공개 일기"}
      </p>
    </button>
  );
}

export default IsPublicToggle;
