"use client";

import usePlayer from "@/hooks/usePlayer";
import { usePathname, useRouter } from "next/navigation";
import { HiOutlineQueueList } from "react-icons/hi2";
import { twMerge } from "tailwind-merge";

interface QueueButtonProps {
  className?: string;
  iconSize?: number;
}

const QueueButton: React.FC<QueueButtonProps> = ({
  className,
  iconSize = 20,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const player = usePlayer();

  return (
    <button className={twMerge(`relative text-white cursor-pointer`, pathname === "/queue" && "text-green-500")}>
      <HiOutlineQueueList onClick={() => {
        if (pathname !== "/queue") {
          router.push("/queue");
          player.setIsMobilePlayerOpen(false);
        } else {
          router.back();
        }
      }} size={iconSize} />
      <div className={twMerge(`
        absolute
        top-[calc(100%+2px)]
        left-[calc(50%-2px)]
        w-1
        h-1
        rounded-full
        bg-current
        opacity-0
      `, pathname === "/queue" && "opacity-100")} />
    </button>
  );
}

export default QueueButton;
