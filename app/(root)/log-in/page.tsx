"use client";

import { supabase } from "@/supabase/client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

function LogInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleClickLogInPage = async () => {
    const loginResult = await supabase.auth.signInWithPassword({
      email,
      password,
    }); //슈파베이스 로그인
    if (!loginResult) return alert("로그인 실패");

    alert("로그인에 성공하셨습니다");

    router.push("/");
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
