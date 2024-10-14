import { PropsWithChildren } from "react";
import SideBar from "./_components/SideBar";

function Layout({ children }: PropsWithChildren) {
  return (
    <div className="bg-beige flex">
      <SideBar />
      <main className="w-full">{children}</main>
    </div>
  );
}

export default Layout;
