import { PropsWithChildren } from "react";
import SideBar from "./_components/SideBar";

function Layout({ children }: PropsWithChildren) {
  return (
    <div className="flex">
      <SideBar />
      <div className="pl-[200px] w-full">{children}</div>
    </div>
  );
}

export default Layout;
