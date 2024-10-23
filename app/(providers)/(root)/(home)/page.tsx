import Page from "@/app/_page/Page";

function HomePage() {
  return (
    <Page>
      <div className="flex flex-wrap justify-between h-[75vh] w-[69%] gap-5">
        <div className="rounded-2xl bg-whitePoint p-5 w-[47%] h-full">
          이달의 인기 일기
        </div>
        <div className="w-[47%] h-full flex flex-col gap-7">
          <div className="rounded-2xl bg-whitePoint p-5 h-72">
            OO과(와) 함께 한지
          </div>
          <div className="rounded-2xl bg-whitePoint p-5 h-72">OO의 생일</div>
          <div className="rounded-2xl bg-whitePoint p-5 h-full">
            나의 반려동물
          </div>
        </div>
      </div>
      <div className="rounded-r-3xl bg-whitePoint p-5 w-[24.7%] absolute right-[2.5vh] h-[94.6%]">
        달력 들어갈 자리
        {/* 나중에 적당한 곳에 위치 시키기 */}
        {/* <Calendar /> */}
      </div>
    </Page>
  );
}

export default HomePage;
