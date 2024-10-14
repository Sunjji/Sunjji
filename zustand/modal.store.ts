import React from "react";
import { create } from "zustand";

/**
 * 모달이 띄워져 있는지 확인하기 위한 전역 상태
 * 모달 띄우기: openModal(<띄우고 싶은 Modal로 감싸져 있는 컴포넌트 이름을 적는다 />);
 * 모달 지우기: closeModal()
 */

type ModalStoreState = {
  modal: React.ReactElement | null;
  openModal: (modal: React.ReactElement) => void;
  closeModal: () => void;
};

export const useModalStore = create<ModalStoreState>((set) => ({
  modal: null,
  openModal: (modal) => set({ modal }),
  closeModal: () => set({ modal: null }),
}));
