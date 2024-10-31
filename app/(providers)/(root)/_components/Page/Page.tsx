import { ReactNode } from "react";

interface PageProps {
  children: ReactNode;
  title: string;
}

function Page({ title, children }: PageProps) {
  return (
    <main className="flex flex-col p-10 min-h-screen max-h-screen h-screen overflow-hidden">
      <section className="p-10 flex flex-col bg-point rounded-3xl grow overflow-hidden">
        <h1 className="font text-[45px] text-BrownPoint pb-10">{title}</h1>
        {children}
      </section>
    </main>
  );
}

export default Page;
