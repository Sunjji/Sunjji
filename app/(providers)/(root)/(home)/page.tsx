import Page from "@/app/(providers)/(root)/_components/Page/Page";
import dayjs from "dayjs";
import HomeCalendar from "./_components/HomeCalendar";
import HomeMyPets from "./_components/HomeMyPets";

function HomePage() {
  const title = dayjs().format("DD dddd");

  return (
    <Page title={title}>
      <div className="w-full grid grid-cols-3 gap-x-10 grow">
        <div>이달의 인기 일기</div>
        <HomeMyPets />

        <div className="col-span-1 rounded-r-3xl bg-whitePoint p-5">
          <HomeCalendar />
        </div>
      </div>
    </Page>
  );
}

export default HomePage;
