import { AuthLayout } from "@/components/auth/auth-layout"
import { VerifyEmailForm } from "@/components/auth/verify-email-form"

export default function VerifyEmailPage() {
  return (
    <AuthLayout title="Verify your email" description="Enter the 6-digit code we sent to your email">
      <VerifyEmailForm />
    </AuthLayout>
  )
}
