import { Suspense } from "react"
import { ResetPasswordForm } from "./_sections/reset-password-form"
import { AuthContainer } from "@/shared/components/layout/auth-container"

export default function PasswordResetPage() {
  return (
    <AuthContainer>
      <Suspense fallback={<div className="text-center text-sm text-muted-foreground py-10">Đang tải...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </AuthContainer>
  )
}