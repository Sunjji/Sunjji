"use client";

import api from "@/api/api";
import { useAuthStore } from "@/zustand/auth.store";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import MyAllPets from "./MyAllPets";
dayjs.extend(relativeTime);

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

  const daysCountToFirstPetBirthDay = dayjs().to(dayjs(myFirstPet?.birth));

  if (!profile) return <div></div>;

  return (
    <div className="grid grid-rows-4 gap-10">
      <section className="rounded-2xl bg-whitePoint p-5 h-full flex flex-col justify-between">
        {isMyFirstPetLoading ? (
          "대표펫을 불러오는 중..."
        ) : myFirstPet ? (
          <>
            <h6>{myFirstPet.name}와(과) 함께 한지</h6>
            <strong className="text-BrownPoint text-5xl self-center">
              213일
            </strong>
          </>
        ) : (
          "아직 대표펫을 선택하지 않았어요!"
        )}
      </section>

      <section className="rounded-2xl bg-whitePoint p-5 h-full flex flex-col justify-between">
        {isMyFirstPetLoading ? (
          "대표펫을 불러오는 중..."
        ) : myFirstPet ? (
          <>
            <h6>{myFirstPet.name}의 생일</h6>
            <strong className="text-BrownPoint text-5xl self-center">
              {daysCountToFirstPetBirthDay}
            </strong>
          </>
        ) : (
          "아직 대표펫을 선택하지 않았어요!"
        )}
      </section>

      <section className="row-span-2 rounded-2xl bg-whitePoint p-5 h-full overflow-y-hidden">
        <h6>나의 반려동물들</h6>

        {isMyPetsLoading ? (
          "내 반려동물들을 불러오는 중..."
        ) : (
          <MyAllPets pets={myPets} firstPetId={myFirstPet?.id} />
        )}
      </section>
    </div>
  );
}

export default HomeMyPets;
