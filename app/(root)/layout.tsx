import { PropsWithChildren } from "react";
import Header from "./_components/Header";

function Layout({ children }: PropsWithChildren) {
  return (
    <>
      <body className="bg-beige">
        <Header />
        {children}
      </body>
    </>
  );
}

export default Layout;
