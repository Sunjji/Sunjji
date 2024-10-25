import Page from "@/app/(providers)/(root)/_components/Page/Page";
import AuthCheck from "./_components/AuthCheck";

function HomePage() {
  return (
    <Page>
      <AuthCheck />
      <div className="rounded-r-3xl bg-whitePoint p-5 w-[24.7%] absolute right-[5vh] h-[90.6%]">
        달력 들어갈 자리
        {/* 나중에 적당한 곳에 위치 시키기 */}
        {/* <Calendar /> */}
      </div>
    </Page>
  );
}

export default HomePage;
