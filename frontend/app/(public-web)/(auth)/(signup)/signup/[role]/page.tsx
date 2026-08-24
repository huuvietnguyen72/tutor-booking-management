import { Metadata } from "next"
import { SignupForm } from "../_sections/signup-form"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Đăng ký thành viên",
  description: "Tham gia cộng đồng Gia sư Online ngay hôm nay để bắt đầu hành trình học tập mới.",
}

const VALID_ROLES = ["parent", "tutor"] as const
type Role = (typeof VALID_ROLES)[number]

interface SignupRolePageProps {
  params: Promise<{ role: string }>
}

export function generateStaticParams() {
  return VALID_ROLES.map((role) => ({
    role,
  }))
}

import { AuthContainer } from "@/shared/components/layout/auth-container"

export default async function SignupRolePage({ params }: SignupRolePageProps) {
  const { role } = await params

  // Redirect về /signup nếu role không hợp lệ
  if (!VALID_ROLES.includes(role as Role)) {
    redirect("/signup")
  }

  return (
    <AuthContainer>
      <SignupForm defaultRole={role as Role} />
    </AuthContainer>
  )
}
