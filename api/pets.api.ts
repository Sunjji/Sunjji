"use client";

import { supabase } from "@/supabase/client";
import { useAuthStore } from "@/zustand/auth.store";

async function getMyPets() {
  const myProfile = useAuthStore.getState().profile;
  console.log("myProfile", myProfile);
  if (!myProfile) return [];

  const { data: myPets } = await supabase
    .from("pets")
    .select()
    .eq("butlerId", myProfile.id);

  return myPets;
}

async function deleteMyPets(petId: number) {
  await supabase.from("pets").delete().eq("id", petId);
}

async function getMyFirstPet() {
  const myProfile = useAuthStore.getState().profile;
  if (!myProfile) return;

  const firstPetId = myProfile.firstPetId;
  if (!firstPetId) return null;

  const { data: firstPet } = await supabase
    .from("pets")
    .select("*")
    .eq("id", firstPetId)
    .eq("butlerId", myProfile.id)
    .single();

  return firstPet;
}

const petsApi = {
  getMyPets,
  deleteMyPets,
  getMyFirstPet,
  //따른 API추가예정
};

export default petsApi;
