"use client"

import type React from "react"

import { cn } from "@/lib/utils"
import { useRef, useState, useEffect } from "react"

interface OtpInputProps {
  length?: number
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  className?: string
}

export function OtpInput({ length = 6, value, onChange, disabled = false, className }: OtpInputProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  const handleChange = (index: number, inputValue: string) => {
    const digit = inputValue.slice(-1)
    if (!/^\d*$/.test(digit)) return

    const newValue = value.split("")
    newValue[index] = digit
    onChange(newValue.join(""))

    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
      setActiveIndex(index + 1)
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
      setActiveIndex(index - 1)
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text").slice(0, length)
    if (!/^\d+$/.test(pastedData)) return
    onChange(pastedData.padEnd(length, ""))
    inputRefs.current[Math.min(pastedData.length, length - 1)]?.focus()
  }

  return (
    <div className={cn("flex gap-3 justify-center", className)}>
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[index] || ""}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          onFocus={() => setActiveIndex(index)}
          disabled={disabled}
          className={cn(
            "w-12 h-14 text-center text-xl font-semibold rounded-lg border bg-secondary/50 transition-all",
            "focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary",
            activeIndex === index && "border-primary",
            disabled && "opacity-50 cursor-not-allowed",
          )}
        />
      ))}
    </div>
  )
}
