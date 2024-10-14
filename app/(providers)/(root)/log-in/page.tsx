"use client";

import { supabase } from "@/supabase/client";
import { useAuthStore } from "@/zustand/auth.store";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

function LogInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const setIsLoggedIn = useAuthStore((state) => state.setIsLoggedIn);
  const router = useRouter();

  const handleClickLogInPage = async () => {
    const loginResult = await supabase.auth.signInWithPassword({
      email,
      password,
    }); //슈파베이스 로그인
    if (loginResult.error) return alert("로그인 실패"); // !data로도 사용 가능
    if (!email) return alert("이메일이 없습니다");
    if (!password) return alert("패스워드가 없습니다");

    alert("로그인에 성공하셨습니다");
    setIsLoggedIn(true);
    router.push("/"); //로그인이 성공한다면 메인페이지로 push
    
  };

  return (
    <main>
      <section>
        <h2 className="font-bold">이메일</h2>
        <div>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="비밀번호를 입력해주세요"
          />
        </div>

        <h2 className="font-bold">비밀번호</h2>
        <div>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호를 입력해주세요"
          />
        </div>

        <button onClick={handleClickLogInPage}>로그인하기</button>
      </section>
    </main>
  );
}

export default LogInPage;
