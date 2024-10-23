import { PropsWithChildren } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SideBar from "./_components/SideBar";

function Layout({ children }: PropsWithChildren) {
  return (
    <div className="flex">
      <SideBar />
      <main className="ml-[100px] w-full">{children}</main>
      <ToastContainer />
    </div>
  );
}

export default Layout;
