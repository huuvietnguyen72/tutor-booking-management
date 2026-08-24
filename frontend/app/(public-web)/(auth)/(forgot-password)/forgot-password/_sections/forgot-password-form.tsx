"use client"

import React, { useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"

import { Button } from "@/shared/components/ui/button"
import { FormField } from "@/shared/components/ui/form-field"
import MailIcon from "@/shared/components/icons/mail-icon"
import LockOpenIcon from "@/shared/components/icons/lock-open-icon"
import { useRouter } from "next/navigation"
import { useForgotPassword } from "@/server/_actions/auth-action"
import { toast } from "sonner"
import { formatErrorMessage } from "@/shared/lib/utils"
import { ArrowLeft } from "lucide-react"

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Email không hợp lệ." }),
})

type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>

export function ForgotPasswordForm() {
  const router = useRouter()
  const { mutate: forgotPassword, isPending } = useForgotPassword()
  const [isSuccess, setIsSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  })

  function onSubmit(values: ForgotPasswordSchema) {
    forgotPassword(values, {
      onSuccess: () => {
        setIsSuccess(true)
        toast.success("Hướng dẫn khôi phục mật khẩu đã được gửi qua email!");
      },
      onError: (error: Error) => {
        toast.error(formatErrorMessage(error, "Không thể gửi yêu cầu. Vui lòng kiểm tra lại email."));
      },
    })
  }

  if (isSuccess) {
    return (
      <div className="w-full flex flex-col items-center text-center space-y-5">
        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center text-green-500 mb-2">
          <MailIcon className="size-8" />
        </div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">
          Kiểm tra email của bạn
        </h1>
        <p className="text-sm text-muted-foreground pb-4">
          Chúng tôi đã gửi hướng dẫn khôi phục mật khẩu. Vui lòng kiểm tra hộp thư đến (và thư rác) của bạn.
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
            Quên mật khẩu?
          </h1>
          <p className="text-sm text-muted-foreground">
            Đừng lo lắng, hãy nhập email đã đăng ký của bạn. Chúng tôi sẽ gửi hướng dẫn khôi phục.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          label="Email"
          type="email"
          placeholder="username@email.com"
          leftIcon={<MailIcon className="text-muted-foreground" />}
          error={errors.email?.message}
          {...register("email")}
        />

        <Button
          type="submit"
          className="w-full h-11 text-sm font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-200 transition-all active:scale-[0.98] mt-2"
          disabled={isPending}
        >
          {isPending ? "Đang gửi..." : "Gửi yêu cầu"}
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
