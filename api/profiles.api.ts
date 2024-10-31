import { supabase } from "@/supabase/client";

async function getMyProfile() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: myProfile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return myProfile;
}

const profilesAPI = {
  getMyProfile,
};

export default profilesAPI;
