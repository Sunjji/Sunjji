import dayjs from "dayjs";
import { ReactNode } from "react";

interface PageProps {
  children: ReactNode;
}

function Page({ children }: PageProps) {
  return (
    <main className="flex flex-col p-[2.5vh]">
      <section className="px-10 flex flex-col bg-point rounded-3xl pb-10">
        <h1 className="pt-10 pb-7 text-3xl font-bold text-BrownPoint">
          {dayjs().format("DD dddd")}
        </h1>
        {children}
      </section>
    </main>
  );
}

export default Page;
