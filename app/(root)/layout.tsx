import React from "react";
import Header from "./_components/Header";

function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Header />
      <div>
        <main>{children}</main>
      </div>
    </div>
  );
}

export default RootLayout;
