/* eslint-disable @next/next/no-img-element */
import api from "@/api/api";
import Page from "@/app/(providers)/(root)/_components/Page/Page";
import DiariesWriteButton from "./_components/DiariesWriteButton";
import DiaryBox from "./_components/DiaryBox";

export const revalidate = 0;

async function PublicPage() {
  const publicDiaries = await api.diaries.getPublicDiaries();

  return (
    <Page title="모두의 집사 일기">
      {/* 일기쓰기 버튼 */}
      <div className="absolute top-20 right-[84px]">
        <DiariesWriteButton />
      </div>

      {/* 클릭하면 일기 상세페이지로 들어감 */}
      <div className="bg-whitePoint p-10 rounded-2xl overflow-y-hidden">
        <p>공개 일기들을 읽을 수 있어요!</p>
        <div className=" overflow-y-auto h-[380px] grid lg:grid-cols-3 md:grid-cols-1  gap-x-20 gap-y-10">
          {publicDiaries?.map((diary) => (
            <DiaryBox key={diary.id} diary={diary} />
          ))}
        </div>
      </div>
    </Page>
  );
}

export default PublicPage;
