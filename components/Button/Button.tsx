import { ComponentProps } from "react";

type ButtonProps = ComponentProps<"button">;

function Button({ children, ...props }: ButtonProps) {
  return (
    <button
      className="rounded-lg text-3xl font-semibold text-BrownPoint/50 bg-whitePoint text-center transition duration-300 hover:bg-BrownPoint hover:text-white border border-BrownPoint/50 px-6 py-4"
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
