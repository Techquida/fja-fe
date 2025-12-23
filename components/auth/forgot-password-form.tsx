"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Mail, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

interface ForgotPasswordFormProps {
  onSubmit?: (email: string) => void
  isLoading?: boolean
}

export function ForgotPasswordForm({ onSubmit, isLoading = false }: ForgotPasswordFormProps) {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit?.(email)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mx-auto">
          <Mail className="w-8 h-8 text-success" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-foreground">Check your email</h3>
          <p className="text-muted-foreground mt-2">
            {"We've sent a password reset link to "}
            <span className="text-foreground font-medium">{email}</span>
          </p>
        </div>
        <Button variant="outline" asChild className="w-full h-12 bg-transparent">
          <Link href="/login">
            <ArrowLeft className="mr-2 w-5 h-5" />
            Back to sign in
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10 h-12 bg-secondary/50"
            required
          />
        </div>
      </div>

      <Button type="submit" className="w-full h-12 bg-primary hover:bg-primary/90" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Sending...
          </>
        ) : (
          "Send reset link"
        )}
      </Button>

      <Button variant="outline" asChild className="w-full h-12 bg-transparent">
        <Link href="/login">
          <ArrowLeft className="mr-2 w-5 h-5" />
          Back to sign in
        </Link>
      </Button>
    </form>
  )
}
