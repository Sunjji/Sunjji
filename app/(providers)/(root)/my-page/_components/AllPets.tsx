/* eslint-disable @next/next/no-img-element */
"use client";

import api from "@/api/api";
import { supabase } from "@/supabase/client";
import { Pet } from "@/types/type";
import { useAuthStore } from "@/zustand/auth.store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { nanoid } from "nanoid";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import MyFirstPetSelectButton from "../../(home)/_components/MyFirstPetSelectButton";
import { getToastOptions } from "../../_components/getToastOptions";
import PetProfile from "./PetProfile";

function AllPets() {
  const queryClient = useQueryClient();
  const currentUserId = useAuthStore((state) => state.currentUserId);

  const [isClicked, setIsClicked] = useState(false);
  const [editStyle, setEditStyle] = useState(0);
  const [selectedGender, setSelectedGender] = useState("");
  const setFirstPetIdState = useAuthStore((state) => state.setFirstPetIdState);

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
    queryFn: () => api.pets.getMyPets(),
  });

  const handleClickDeletePets = (petId: number) => {
    deletePets(petId);
    toast("💚 반려동물이 삭제 되었습니다", getToastOptions("success"));
  };

  const [editingPetId, setEditingPetId] = useState<number | null>(null);
  const [formState, setFormState] = useState({
    weight: 1,
    gender: "",
    name: "",
    comment: "",
    breed: "",
    imageFile: undefined as File | undefined,
    imageUrl: "",
    birth: "",
  });

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

  const selectGender = (gender: string) => {
    setSelectedGender(gender);
    setFormState((prev) => ({
      ...prev,
      gender,
    }));
  };

  const handlePetSelect = (petId: number) => {
    setFirstPetIdState(petId);
  };

  const handleEditClick = (pet: Pet) => {
    setEditStyle(pet.id);
    setEditingPetId(pet.id);
    setFormState({
      weight: pet.weight,
      gender: pet.gender,
      name: pet.name,
      comment: pet.comment,
      breed: pet.breed,
      birth: pet.birth,
      imageFile: undefined,
      imageUrl: pet.imageUrl,
    });
  };

  const [warning, setWarning] = useState("");

  const warningFocus = (what: string) => {
    if (what === "이름") setWarning("이름");
    if (what === "품종") setWarning("품종");
    if (what === "성별") setWarning("성별");
    if (what === "몸무게") setWarning("몸무게");
    if (what === "생일") setWarning("생일");
    if (what === "한 줄 소개") setWarning("한 줄 소개");
  };
  const warningBlur = () => {
    setWarning("");
  };

  return (
    <div className="overflow-y-auto h-[410px] grid gap-4 text-BrownPoint text-sm text-center">
      {pets?.map((pet) => (
        <div
          key={pet.id}
          className={`cursor-pointer
          ${
            editStyle === pet.id && editingPetId !== null
              ? "col-end-2 row-start-1"
              : "col-end-1"
          }
          `}
        >
          {/* pet card */}
          <div
            className="flex gap-x-4 items-center border rounded-lg p-4 w-[320px] bg-white"
            onClick={() => handleEditClick(pet)}
          >
            <img
              className="w-10 h-10 object-cover rounded-full"
              src={`https://kudrchaizgkzyjzrkhhy.supabase.co/storage/v1/object/public/${pet.imageUrl}`}
              alt={pet.name}
            />
            <div className="text-left">
              <p>
                {pet.name} · {pet.breed} · {pet.gender}
              </p>
              <p>{pet.weight}kg</p>
            </div>

            {!isClicked && (
              <div className="ml-auto">
                <MyFirstPetSelectButton
                  petId={pet.id}
                  onSelect={handlePetSelect}
                />
              </div>
            )}
          </div>
        </div>
      ))}

      {/* pet edit */}
      {pets?.map((pet) => (
        <>
          {editingPetId === pet.id && (
            <form
              className="col-end-1 row-start-2 flex flex-col rounded-lg items-center border p-4 w-[320px] bg-white"
              onSubmit={(e) => handleFormSubmit(e, pet.id)}
            >
              <h2 className="text-2xl ">반려동물 프로필 수정</h2>
              {formState.imageUrl && (
                <img
                  src={`https://kudrchaizgkzyjzrkhhy.supabase.co/storage/v1/object/public/${formState.imageUrl}`}
                  alt={pet.name}
                  className="w-32 h-32 rounded-full object-cover my-4"
                />
              )}
              <label htmlFor="image" className="w-full p-3 border rounded-lg">
                사진 수정하기
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
              <div className="my-2">{warning === "이름" && warning}</div>
              <input
                value={formState.name}
                onChange={(e) =>
                  setFormState((prev) => ({ ...prev, name: e.target.value }))
                }
                name="name"
                type="text"
                placeholder="이름"
                className="w-full p-3 border rounded-lg placeholder:text-BrownPoint"
                onFocus={() => warningFocus("이름")}
                onBlur={warningBlur}
              />

              {/* 품종 */}
              <div className="my-2">{warning === "품종" && warning}</div>

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
                className="w-full p-3 border rounded-lg placeholder:text-BrownPoint"
                onFocus={() => warningFocus("품종")}
                onBlur={warningBlur}
              />

              {/* 성별 */}
              <div className="my-2">{warning === "성별" && warning}</div>
              <div
                className="flex gap-x-4 w-full"
                onFocus={() => warningFocus("성별")}
                onBlur={warningBlur}
              >
                <button
                  type="button"
                  className={`border px-8 py-3 rounded-lg hover:border-BrownPoint
                  ${selectedGender === "왕자" && "border-BrownPoint"}
                  transition`}
                  onClick={() => selectGender("왕자")}
                >
                  왕자
                </button>
                <button
                  type="button"
                  className={`border px-8 py-3 rounded-lg hover:border-BrownPoint
                  ${selectedGender === "공주" && "border-BrownPoint"}
                  transition`}
                  onClick={() => selectGender("공주")}
                >
                  공주
                </button>
                <button
                  type="button"
                  className={`border px-8 py-3 rounded-lg hover:border-BrownPoint
                  ${selectedGender === "중성" && "border-BrownPoint"}
                  transition`}
                  onClick={() => selectGender("중성")}
                >
                  중성
                </button>
              </div>

              {/* 몸무게, 생일 */}
              <div className="my-2">
                {(warning === "몸무게" && warning) ||
                  (warning === "생일" && warning)}
              </div>
              <div className="flex gap-x-4 w-full">
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
                  className="border rounded-lg p-3 w-full"
                  onFocus={() => warningFocus("몸무게")}
                  onBlur={warningBlur}
                />

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
                  className="border rounded-lg p-3 w-full"
                  onFocus={() => warningFocus("생일")}
                  onBlur={warningBlur}
                />
              </div>

              {/* 한 줄 소개 */}
              <div className="my-2">{warning === "한 줄 소개" && warning}</div>

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
                className="border rounded-lg mb-4 p-3 w-full placeholder:text-BrownPoint"
                onFocus={() => warningFocus("한 줄 소개")}
                onBlur={warningBlur}
              />

              {/* 수정, 삭제 */}
              <div className="flex gap-x-4 w-full">
                <button className="w-full p-3 border rounded-lg" type="submit">
                  수정하기
                </button>
                <button
                  className="w-full p-3 border rounded-lg"
                  type="button"
                  onClick={() => setEditingPetId(null)}
                >
                  취소
                </button>
              </div>
            </form>
          )}
        </>
      ))}

      <div className="col-end-1 w-[320px] border rounded-lg py-2 bg-white">
        <PetProfile />
      </div>
    </div>
  );
}

export default AllPets;
