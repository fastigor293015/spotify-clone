"use client";

import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";

interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  className,
  type,
  disabled,
  ...props
}, ref) => {
  return (
    <input
      type={type}
      className={twMerge(`
        flex
        w-full
        border
        border-transparent
        rounded-md
        px-3
        py-3
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

Input.displayName = "Input";

export default Input;
