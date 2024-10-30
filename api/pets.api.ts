import { supabase } from "@/supabase/client";

async function getMyPets(currentUserId: string) {
  console.log(currentUserId);
  const { data: myPets } = await supabase
    .from("pets")
    .select()
    .eq("butlerId", currentUserId);

  return myPets;
}

async function deleteMyPets(petId: number) {
  await supabase.from("pets").delete().eq("id", petId);
}

async function getMyFirstPet(currentUserId: string) {
  const firstPet = await supabase
    .from("profiles")
    .select("firstPetId")
    .eq("id", currentUserId);

  return firstPet;
}

async function getMyFirstPetBirth(currentUserId: string) {
  const firstPetBirth = await supabase
    .from("pets")
    .select("birth")
    .eq("id", currentUserId)
    .single();

  return firstPetBirth;
}

const petsApi = {
  getMyPets,
  deleteMyPets,
  getMyFirstPet,
  getMyFirstPetBirth,
  //따른 API추가예정
};

export default petsApi;
