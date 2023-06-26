"use client";

import { IconType } from "react-icons";
import * as RadixContextMenu from "@radix-ui/react-context-menu";
import { twMerge } from "tailwind-merge";

export interface ContextItem {
  label: string;
  icon?: IconType;
  onClick: () => void;
  disabled?: boolean;
}

interface ContextMenuProps {
  children: React.ReactNode;
  items: ContextItem[];
  className?: string;
}

const ContextMenu: React.FC<ContextMenuProps> = ({
  children,
  items,
  className,
}) => {

  return (
    <RadixContextMenu.Root>
      <RadixContextMenu.Trigger className={twMerge("outline-none", className)}>
        {children}
      </RadixContextMenu.Trigger>

      {items.length === 0 ? null : (
        <RadixContextMenu.Portal>
          <RadixContextMenu.Content
            className="relative z-[51] p-1 rounded-[4px] min-w-[160px] bg-neutral-800 shadow-3xl translate-y-3"
          >
            {items.map(({ label, icon: Icon, onClick, disabled }) => (
              <RadixContextMenu.Item
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
              </RadixContextMenu.Item>
            ))}
          </RadixContextMenu.Content>
        </RadixContextMenu.Portal>
      )}
    </RadixContextMenu.Root>
  );
}

export default ContextMenu;
