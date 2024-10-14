import { PropsWithChildren } from "react";

function Modal({ children }: PropsWithChildren) {
  return (
    <div
      // Backdrop 클릭 시 모달 창이 닫히게하기
      onClick={(e) => e.stopPropagation()}
      // 내용을 흰 배경과 함께 가운데로
      className="bg-white min-w-[300px] max-w-[480px] py-16 px-8"
    >
      {children}
    </div>
  );
}

export default Modal;
