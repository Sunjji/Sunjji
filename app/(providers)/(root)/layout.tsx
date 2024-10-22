import { PropsWithChildren } from "react";
import SideBar from "./_components/SideBar";

function Layout({ children }: PropsWithChildren) {
  return (
    <div className="flex">
      <SideBar />
      <main className="ml-[100px] w-full">{children}</main>
    </div>
  );
}

export default Layout;
