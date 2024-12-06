import React from "react";
import { cn } from "../../lib/utils";

export function RainbowButton({
  children,
  className,
  ...props
}) {
  return (
    <button
      className={cn(
        // Base button styles
        "group relative inline-flex cursor-pointer items-center justify-center",
        "rounded-xl px-8 py-3 bg-black", // Background remains black
        "text-white font-medium transition-all duration-300",
        "hover:scale-105 active:scale-95",

        // Rainbow border effect
        "before:absolute before:inset-0 before:-z-10 before:rounded-xl",
        "before:p-[1px]",
        "before:bg-[linear-gradient(90deg,hsl(var(--color-1)),hsl(var(--color-5)),hsl(var(--color-3)),hsl(var(--color-4)),hsl(var(--color-2)))]",
        "before:animate-rainbow",

        // Prevent hover changes to the background
        "hover:bg-black", // Ensures hover doesn't change the button's background

        // Rainbow glow effect
        "after:absolute after:inset-[2px] after:-z-20 after:rounded-xl after:blur-xl",
        "after:animate-rainbow after:bg-[length:200%_auto]",
        "after:bg-[linear-gradient(90deg,hsl(var(--color-1)),hsl(var(--color-5)),hsl(var(--color-3)),hsl(var(--color-4)),hsl(var(--color-2)))]",
        "after:opacity-40 hover:after:opacity-70",

        // Focus styles
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20",

        // Disabled state
        "disabled:pointer-events-none disabled:opacity-50",

        className
      )}
      {...props}
    >
      <span className="relative z-10">
        {children}
      </span>
    </button>
  );
}
