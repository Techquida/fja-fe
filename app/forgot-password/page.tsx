import { AuthLayout } from "@/components/auth/auth-layout"
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form"

export default function ForgotPasswordPage() {
  return (
    <AuthLayout title="Forgot password?" description="Enter your email and we'll send you a reset link">
      <ForgotPasswordForm />
    </AuthLayout>
  )
}
