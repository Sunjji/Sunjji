import Link from "next/link";

function PublicPage() {
  type userDiaries = {
    id: string;
    nickname: string;
    imageUrl: string;
  };
  return (
    <>
      {/* 일기미리보기 */}

      <div className="mt-[30px] ml-[50px] rounded-[8px] w-[200px] h-[50px] font-semibold text-BrownPoint bg-point text-center">
        <Link href={"/diaries/write"}>일기쓰기</Link>
      </div>

      <div className="flex">
        <div className="mt-[30px] ml-[50px] rounded-[8px] w-[300px] h-[360px] bg-point">
          <div className="flex items-center">
            <div className="m-2 inline-block rounded-full bg-white w-[40px] h-[40px]"></div>
            <span className="inline-block text-sm font-semibold text-BrownPoint">
              jjugguming
            </span>
          </div>
          <div className="flex flex-col items-center justify-center">
            <hr className="w-[250px] border-lg border-Brown" />
            <img
              className="m-auto"
              src="https://item.kakaocdn.net/do/35d21721120852d73f512b9bc17f366815b3f4e3c2033bfd702a321ec6eda72c"
            />
            <div className="w-[30px]">...</div>
          </div>
          <div className="ml-5 flex gap-2">
            <div className="w-[30px] h-[30px] bg-BrownPoint">좋</div>
            <p>123</p>
            <div className="w-[30px] h-[30px] bg-BrownPoint">댓</div>
            <p>12</p>
          </div>
          <div className="text-center text-BrownPoint">
            <p>오늘 카레가 맛있엇다 그런데 배가고파서...</p>
          </div>
        </div>
        <div className="mt-[30px] ml-[50px] rounded-[8px] w-[300px] h-[360px] bg-point">
          <div className="flex items-center">
            <div className="m-2 inline-block rounded-full bg-white w-[40px] h-[40px]"></div>
            <span className="inline-block text-sm font-semibold text-BrownPoint">
              jjugguming
            </span>
          </div>
          <div className="flex flex-col items-center justify-center">
            <hr className="w-[250px] border-lg border-Brown" />
            <img
              className="m-auto"
              src="https://item.kakaocdn.net/do/35d21721120852d73f512b9bc17f366815b3f4e3c2033bfd702a321ec6eda72c"
            />
            <div className="w-[30px]">...</div>
          </div>
          <div className="ml-5 flex gap-2">
            <div className="w-[30px] h-[30px] bg-BrownPoint">좋</div>
            <p>123</p>
            <div className="w-[30px] h-[30px] bg-BrownPoint">댓</div>
            <p>12</p>
          </div>
          <div className="text-center text-BrownPoint">
            <p>오늘 카레가 맛있엇다 그런데 배가고파서...</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default PublicPage;
