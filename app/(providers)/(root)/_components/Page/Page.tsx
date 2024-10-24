import dayjs from "dayjs";
import { ReactNode } from "react";

interface PageProps {
  children: ReactNode;
}

function Page({ children }: PageProps) {
  return (
    <main className="flex flex-col p-[2.5vh] pt-[5vh] pr-[2.8vw]">
      <section className="ml-[2vw] px-10 flex flex-col bg-point rounded-3xl pb-10">
        <div className="pt-12 pb-8 flex justify-between items-center w-[120px]">
          <h1 className="font text-[40px] text-BrownPoint">
            {dayjs().format("DD")}
          </h1>
          <h1 className="font text-[36px] text-BrownPoint">
            {dayjs().format("dddd")}
          </h1>
        </div>
        {children}
      </section>
    </main>
  );
}

export default Page;
