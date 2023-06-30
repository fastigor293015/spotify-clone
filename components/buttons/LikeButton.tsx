"use client";

import { useEffect, useMemo, useState } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { twMerge } from "tailwind-merge";

interface LikeButtonProps {
  isLiked: boolean;
  handleLike: () => void;
  className?: string;
  iconSize?: number;
};

const LikeButton: React.FC<LikeButtonProps> = ({
  isLiked,
  handleLike,
  className,
  iconSize = 25,
}) => {
  const [hasMounted, setHasMounted] = useState(false);

  const Icon = useMemo(() => isLiked ? AiFillHeart : AiOutlineHeart, [isLiked]);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) return null;

  return (
    <button
      onClick={handleLike}
      className={twMerge(`
        hover:opacity-75
        transition
      `, className, isLiked && "block")}
    >
      <Icon color={isLiked ? "#22c55e" : "white"} size={iconSize} />
    </button>
  );
}

export default LikeButton;
