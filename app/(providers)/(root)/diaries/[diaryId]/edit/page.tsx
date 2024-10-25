"use client";

import api from "@/api/api";
import { supabase } from "@/supabase/client";
import { nanoid } from "nanoid";
import { useParams, useRouter } from "next/navigation";
import { ComponentProps, useEffect, useState } from "react";
import { Bounce, toast } from "react-toastify";
import IsPublicToggle from "../../_components/IsPublicToggle";

const baseURL =
  "https://kudrchaizgkzyjzrkhhy.supabase.co/storage/v1/object/public/";

function DiaryEditPage() {
  const succesToast = {
    position: "top-right",
    closeButton: false,
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
    transition: Bounce,
    style: {
      backgroundColor: "#E3F4E5",
      color: "#2E7D32",
      fontFamily: "MongxYamiyomiL",
    },
  };
  const params = useParams();
  const { diaryId } = params;
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [memo, setMemo] = useState("");
  const [file, setFile] = useState<null | File>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const router = useRouter();

  // diaries 정보 가져오기
  useEffect(() => {
    (async () => {
      const { data: diaries } = await api.diaries.getDiary(diaryId.toString());

      setTitle(diaries.title);
      setContent(diaries.content);
      setMemo(diaries.comment);
      setImageUrl(baseURL + diaries.imageUrl);
      setIsPublic(diaries.isPublic);
    })();
  }, [diaryId]);

  useEffect(() => {
    if (file) {
      setImageUrl(URL.createObjectURL(file));
    }
  }, [file]);

  // form 제출 버튼
  const handleSubmitButton: ComponentProps<"form">["onSubmit"] = async (e) => {
    e.preventDefault();

    if (file === null) {
      await supabase
        .from("diaries")
        .update({
          title: title, // 제목
          content: content, // 내용
          comment: memo, // 메모
          isPublic: isPublic, // 공개/비공개
        })
        .eq("id", Number(diaryId));
      toast("💚 일기가 수정 되었습니다", succesToast);

      router.push("/diaries");
    } else {
      const filename = nanoid();
      const extension = file!.name.split(".").slice(-1)[0];
      const path = `${filename}.${extension}`;

      const result = await supabase.storage
        .from("diaries")
        .upload(path, file!, { upsert: true });
      console.log(result);
      await supabase
        .from("diaries")
        .update({
          imageUrl: result.data?.fullPath,
        })
        .eq("id", Number(diaryId));

      toast("💚 사진이 변경 되었습니다", succesToast);
      router.push("/diaries");
    }
  };

  return (
    <form
      onSubmit={handleSubmitButton}
      className="flex flex-col gap-y-5 p-5 w-[500px]"
    >
      <div className="flex gap-x-7">
        <img className="w-32" src={imageUrl} />

        <div className="flex flex-col gap-y-2 flex-grow">
          <label htmlFor="file">사진을 선택해주세요</label>
          <input
            id="file"
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="px-1 py-2 border rounded-lg hover:border-gray-400"
          />
        </div>
      </div>

      <label htmlFor="title">일기 제목</label>
      <textarea
        onChange={(e) => setTitle(e.target.value)}
        value={title}
        className="border rounded-lg p-2 resize-none hover:border-gray-400"
        rows={2}
      />

      <label htmlFor="content">일기 내용</label>
      <textarea
        onChange={(e) => setContent(e.target.value)}
        value={content}
        className="border rounded-lg p-2 resize-none hover:border-gray-400"
        rows={10}
      />

      <label htmlFor="content">한 줄 메모</label>
      <textarea
        onChange={(e) => setMemo(e.target.value)}
        value={memo}
        className="border rounded-lg p-2 resize-none hover:border-gray-400"
        rows={10}
      />

      <IsPublicToggle isPublic={isPublic} setIsPublic={setIsPublic} />

      <button
        type="submit"
        className="border rounded-lg text-center py-2 hover:border-gray-400 active:brightness-50"
      >
        수정하기
      </button>
    </form>
  );
}

export default DiaryEditPage;
