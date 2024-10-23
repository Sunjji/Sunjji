import { RiMessage3Line } from "react-icons/ri";

interface CommentButtonProps {
  diaryId: string;
  commentsCount: number;
}

function CommentButton({ commentsCount }: CommentButtonProps) {
  return (
    <button className="flex items-center z-20">
      <RiMessage3Line className="w-[30px] h-[30px] text-BrownPoint" />
      <p>{commentsCount}</p>
    </button>
  );
}

export default CommentButton;
