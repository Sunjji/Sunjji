"use client";

import { supabase } from "@/supabase/client";
import React, { useState } from "react";

function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [checkpassword, setCheckpassword] = useState("");

  const handleClickSignUpPage = async () => {
    if (!email) return alert("이메일 입력하기");
    if (!password) return alert("패스워드 입력하기");
    // 유효성 검사

    await supabase.auth.signUp({ email, password }); //슈파베이스
  };

  return (
    <main>
      <section>
        <div>
          <input
            value={email}
            placeholder="이메일을 입력해주세요"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <input
            value={password}
            placeholder="비밀번호 입력해주세요"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <input
            value={checkpassword}
            placeholder="비밀번호를 확인해주세요"
            onChange={(e) => setCheckpassword(e.target.value)}
          />
        </div>
        <button onClick={handleClickSignUpPage}>회원가입하기</button>
      </section>
    </main>
  );
}

export default SignUpPage;
