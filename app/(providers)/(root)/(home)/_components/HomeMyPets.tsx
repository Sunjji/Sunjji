"use client";

import api from "@/api/api";
import { useAuthStore } from "@/zustand/auth.store";
import { useQuery } from "@tanstack/react-query";
import MyAllPets from "./MyAllPets";

function HomeMyPets() {
  const profile = useAuthStore((state) => state.profile);
  const { data: myFirstPet, isLoading: isMyFirstPetLoading } = useQuery({
    queryKey: ["myFirstPet"],
    queryFn: api.pets.getMyFirstPet,
    enabled: !!profile,
  });
  const { data: myPets, isLoading: isMyPetsLoading } = useQuery({
    queryKey: ["myPets"],
    queryFn: api.pets.getMyPets,
    enabled: !!profile,
  });

  if (!profile) return;

  return (
    <div>
      <section>
        <div className="rounded-2xl bg-whitePoint p-5">
          {isMyFirstPetLoading ? (
            "대표펫을 불러오는 중..."
          ) : myFirstPet ? (
            <>
              <h6>{myFirstPet.name}과(와) 함께 한지</h6>
              <strong className="text-BrownPoint text-4xl">213일</strong>
            </>
          ) : (
            "아직 대표펫을 선택하지 않았어요!"
          )}
        </div>
        <div className="rounded-2xl bg-whitePoint p-5">
          {isMyFirstPetLoading ? (
            "대표펫을 불러오는 중..."
          ) : myFirstPet ? (
            <>
              <h6>{myFirstPet.name}의 생일</h6>
              <strong className="text-BrownPoint text-4xl">213일</strong>
            </>
          ) : (
            "아직 대표펫을 선택하지 않았어요!"
          )}
        </div>
      </section>

      <section>
        <div className="rounded-2xl bg-whitePoint p-5 h-full overflow-y-hidden">
          <h2 className="fixed">나의 반려동물</h2>
          {isMyPetsLoading ? (
            "내 반려동물들을 불러오는 중..."
          ) : (
            <MyAllPets pets={myPets} firstPetId={myFirstPet?.id} />
          )}
        </div>
      </section>
    </div>
  );
}

export default HomeMyPets;
