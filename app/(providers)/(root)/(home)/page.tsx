import Page from "@/app/(providers)/(root)/_components/Page/Page";
import AuthCheck from "./_components/AuthCheck";
import Calendar from "./_components/Calendar";

function HomePage() {
  return (
    <Page>
      <AuthCheck />
      <div className="rounded-r-3xl bg-whitePoint p-5 w-[24.7%] absolute right-[5vh] h-[90.6%]">
        <Calendar />
      </div>
    </Page>
  );
}

export default HomePage;
