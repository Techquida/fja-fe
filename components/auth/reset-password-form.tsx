"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Lock, Check } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

interface ResetPasswordFormProps {
  onSubmit?: (password: string) => void
  isLoading?: boolean
}

export function ResetPasswordForm({ onSubmit, isLoading = false }: ResetPasswordFormProps) {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) return
    onSubmit?.(password)
    setSubmitted(true)
  }

  const passwordsMatch = password && confirmPassword && password === confirmPassword

  if (submitted) {
    return (
      <div className="text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mx-auto">
          <Check className="w-8 h-8 text-success" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-foreground">Password reset successful</h3>
          <p className="text-muted-foreground mt-2">Your password has been updated. You can now sign in.</p>
        </div>
        <Button asChild className="w-full h-12 bg-primary hover:bg-primary/90">
          <Link href="/login">Sign in</Link>
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="password">New Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-10 h-12 bg-secondary/50"
            required
            minLength={8}
          />
        </div>
        <p className="text-xs text-muted-foreground">Must be at least 8 characters</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="pl-10 h-12 bg-secondary/50"
            required
          />
        </div>
        {confirmPassword && !passwordsMatch && <p className="text-xs text-destructive">Passwords do not match</p>}
      </div>

      <Button
        type="submit"
        className="w-full h-12 bg-primary hover:bg-primary/90"
        disabled={isLoading || !passwordsMatch}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Resetting...
          </>
        ) : (
          "Reset password"
        )}
      </Button>
    </form>
  )
}
