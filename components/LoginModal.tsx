"use client";
// LoginPage를 LoginModal로 변경

import Modal from "@/components/Modal";
import { supabase } from "@/supabase/client";
import { useAuthStore } from "@/zustand/auth.store";
import { useModalStore } from "@/zustand/modal.store";
import { useState } from "react";

function LogInModal() {
  const closeModal = useModalStore((state) => state.closeModal);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const setIsLoggedIn = useAuthStore((state) => state.setIsLoggedIn);

  const handleClickLogInPage = async () => {
    if (!email) return alert("이메일을 입력해주세요");
    if (!password) return alert("비밀번호를 입력해주세요");

    const loginResult = await supabase.auth.signInWithPassword({
      email,
      password,
    }); //슈파베이스 로그인
    if (loginResult.error) return alert("로그인 실패"); // !data로도 사용 가능

    alert("로그인에 성공하셨습니다");
    setIsLoggedIn(true);
    closeModal(); // 로그인 후 Modal 닫기
  };

  return (
    // main을 Modal로 변경
    <Modal>
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
    </Modal>
  );
}

export default LogInModal;
