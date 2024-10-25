// components/Toast.tsx
import { Bounce, ToastPosition } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// 각 토스트 스타일을 위한 기본 옵션들
const baseToastOptions = {
  position: "top-right" as ToastPosition,
  closeButton: false,
  autoClose: 2000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "colored",
  transition: Bounce,
};

// 각 타입별 토스트 스타일 옵션을 리턴하는 함수
export const getToastOptions = (type: "success" | "error" | "warning") => {
  switch (type) {
    case "success":
      return {
        ...baseToastOptions,
        style: {
          backgroundColor: "#E3F4E5",
          color: "#2E7D32",
          fontFamily: "MongxYamiyomiL",
        },
      };
    case "error":
      return {
        ...baseToastOptions,
        style: {
          backgroundColor: "#F9C1BD",
          color: "#D32F2F",
          fontFamily: "MongxYamiyomiL",
        },
      };
    case "warning":
      return {
        ...baseToastOptions,
        style: {
          backgroundColor: "#FFF9C4",
          color: "#F9A825",
          fontFamily: "MongxYamiyomiL",
        },
      };
    default:
      return baseToastOptions; // 기본 옵션을 리턴
  }
};
