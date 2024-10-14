import { PropsWithChildren } from "react";
import AuthProvider from "./_components/AuthProvider";
import ModalProvider from "./_components/ModalProvider";

function ProvidersLayout({ children }: PropsWithChildren) {
  return (
    <ModalProvider>
      <AuthProvider>{children}</AuthProvider>
    </ModalProvider>
  );
}

export default ProvidersLayout;
