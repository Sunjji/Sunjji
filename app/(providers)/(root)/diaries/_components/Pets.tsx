import { supabase } from "@/supabase/client";
import { Tables } from "@/supabase/database.types";
import { useEffect, useState } from "react";

function Pets() {
  const [myPets, setMyPets] = useState<Tables<"pets">[]>([]);

  useEffect(() => {
    (async () => {
      // 로그인한 유저의 등록된 펫들 가져오기
      const userId = await supabase.auth.getUser();
      console.log(userId);
      const { data: petsData, error } = await supabase
        .from("pets")
        .select("*")
        .eq("butlerId", userId.data.user?.id);
      if (error) {
        return console.log("error", error);
      } else {
        setMyPets(petsData);
      }
    })();
  }, []);
  return (
    <div>
      <ul>
        {myPets.map((data) => (
          <li key={data.id}>
            <p>{data.name}</p>
            <img
              src={`https://kudrchaizgkzyjzrkhhy.supabase.co/storage/v1/object/public/${data.imageUrl}`}
            />
            <p>{data.age}</p>
            <p>{data.comment}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Pets;
