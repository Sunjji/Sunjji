"use client";

import Link from "next/link";
import React, { useState } from "react";

function PetProfile() {
  const [isPetProfileEditing, setIsProfileEditing] = useState(false);
  const handleEditPetProfileButton = () => {
    setIsProfileEditing(true);
  };
  return (
    <>
      {isPetProfileEditing ? (
        <Link href={"/pets"}>
          <button className="border border-black px-2 py-1 rounded-lg">
            반려동물 프로필 추가등록
          </button>
        </Link>
      ) : (
        <Link href={"/pets"}>
          <button
            className="border border-black px-2 py-1 rounded-lg"
            onClick={handleEditPetProfileButton}
          >
            반려동물 프로필 등록
          </button>
        </Link>
      )}
    </>
  );
}

export default PetProfile;
