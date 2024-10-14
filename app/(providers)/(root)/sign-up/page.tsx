"use client";

import { supabase } from "@/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

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

    router.push("/log-in"); //회원가입이 성공하면 log-in으로 push

    return alert("회원가입에 성공하셨습니다");
  };

  return (
    <main className="flex justify-center">
      <ul className="mt-[150px] bg-point w-[500px] p-10 text-center rounded-[8px]">
        <li>
          <h2 className="font-bold">이메일</h2>
          <input
            className="mb-5 p-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </li>
        <li>
          <h2 className="font-bold">비밀번호</h2>
          <input
            className="mb-5 p-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </li>
        <li>
          <h2 className="font-bold">비밀번호확인</h2>
          <input
            className="mb-5 p-2"
            value={checkpassword}
            onChange={(e) => setCheckpassword(e.target.value)}
          />
        </li>
        <button
          className="bg-Brown p-2 px-10 rounded-sm"
          onClick={handleClickSignUpPage}
        >
          회원가입하기
        </button>
      </ul>
    </main>
  );
}

export default SignUpPage;
