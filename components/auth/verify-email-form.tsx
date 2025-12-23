"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { OtpInput } from "@/components/ui/otp-input"
import { Loader2, Check, Mail } from "lucide-react"
import { useState } from "react"

interface VerifyEmailFormProps {
  email?: string
  onSubmit?: (code: string) => void
  onResend?: () => void
  isLoading?: boolean
}

export function VerifyEmailForm({
  email = "user@example.com",
  onSubmit,
  onResend,
  isLoading = false,
}: VerifyEmailFormProps) {
  const [code, setCode] = useState("")
  const [verified, setVerified] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (code.length !== 6) return
    onSubmit?.(code)
    setVerified(true)
  }

  const handleResend = () => {
    if (resendCooldown > 0) return
    onResend?.()
    setResendCooldown(60)
    const interval = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  if (verified) {
    return (
      <div className="text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mx-auto">
          <Check className="w-8 h-8 text-success" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-foreground">Email verified!</h3>
          <p className="text-muted-foreground mt-2">Your email has been verified. Redirecting to dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
          <Mail className="w-8 h-8 text-primary" />
        </div>
        <p className="text-muted-foreground">
          {"We've sent a 6-digit code to "}
          <span className="text-foreground font-medium">{email}</span>
        </p>
      </div>

      <OtpInput value={code} onChange={setCode} disabled={isLoading} />

      <Button
        type="submit"
        className="w-full h-12 bg-primary hover:bg-primary/90"
        disabled={isLoading || code.length !== 6}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Verifying...
          </>
        ) : (
          "Verify email"
        )}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        {"Didn't receive a code? "}
        <button
          type="button"
          onClick={handleResend}
          disabled={resendCooldown > 0}
          className="text-primary hover:text-primary/80 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend code"}
        </button>
      </p>
    </form>
  )
}
