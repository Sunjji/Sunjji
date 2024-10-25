import Page from "@/app/(providers)/(root)/_components/Page/Page";
import { supabase } from "@/supabase/client";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import DiariesWriteButton from "../_components/DiariesWriteButton";

async function UserViewPage() {
  // const now = dayjs();
  // console.
  const { data } = await supabase.auth.getUser();
  const authorId = data.user?.id;

  const response = await supabase
    .from("diaries")
    .select()
    .eq("authorId", authorId);

  const diaries = response.data;

  console.log(authorId);
  return (
    <Page>
      {/* 일기쓰기 버튼 */}
      <div className="absolute top-20 right-[84px]">
        <DiariesWriteButton />
      </div>
      <div className="bg-whitePoint px-6 rounded-2xl">
        <div className="mt-7 text-3xl font-bold text-BrownPoint text-center text-opacity-50 pb-[30px] flex justify-between mx-auto w-80">
          {/* 버튼에 onClick 달아서 월 이동 */}
          <button>
            <FaAngleLeft />
          </button>
          {/* 이 안에 현재 선택된 월 함수 넣기 */}
          <p>{}월</p>
          <button>
            <FaAngleRight />
          </button>
        </div>
        {/* 이 밑으로 내 일기 목록 출력 */}
      </div>
    </Page>
  );
}
export default UserViewPage;
