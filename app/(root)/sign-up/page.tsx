"use client";

import { supabase } from "@/supabase/client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [checkpassword, setCheckpassword] = useState("");
  const router = useRouter(); // router.push

  const handleClickSignUpPage = async () => {
    if (!email) return alert("이메일 입력하기");
    if (!password) return alert("패스워드 입력하기");
    if (password !== checkpassword) return alert("패스워드를 확인해주세요");

    // 유효성 검사(추가예정)

    const SignUpResult = await supabase.auth.signUp({ email, password }); //슈파베이스

    if (!SignUpResult) return alert("회원가입 정보를 다시 확인해주세요");

    return alert("회원가입에 성공하셨습니다");

    router.push("/log-in");
  };

  return (
    <main>
      <section>
        <div>
          <h2 className="font-bold">이메일</h2>
          <input
            value={email}
            placeholder="이메일을 입력해주세요"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <h2 className="font-bold">비밀번호</h2>
          <input
            value={password}
            placeholder="비밀번호 입력해주세요"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <h2 className="font-bold">비밀번호확인</h2>
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
