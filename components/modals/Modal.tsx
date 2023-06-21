"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { IoMdClose } from "react-icons/io";
import { twMerge } from "tailwind-merge";

interface ModalProps {
  isOpen: boolean;
  onChange: (open: boolean)  => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onChange,
  title,
  description,
  children,
  className
}) => {
  return (
    <Dialog.Root
      open={isOpen}
      defaultOpen={isOpen}
      onOpenChange={onChange}
    >
      <Dialog.Portal>
        <Dialog.Overlay
          className="
            bg-neutral-900/90
            backdrop-blur-sm
            fixed
            inset-0
            z-50
          "
        />
        <Dialog.Content
          className={twMerge(`
            fixed
            z-50
            drop-shadow-md
            border
            border-neutral-700
            top-[50%]
            left-[50%]
            max-h-full
            h-full
            md:h-auto
            md:max-h-[85vh]
            w-full
            md:w-[90vw]
            md:max-w-[450px]
            -translate-x-1/2
            -translate-y-1/2
            rounded-md
            bg-neutral-800
            p-[25px]
            focus:outline-none
            overflow-y-auto
          `, className)}
        >
          <Dialog.Title
            className={twMerge(`
              text-xl
              font-bold
              mb-4
            `, description && "text-center")}
          >
            {title}
          </Dialog.Title>
          {description && (<Dialog.Description
            className="
              mb-5
              text-sm
              leading-normal
              text-center
            "
          >
            {description}
          </Dialog.Description>)}
          <div>
            {children}
          </div>
          <Dialog.Close asChild>
            <button
              className="
                text-neutral-400
                hover:text-white
                absolute
                top-[10px]
                right-[10px]
                inline-flex
                h-[30px]
                w-[30px]
                appearance-none
                items-center
                justify-center
                rounded-full
                focus:ouline-none
              "
            >
              <IoMdClose />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default Modal;
