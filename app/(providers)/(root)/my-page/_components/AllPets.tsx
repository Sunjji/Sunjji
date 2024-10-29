/* eslint-disable @next/next/no-img-element */
"use client";

import api from "@/api/api";
import { supabase } from "@/supabase/client";
import { Pet } from "@/types/type";
import { useAuthStore } from "@/zustand/auth.store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { nanoid } from "nanoid";
import { useCallback, useEffect, useState } from "react";
import { IoIosMore } from "react-icons/io";
import { toast } from "react-toastify";
import { getToastOptions } from "../../_components/getToastOptions";
import PetProfile from "./PetProfile";

function AllPets() {
  const queryClient = useQueryClient();
  const currentUserId = useAuthStore((state) => state.currentUserId);

  const [isClicked, setIsClicked] = useState(false);
  const [selectedGender, setSelectedGender] = useState("");
  const [warning, setWarning] = useState("");
  const [petId, setPetId] = useState(0);

  const { mutate: deletePets } = useMutation({
    mutationFn: api.pets.deleteMyPets,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["pets"], exact: true }),
    mutationKey: ["deletePets"],
  });

  const { mutate: updatePet } = useMutation({
    mutationFn: async ({ id, ...data }: { id: number } & Partial<Pet>) => {
      const response = await supabase.from("pets").update(data).eq("id", id);
      return response.data;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["pets"], exact: true }),
    mutationKey: ["updatePets"],
  });

  const { data: pets = [] } = useQuery({
    queryKey: ["pets"],
    enabled: !!currentUserId,
    queryFn: () => api.pets.getMyPets(currentUserId!),
  });

  const handleClickDeletePets = (petId: number) => {
    deletePets(petId);
    toast("💚 반려동물이 삭제 되었습니다", getToastOptions("success"));
  };

  const [editingPetId, setEditingPetId] = useState<number | null>(null);
  const [formState, setFormState] = useState({
    weight: 1,
    age: 1,
    gender: "",
    name: "",
    comment: "",
    breed: "",
    imageFile: undefined as File | undefined,
    imageUrl: "",
    birth: "", // 생일 필드 추가
  });

  const handleEditClick = (pet: Pet) => {
    setEditingPetId(pet.id);
    setFormState({
      weight: pet.weight,
      age: pet.age,
      gender: pet.gender,
      name: pet.name,
      comment: pet.comment,
      breed: pet.breed,
      birth: pet.birth,
      imageFile: undefined,
      imageUrl: pet.imageUrl,
    });
  };

  const handleFormSubmit = async (e: React.FormEvent, petId: number) => {
    e.preventDefault();

    let imageFixPath = formState.imageUrl;

    if (formState.imageFile) {
      const extension = formState.imageFile.name.split(".").pop();
      const filename = `${nanoid()}.${extension}`;
      const { data, error } = await supabase.storage
        .from("pets")
        .upload(filename, formState.imageFile, { upsert: true });

      if (error) {
        return toast(
          "❤️ 반려동물 사진이 수정되지 않았습니다",
          getToastOptions("error")
        );
      }

      imageFixPath = data?.fullPath || "";
    }

    const updatedPet: Partial<Pet> = {
      weight: formState.weight,
      age: formState.age,
      gender: formState.gender,
      name: formState.name,
      comment: formState.comment,
      breed: formState.breed,
      birth: formState.birth,
      imageUrl: imageFixPath,
    };

    updatePet({ id: petId, ...updatedPet });
    setEditingPetId(null);
    toast("💚 프로필 수정이 완료되었습니다", getToastOptions("success"));
  };

  // 수정, 삭제 버튼이 아닌 곳을 클릭했을 때 수정, 삭제 버튼 사라지게 만들기
  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        isClicked &&
        !target.closest(".edit-button-container") &&
        !target.closest(".edit-button")
      ) {
        setIsClicked(false);
      }
    },
    [isClicked]
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  const handlePetOptions = (petId: number) => {
    setPetId(petId);
    setIsClicked(true);
  };

  const selectGender = (gender: string) => {
    if (gender === "왕자") {
      setSelectedGender("왕자");
      setFormState((prev) => ({
        ...prev,
        gender: "왕자",
      }));
    } else if (gender === "공주") {
      setSelectedGender("공주");

      setFormState((prev) => ({
        ...prev,
        gender: "공주",
      }));
    } else {
      setSelectedGender("중성");
      setFormState((prev) => ({
        ...prev,
        gender: "중성",
      }));
    }
  };

  const handleFocus = (inputName: string) => {
    inputName === "weight" && setWarning("몸무게");
    inputName === "age" && setWarning("나이");
  };
  const handleBlur = () => {
    setWarning("");
  };

  return (
    <div className="grid grid-cols-1 gap-4">
      {pets?.map((pet) =>
        editingPetId === pet.id ? (
          <form
            key={pet.id}
            className="flex flex-col rounded-lg items-center border p-4 w-[350px] row-span-3 lg:col-span-1"
            onSubmit={(e) => handleFormSubmit(e, pet.id)}
          >
            <h2 className="text-xl">반려동물 프로필 수정</h2>
            {formState.imageUrl && (
              <img
                src={`https://kudrchaizgkzyjzrkhhy.supabase.co/storage/v1/object/public/${formState.imageUrl}`}
                alt={pet.name}
                className="w-32 h-32 rounded-full object-cover my-4"
              />
            )}
            <label
              htmlFor="image"
              className="w-[350px] block mt-2 p-2 border rounded-lg text-BrownPoint text-center text-sm"
            >
              사진 첨부하기
              <input
                id="image"
                name="image"
                type="file"
                className="hidden"
                onChange={(e) =>
                  setFormState((prev) => ({
                    ...prev,
                    imageFile: e.target.files?.[0],
                  }))
                }
              />
            </label>

            {/* 이름 */}
            <input
              value={formState.name}
              onChange={(e) =>
                setFormState((prev) => ({ ...prev, name: e.target.value }))
              }
              name="name"
              type="text"
              placeholder="이름"
              className="w-[350px] block p-2 mt-4 border rounded-lg text-BrownPoint text-sm placeholder:text-BrownPoint"
            />
            {/* 성별 */}
            <div className="flex gap-x-4 my-4">
              <button
                type="button"
                className={`border px-4 py-2 rounded-lg hover:border-BrownPoint
                  ${selectedGender === "왕자" && "border-BrownPoint"}
                  transition`}
                onClick={() => selectGender("왕자")}
              >
                왕자
              </button>
              <button
                type="button"
                className={`border px-4 py-2 rounded-lg hover:border-BrownPoint
                  ${selectedGender === "공주" && "border-BrownPoint"}
                  transition`}
                onClick={() => selectGender("공주")}
              >
                공주
              </button>
              <button
                type="button"
                className={`border px-4 py-2 rounded-lg hover:border-BrownPoint
                  ${selectedGender === "중성" && "border-BrownPoint"}
                  transition`}
                onClick={() => selectGender("중성")}
              >
                중성
              </button>
            </div>

            {/* 몸무게, 나이 */}
            {warning === "몸무게" && (
              <div className="text-red-500 mb-4">몸무게를 적어주세요</div>
            )}
            {warning === "나이" && (
              <div className="text-red-500 mb-4">나이를 적어주세요</div>
            )}
            <div className="grid grid-cols-2 items-center text-BrownPoint text-sm gap-x-4 w-[350px]">
              <input
                value={formState.weight}
                onChange={(e) =>
                  setFormState((prev) => ({
                    ...prev,
                    weight: Number(e.target.value),
                  }))
                }
                name="weight"
                type="number"
                className="w-[350px] flex items-center p-2 border rounded-lg"
                onFocus={() => handleFocus("weight")}
                onBlur={() => handleBlur()}
              />

              <input
                value={formState.age}
                onChange={(e) =>
                  setFormState((prev) => ({
                    ...prev,
                    age: Number(e.target.value),
                  }))
                }
                name="age"
                type="number"
                className="w-[350px] flex items-center p-2 border rounded-lg"
                onFocus={() => handleFocus("age")}
                onBlur={() => handleBlur()}
              />
            </div>
            {/* 품종 */}
            <input
              value={formState.breed}
              onChange={(e) =>
                setFormState((prev) => ({
                  ...prev,
                  breed: e.target.value,
                }))
              }
              name="breed"
              type="text"
              placeholder="품종"
              className="w-[350px] block my-4 p-2 border rounded-lg text-BrownPoint text-sm placeholder:text-BrownPoint"
            />
            {/* 한 줄 소개 */}
            <input
              value={formState.comment}
              onChange={(e) =>
                setFormState((prev) => ({
                  ...prev,
                  comment: e.target.value,
                }))
              }
              name="comment"
              type="text"
              placeholder="한 줄 소개"
              className="w-[350px] block p-2 border rounded-lg text-BrownPoint text-sm placeholder:text-BrownPoint"
            />
            {/* 생일 */}
            <input
              value={formState.birth}
              onChange={(e) =>
                setFormState((prev) => ({
                  ...prev,
                  birth: e.target.value,
                }))
              }
              name="birth"
              type="date"
              className="w-[350px] block my-4 p-2 border rounded-lg text-BrownPoint text-sm"
            />

            {/* 수정, 삭제 */}
            <div className="flex gap-x-4 w-[350px]">
              <button
                className="w-[350px] block p-2 border rounded-lg text-BrownPoint text-sm"
                type="submit"
              >
                수정하기
              </button>
              <button
                className="w-[350px] block p-2 border rounded-lg text-BrownPoint text-sm"
                type="button"
                onClick={() => setEditingPetId(null)}
              >
                취소
              </button>
            </div>
          </form>
        ) : (
          <div
            key={pet.id}
            className="flex gap-x-4 items-center border rounded-lg p-4 w-[350px] col-span-3 lg:col-span-1"
          >
            <img
              className="w-10 h-10 object-cover rounded-full"
              src={`https://kudrchaizgkzyjzrkhhy.supabase.co/storage/v1/object/public/${pet.imageUrl}`}
              alt={pet.name}
            />
            <div>
              <p>
                {pet.name} · {pet.gender}
              </p>
              <p>
                {pet.weight}kg / {pet.age}개월
              </p>
            </div>

            {isClicked && petId === pet.id ? (
              <div className="edit-button flex justify-between gap-4 ml-auto">
                <button
                  className="border border-black px-2 py-1 rounded-lg"
                  onClick={() => handleEditClick(pet)}
                >
                  수정
                </button>
                <button
                  className="border border-black px-2 py-1 rounded-lg"
                  onClick={() => handleClickDeletePets(pet.id)}
                >
                  삭제
                </button>
              </div>
            ) : (
              <IoIosMore
                className="w-6 h-6 ml-auto cursor-pointer text-BrownPoint"
                onClick={() => handlePetOptions(pet.id)}
              />
            )}
          </div>
        )
      )}
      <div className="w-[350px] border rounded-lg p-4 col-span-3 lg:col-span-1">
        <PetProfile />
      </div>
    </div>
  );
}

export default AllPets;
