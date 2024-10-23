import { PropsWithChildren } from "react";
import { ToastContainer } from "react-toastify";
import AuthProvider from "./_components/AuthProvider";
import ModalProvider from "./_components/ModalProvider";
import TanstackQueryProvider from "./_components/TanstackQueryProvider";

function ProvidersLayout({ children }: PropsWithChildren) {
  return (
    <TanstackQueryProvider>
      <ModalProvider>
        <AuthProvider>
          <ToastContainer />
          {children}
        </AuthProvider>
      </ModalProvider>
    </TanstackQueryProvider>
  );
}

export default ProvidersLayout;
