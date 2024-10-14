import { PropsWithChildren } from "react";
import ModalProvider from "./_components/ModalProvider";

function ProvidersLayout({ children }: PropsWithChildren) {
  return <ModalProvider>{children}</ModalProvider>;
}

export default ProvidersLayout;
