"use client";
import api from "@/api/api";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { FaWheelchair } from "react-icons/fa";

const MyFirstPetLoad = ({ profilesData, setFirstPetId, firstPetId }) => {
  const { data: profilesData } = useQuery({
    queryKey: ["profiles", { firstPetId }],
    queryFn: () => api.pets.getMyFirstPet(firstPetId!),
    enabled: !!firstPetId, // firstPetId가 있을 때만 쿼리 실행
  });

  useEffect(() => {
    if (profilesData && profilesData.length > 0) {
      const firstPet = profilesData[0]; // 첫 번째 반려동물 데이터
      if (firstPet) {
        setFirstPetId(firstPet.id); // firstPetId 설정
      }
    }
  }, [profilesData, setFirstPetId]);

  return (
    <>
      {firstPetId && <FaWheelchair />} {/* 아이콘을 조건부로 표시 */}
    </>
  );
};

export default MyFirstPetLoad;
