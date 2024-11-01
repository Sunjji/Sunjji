/* eslint-disable @typescript-eslint/no-unused-expressions */

import { Dispatch, SetStateAction } from "react";

type ButtonProps = {
  setCategory: Dispatch<SetStateAction<string>>;
  category: string;
  buttonLabel: string;
};

function Button({ setCategory, category, buttonLabel }: ButtonProps) {
  const handleClick = () => {
    setCategory(buttonLabel);
  };

  return (
    <button
      onClick={() => handleClick()}
      type="button"
      className={`border px-3 py-2 rounded-[8px] w-full
        ${
          category === buttonLabel
            ? "bg-BrownPoint text-point"
            : "text-BrownPoint bg-point"
        }
        transition`}
    >
      {buttonLabel}
    </button>
  );
}

export default Button;
