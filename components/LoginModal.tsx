"use client";
import { getToastOptions } from "@/app/(providers)/(root)/_components/getToastOptions";
import Modal from "@/components/Modal";
import { supabase } from "@/supabase/client";
import { useAuthStore } from "@/zustand/auth.store";
import { useModalStore } from "@/zustand/modal.store";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

function LogInModal() {
  const closeModal = useModalStore((state) => state.closeModal);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const setIsLoggedIn = useAuthStore((state) => state.setIsLoggedIn);

  const handleClickKakaoSignUp = async () => {
    const { data } = await supabase.auth.signInWithOAuth({
      provider: "kakao",
    });
    console.log(data);
  };

  useEffect(() => {
    const { data: register } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_IN" && session?.user) {
          toast("💚 회원가입에 성공하였습니다", getToastOptions("success"));
        }
      }
    );

    // 컴포넌트가 언마운트될 때 구독 해제
    return () => {
      register?.subscription.unsubscribe();
    };
  }, []); // useEffect의 의존성 배열 추가

  const handleClickLogInPage = async () => {
    if (!email) return alert("이메일을 입력해주세요");
    if (!password) return alert("비밀번호를 입력해주세요");

    const loginResult = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (loginResult.error) return alert("로그인 실패");

    alert("로그인에 성공하셨습니다");
    setIsLoggedIn(true);
    closeModal();
  };

  return (
    // main을 Modal로 변경
    <Modal>
      <h1 className="text-3xl font-bold mb-3">로그인</h1>
      <h2 className="font-bold">이메일</h2>
      <div>
        <input
          value={email}
          type="text"
          onChange={(e) => setEmail(e.target.value)}
          placeholder="비밀번호를 입력해주세요"
        />
      </div>

      <h2 className="font-bold">비밀번호</h2>
      <div>
        <input
          value={password}
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호를 입력해주세요"
        />
      </div>

      <button onClick={handleClickLogInPage}>로그인하기</button>
      <button onClick={handleClickKakaoSignUp}>카카오로 로그인하기</button>
    </Modal>
  );
}

export default LogInModal;
