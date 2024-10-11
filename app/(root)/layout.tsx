import { PropsWithChildren } from "react";
import Header from "./_components/Header";

function Layout({ children }: PropsWithChildren) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}

export default Layout;
