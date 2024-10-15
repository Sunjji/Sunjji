"use client";

import { supabase } from "@/supabase/client";
import { nanoid } from "nanoid";
import { useRouter } from "next/navigation";
import { useState } from "react";

function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [checkPassword, setCheckPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [imageFile, setImageFile] = useState<File>();
  const router = useRouter(); // router.push

  const handleClickSignUpPage = async () => {
    // 유효성 검사
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // 이메일 형식 정규 표현식
    if (!email) return alert("이메일을 입력해주세요");
    if (!emailPattern.test(email))
      return alert("유효한 이메일 형식이 아닙니다"); // 이메일 형식 확인
    if (!password) return alert("비밀번호를 입력해주세요");
    if (password.length < 8) return alert("비밀번호는 8자 이상이어야 합니다"); // 비밀번호 길이 확인
    if (!/[!@#$%^&*]/.test(password))
      return alert("비밀번호는 특수문자를 포함해야 합니다"); // 특수문자 포함 확인
    if (!checkPassword) return alert("비밀번호 확인을 입력해주세요");
    if (password !== checkPassword) return alert("비밀번호가 다릅니다");

    const SignUpResult = await supabase.auth.signUp({ email, password }); //슈파베이스

    if (!SignUpResult) return alert("회원가입 정보를 다시 확인해주세요");

    const extension = imageFile?.name.split(".").slice(-1)[0];
    const filename = nanoid();
    const profilePath = `${filename}.${extension}`;
    const baseURL =
      "https://kudrchaizgkzyjzrkhhy.supabase.co/storage/v1/object/public/";

    if (!imageFile) return alert("이미지를 선택해주세요");

    const storage = await supabase.storage
      .from("profile-image")
      .upload(profilePath, imageFile, { upsert: true });

    if (storage.error) return alert("대 실 패");

    console.log(storage.data.fullPath);

    await supabase.auth.signInWithPassword({
      email,
      password,
    }); // 회원가입 후 로그인

    await supabase.from("profiles").insert({
      nickname: nickname,
      imageUrl: `${baseURL}${profilePath}`,
    });

    return alert("회원가입에 성공하셨습니다");
  };

  return (
    <main className="flex justify-center">
      <ul className="mt-[150px] bg-point w-[500px] p-10 text-center rounded-[8px]">
        <li>
          <h2 className="font-bold">이미지</h2>
          <input
            className="mb-5 p-2"
            type="file"
            onChange={(e) => setImageFile(e.target.files?.[0])}
          />
        </li>
        <li>
          <h2 className="font-bold">사용자 이름</h2>
          <input
            className="mb-5 p-2"
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
        </li>
        <li>
          <h2 className="font-bold">이메일</h2>
          <input
            className="mb-5 p-2"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </li>
        <li>
          <h2 className="font-bold">비밀번호</h2>
          <input
            className="mb-5 p-2"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </li>
        <li>
          <h2 className="font-bold">비밀번호 확인</h2>
          <input
            className="mb-5 p-2"
            type="password"
            value={checkPassword}
            onChange={(e) => setCheckPassword(e.target.value)}
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
