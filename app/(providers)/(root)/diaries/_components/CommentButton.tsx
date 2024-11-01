import { RiMessage3Line } from "react-icons/ri";

interface CommentButtonProps {
  commentsCount: number;
}

function CommentButton({ commentsCount }: CommentButtonProps) {
  return (
    <button className="flex items-center z-20">
      <RiMessage3Line className="w-[30px] h-[30px] text-BrownPoint" />
      <h2 className="pl-1 font-bold">{commentsCount}</h2>
    </button>
  );
}

export default CommentButton;
