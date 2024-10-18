import { supabase } from "@/supabase/client";

async function getMyPets(currentUserId: string) {
  const {data: myPets} =await supabase.from("pets").select().eq("butlerId", currentUserId);

  return myPets;
}


async function deleteMyPets(petId: number) {
  await supabase.from("pets").delete().eq("id", petId);
}

const petsApi = {
  getMyPets,
  deleteMyPets,
  //따른 API추가예정
};

export default petsApi;

// supabase.auth
// .getUser()
//  .then((response) => setCurrentUserId(response.data.user?.id));
