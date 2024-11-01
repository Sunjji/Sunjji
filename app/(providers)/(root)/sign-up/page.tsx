"use client";

import { supabase } from "@/supabase/client";
import { nanoid } from "nanoid";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import { getToastOptions } from "../_components/getToastOptions";

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
    if (!nickname)
      return toast("💛 이름을 입력해 주세요", getToastOptions("warning"));
    if (!email)
      return toast("💛 이메일을 입력해 주세요", getToastOptions("warning"));
    if (!emailPattern.test(email))
      return toast(
        "💛 올바른 이메일 형식이 아닙니다",
        getToastOptions("warning")
      ); // 이메일 형식 확인
    if (!password)
      return toast("💛 비밀번호를 입력해 주세요", getToastOptions("warning"));
    if (password.length < 6)
      return toast(
        "💛 비밀번호는 6자 이상이어야 합니다",
        getToastOptions("warning")
      ); // 비밀번호 길이 확인
    if (!/[!@#$%^&*]/.test(password))
      return toast(
        "💛 비밀번호는 특수문자가 포함되어야 합니다",
        getToastOptions("warning")
      ); // 특수문자 포함 확인
    if (!checkPassword)
      return toast(
        "💛 비밀번호 확인을 입력해 주세요",
        getToastOptions("warning")
      );
    if (password !== checkPassword)
      return toast(
        "💛 비밀번호가 일치하지 않습니다",
        getToastOptions("warning")
      );

    const extension = imageFile?.name.split(".").slice(-1)[0];
    const filename = nanoid();
    const profilePath = `${filename}.${extension}`;
    const baseURL =
      "https://kudrchaizgkzyjzrkhhy.supabase.co/storage/v1/object/public/profile-image";

    if (!imageFile)
      return toast("💛 사진을 선택해 주세요", getToastOptions("warning"));

    const storage = await supabase.storage
      .from("profile-image")
      .upload(profilePath, imageFile, { upsert: true });

    if (storage.error)
      return toast("❤️ 회원가입에 실패했습니다", getToastOptions("error"));

    console.log(storage.data.fullPath);

    await supabase.auth.signUp({
      email,
      password,
    }); // 회원가입 후 로그인

    await supabase.from("profiles").insert({
      nickname: nickname,
      imageUrl: `${baseURL}/${profilePath}`,
    });

    router.push("/");
    return toast("💚 회원가입에 성공하였습니다", getToastOptions("success"));
  };

  return (
    <main className="flex justify-center">
      <ul className="mt-[150px] bg-point w-[500px] p-10 text-center rounded-[8px]">
        <h1 className="text-3xl font-bold mb-3">회원가입</h1>
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
            className="p-2"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <p className="mb-5 text-red-500">
            비밀번호는 8자 특수문자(!@#$%^&*) 포함입니다
          </p>
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
