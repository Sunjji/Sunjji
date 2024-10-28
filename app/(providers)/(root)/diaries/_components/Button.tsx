"use client";

import { useState } from "react";

type ButtonProps = { buttonLabel: string };

function Button({ buttonLabel }: ButtonProps) {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    isClicked ? setIsClicked(false) : setIsClicked(true);
  };

  return (
    <button
      onClick={() => handleClick()}
      type="button"
      className={`border px-3 py-2 rounded-[8px] w-full
        ${isClicked ? "bg-BrownPoint text-point" : "text-BrownPoint bg-point"}
        transition`}
    >
      {buttonLabel}
    </button>
  );
}

export default Button;
