"use client";

import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  className,
  children,
  disabled,
  type = "button",
  ...props
}, ref) => {
  return (
    <button
      type={type}
      className={twMerge(`
        px-3
        py-3
        border
        border-transparent
        rounded-full
        select-none
        text-black
        font-bold
        bg-green-500
        hover:scale-105
        active:scale-100
        active:opacity-70
        disabled:cursor-not-allowed
        disabled:opacity-50
      `,
        className
      )}
      disabled={disabled}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  )
});

Button.displayName = "Button";

export default Button;
