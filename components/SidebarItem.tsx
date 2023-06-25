"use client";

import Link from "next/link";
import { IconType } from "react-icons";
import { twMerge } from "tailwind-merge";

interface SidebarProps {
  icon: IconType;
  label: string;
  active?: boolean;
  href: string;
}

const SidebarItem: React.FC<SidebarProps> = ({
  icon: Icon,
  label,
  active,
  href,
}) => {
  return (
    <Link
      href={href}
      className={twMerge(`
        flex
        flex-row
        items-center
        h-12
        w-full
        py-1
        px-3
        gap-x-4
        text-md
        font-medium
        text-neutral-400
        cursor-pointer
        transition
        hover:text-white
      `,
        active && "text-white"
      )}
    >
      <Icon size={30} />
      <p className="truncate w-full">{label}</p>
    </Link>
  );
}

export default SidebarItem;
