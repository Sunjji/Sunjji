"use client";

import { supabase } from "@/supabase/client";
import { useEffect, useState } from "react";
import dayjs from "dayjs";

type User = {
  email: string;
  created_at: string;
}

function MyPage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const getCurrentUser = async () => {
      const response = await supabase.auth.getUser();
      const user = response.data.user as User;
      console.log(user);
      setUser(user);
    };
    getCurrentUser();
  }, []);

  return (
    <main>
      <h1>마이 페이지</h1>
      {user ? (
        <>
          <h2>이메일: {user.email}</h2>
          <h2>계정 생성 날짜: {dayjs(user.created_at).format("YYYY년 MM월 DD일")}</h2>
        </>
      ) : (
        <h2>사용자 정보를 불러오는 중입니다...</h2>
      )}
    </main>
  );
}

export default MyPage;
