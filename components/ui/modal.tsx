"use client"

import { cn } from "@/lib/utils"
import { X } from "lucide-react"
import type { ReactNode } from "react"
import { useEffect } from "react"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  title?: string
  description?: string
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
}

export function Modal({ isOpen, onClose, children, title, description, size = "md", className }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      <div
        className={cn(
          "relative z-10 w-full bg-card border border-border rounded-xl shadow-2xl",
          {
            "max-w-sm": size === "sm",
            "max-w-md": size === "md",
            "max-w-lg": size === "lg",
            "max-w-xl": size === "xl",
          },
          className,
        )}
      >
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            {title && <h2 className="text-lg font-semibold text-foreground">{title}</h2>}
            {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-secondary transition-colors">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}
