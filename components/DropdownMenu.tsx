"use client";

import { IconType } from "react-icons";
import * as RadixDropdownMenu from "@radix-ui/react-dropdown-menu";
import { twMerge } from "tailwind-merge";

export interface DropdownItem {
  label: string;
  icon?: IconType;
  onClick: () => void;
  disabled?: boolean;
}

interface DropdownMenuProps {
  children: React.ReactNode;
  items: DropdownItem[];
  className?: string;
  align?: "center" | "start" | "end";
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  children,
  items,
  className,
  align = "center"
}) => {
  return (
    <RadixDropdownMenu.Root>
      <RadixDropdownMenu.Trigger className={twMerge("outline-none", className)}>
        {children}
      </RadixDropdownMenu.Trigger>

      <RadixDropdownMenu.Portal>
        <RadixDropdownMenu.Content
          align={align}
          className="relative z-[51] p-1 rounded-[4px] min-w-[160px] bg-neutral-800 shadow-3xl translate-y-3"
        >
          {items.map(({ label, icon: Icon, onClick, disabled }) => (
            <RadixDropdownMenu.Item
            key={label}
            className={twMerge(`
              flex
              items-center
              gap-2
              py-3
              pl-3
              pr-2
              text-sm
              leading-4
              truncate
              select-none
              outline-none
              hover:bg-white/10
              transition
              [data-disabled]:opacity-50
            `,
              disabled && "opacity-50 pointer-events-none"
            )}
            onClick={onClick}
            disabled={disabled}
            >
              {Icon && (
                <Icon size={20} />
              )}
              {label}
            </RadixDropdownMenu.Item>
          ))}
        </RadixDropdownMenu.Content>
      </RadixDropdownMenu.Portal>
    </RadixDropdownMenu.Root>
  );
}

export default DropdownMenu;
