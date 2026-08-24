"use client"

import React, { useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/shared/components/ui/button"
import { PasswordField } from "@/shared/components/ui/password-field"
import LockIcon from "@/shared/components/icons/lock-icon"
import LockOpenIcon from "@/shared/components/icons/lock-open-icon"
import { passwordSchema } from "@/shared/lib/password-schema"
import { useRouter, useSearchParams } from "next/navigation"
import { useResetPassword } from "@/server/_actions/auth-action"
import { toast } from "sonner"
import { formatErrorMessage } from "@/shared/lib/utils"

const resetPasswordSchema = z.object({
  newPassword: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Mật khẩu xác nhận không khớp.",
  path: ["confirmPassword"],
})

type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>

export function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  
  const [isSuccess, setIsSuccess] = useState(false)
  
  const { mutate: resetPassword, isPending } = useResetPassword()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  })

  function onSubmit(values: ResetPasswordSchema) {
    if (!token) {
      toast.error("Không tìm thấy mã xác thực. Vui lòng kiểm tra lại đường link trong email.")
      return
    }
    
    resetPassword({ token: token!, newPassword: values.newPassword }, {
      onSuccess: () => {
        setIsSuccess(true)
        toast.success("Đặt lại mật khẩu thành công! Vui lòng truy cập trang đăng nhập.")
      },
      onError: (error: Error) => {
        toast.error(formatErrorMessage(error, "Không thể đặt lại mật khẩu. Vui lòng thử lại hoặc yêu cầu link mới."))
      },
    })
  }

  if (isSuccess) {
    return (
      <div className="w-full flex flex-col items-center text-center space-y-5">
        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center text-green-500 mb-2">
          <LockIcon className="size-8" />
        </div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">
          Hoàn tất đặt lại mật khẩu
        </h1>
        <p className="text-sm text-muted-foreground pb-4">
          Mật khẩu của bạn đã được cập nhật thành công. Bây giờ bạn có thể đăng nhập bằng mật khẩu mới.
        </p>
        <Button
          onClick={() => router.push("/login")}
          className="w-full h-11 text-sm font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-200 transition-all active:scale-[0.98]"
        >
          Trở lại Đăng nhập
        </Button>
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Icon & Header */}
      <div className="flex flex-col items-center text-center space-y-3 mb-8">
        <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
          <LockOpenIcon strokeWidth={2.5} />
        </div>
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-foreground tracking-tight">
            Đặt lại mật khẩu
          </h1>
          <p className="text-sm text-muted-foreground">
            Vui lòng nhập mật khẩu mới của bạn bên dưới
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <PasswordField
          label="Mật khẩu mới"
          error={errors.newPassword?.message}
          {...register("newPassword")}
        />

        <PasswordField
          label="Xác nhận mật khẩu"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />

        <Button
          type="submit"
          className="w-full h-11 text-sm font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-200 transition-all active:scale-[0.98] mt-4"
          disabled={isPending}
        >
          {isPending ? "Đang xử lý..." : "Cập nhật mật khẩu"}
        </Button>
      </form>

      {/* Footer */}
      <p className="text-center text-sm text-muted-foreground mt-8">
        <Link 
          href="/login" 
          className="inline-flex items-center gap-2 text-blue-600 font-medium hover:text-blue-700 transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Trở lại Đăng nhập</span>
        </Link>
      </p>
    </div>
  )
}
