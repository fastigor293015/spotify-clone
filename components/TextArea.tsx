"use client";

import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({
  className,
  disabled,
  ...props
}, ref) => {
  return (
    <textarea
      className={twMerge(`
        flex
        w-full
        py-3
        px-3
        rounded-md
        border
        border-transparent
        text-sm
        bg-neutral-700
        transition
        focus:bg-[#333]
        focus:border-neutral-700
        file:border-0
        file:bg-transparent
        file:text-sm
        file:font-medium
        placeholder:text-neutral-400
        disabled:cursor-not-allowed
        disabled:opacity-50
        focus:outline-none
      `,
        className
      )}
      disabled={disabled}
      ref={ref}
      {...props}
    />
  )
});

Textarea.displayName = "Textarea";

export default Textarea;
