import dayjs from "dayjs";
import { ReactNode } from "react";

interface PageProps {
  children: ReactNode;
}

function Page({ children }: PageProps) {
  return (
    <main className="flex flex-col p-[2.5vh]">
      <section className="flex flex-col bg-point rounded-3xl h-[95vh]">
        <h1 className="px-10 pt-10 pb-7 text-3xl font-bold text-BrownPoint">
          {dayjs().format("DD dddd")}
        </h1>
        {children}
      </section>
    </main>
  );
}

export default Page;
