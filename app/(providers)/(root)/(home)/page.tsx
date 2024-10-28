import Page from "@/app/(providers)/(root)/_components/Page/Page";
import dayjs from "dayjs";
import AuthCheck from "./_components/AuthCheck";
import HomeCalendar from "./_components/HomeCalendar";

function HomePage() {
  const title = dayjs().format("DD dddd");

  return (
    <Page title={title}>
      <AuthCheck />
      <div className="rounded-r-3xl bg-whitePoint p-5 w-[24.7%] absolute right-[5vh] h-[90.6%]">
        <HomeCalendar />
      </div>
    </Page>
  );
}

export default HomePage;
