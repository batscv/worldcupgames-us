import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
};

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 disabled:pointer-events-none disabled:opacity-50",
        variant === "primary" && "bg-white text-[#0b1020] hover:scale-[1.02]",
        variant === "secondary" && "border border-white/10 bg-white/8 text-white hover:bg-white/12",
        variant === "ghost" && "text-zinc-300 hover:bg-white/8 hover:text-white",
        className,
      )}
      {...props}
    />
  );
}
