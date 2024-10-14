import { PropsWithChildren } from "react";
import SideBar from "./_components/SideBar";

function Layout({ children }: PropsWithChildren) {
  return (
    <>
      <body className="bg-beige flex">
        <SideBar />
        <main className="w-full">{children}</main>
      </body>
    </>
  );
}

export default Layout;
