"use client";

import usePlayer from "@/hooks/usePlayer";
import { usePathname, useRouter } from "next/navigation";
import { IconType } from "react-icons";
import { twMerge } from "tailwind-merge";

interface PlayerButtonProps {
  className?: string;
  href: string;
  icon: IconType;
  iconSize?: number;
}

const PlayerButton: React.FC<PlayerButtonProps> = ({
  className,
  href,
  icon: Icon,
  iconSize = 20,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const player = usePlayer();

  return (
    <button className={twMerge(`relative text-white cursor-pointer`, className, pathname === href && "text-green-500")}>
      <Icon size={iconSize} onClick={() => {
        if (pathname !== href) {
          router.push(href);
          player.setIsMobilePlayerOpen(false);
        } else {
          router.back();
        }
      }} />
      <div className={twMerge(`
        absolute
        top-[calc(100%+2px)]
        left-[calc(50%-2px)]
        w-1
        h-1
        rounded-full
        bg-current
        opacity-0
      `, pathname === href && "opacity-100")} />
    </button>
  );
}

export default PlayerButton;
