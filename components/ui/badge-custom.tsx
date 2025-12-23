import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface BadgeCustomProps {
  children: ReactNode
  variant?: "default" | "secondary" | "success" | "warning" | "destructive" | "outline"
  size?: "sm" | "md" | "lg"
  className?: string
}

export function BadgeCustom({ children, variant = "default", size = "md", className }: BadgeCustomProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center font-medium rounded-full",
        {
          "bg-primary/20 text-primary": variant === "default",
          "bg-secondary text-secondary-foreground": variant === "secondary",
          "bg-success/20 text-success": variant === "success",
          "bg-warning/20 text-warning": variant === "warning",
          "bg-destructive/20 text-destructive": variant === "destructive",
          "border border-border bg-transparent": variant === "outline",
        },
        {
          "px-2 py-0.5 text-xs": size === "sm",
          "px-2.5 py-1 text-xs": size === "md",
          "px-3 py-1.5 text-sm": size === "lg",
        },
        className,
      )}
    >
      {children}
    </span>
  )
}
