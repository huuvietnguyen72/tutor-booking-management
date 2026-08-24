"use client"

import React from "react"
import { z } from "zod"
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { User, Mail, Phone, GraduationCap, Info } from "lucide-react"
import Link from "next/link"

import { Button } from "@/shared/components/ui/button"
import { FormField } from "@/shared/components/ui/form-field"
import { PasswordField } from "@/shared/components/ui/password-field"
import { cn } from "@/shared/lib/utils"
import { passwordSchema } from "@/shared/lib/password-schema"
import { useRouter } from "next/navigation"
import BookIcon from "@/shared/components/icons/book-icon"
import FamilyIcon from "@/shared/components/icons/family-icon"
import { useRegister } from "@/server/_actions/auth-action"
import { IRole } from "@/server/_types/auth-type"
import { toast } from "sonner"
import { formatErrorMessage } from "@/shared/lib/utils"

const signupSchema = z
  .object({
    role: z.enum(["parent", "tutor"]),
    fullName: z.string().min(2, { message: "Họ và tên ít nhất 2 ký tự." }),
    email: z.email({ message: "Email không hợp lệ." }),
    phoneNumber: z
      .string()
      .regex(/^(0|\+84)[3|5|7|8|9][0-9]{8}$/, { message: "Số điện thoại không hợp lệ." }),
    password: passwordSchema,
    confirmPassword: z.string().min(1, { message: "Vui lòng xác nhận mật khẩu." }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp.",
    path: ["confirmPassword"],
  })

type SignupFormValues = z.infer<typeof signupSchema>

interface SignupFormProps {
  defaultRole?: "parent" | "tutor"
}

export function SignupForm({ defaultRole = "parent" }: SignupFormProps) {

  const router = useRouter()
  const { mutate: signup, isPending } = useRegister()


  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      role: defaultRole,
      fullName: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
    },
  })

  const selectedRole = useWatch({ control, name: "role" })

  function onSubmit(values: SignupFormValues) {
    const { fullName, email, phoneNumber, password, role } = values
    
    // Đổi +84 thành số 0 để phù hợp với format backend
    const normalizedPhone = phoneNumber.startsWith('+84') 
        ? '0' + phoneNumber.slice(3) 
        : phoneNumber;

    const toastId = toast.loading("Đang tạo tài khoản của bạn...");
    signup({
        fullName,
        email,
        phone: normalizedPhone,
        password,
        role: role.toUpperCase() as IRole,
    }, {
        onSuccess: () => {
            toast.success("Đăng ký thành công! Vui lòng đăng nhập.", { id: toastId });
            router.push("/login")
        },
        onError: (error: Error) => {
            toast.error(formatErrorMessage(error, "Đăng ký thất bại. Email có thể đã được sử dụng."), { id: toastId });
        }
    })
  }

  const ROLE_TABS = [
    { id: "parent", label: "Tôi là Phụ huynh", icon: FamilyIcon, path: "/signup/parent" },
    { id: "tutor", label: "Tôi là Gia sư", icon: BookIcon, path: "/signup/tutor" },
  ] as const;

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-col items-center mb-5">
        <Link href="/" prefetch={false} className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-blue-200 mb-3 cursor-pointer transition-all hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200 hover:scale-105">
          <GraduationCap size={30} />
        </Link>
        <h1 className="text-[18px] font-bold text-foreground">Đăng ký tài khoản</h1>
      </div>

      {/* Role Tabs */}
      <div className="flex border-b border-border mb-5">
        {ROLE_TABS.map(({ id, label, icon: Icon, path }) => (
          <button
            key={id}
            type="button"
            onClick={() => router.push(path)}
            className={cn(
              "flex-1 flex flex-col items-center gap-1.5 py-3 text-sm font-medium transition-all duration-200 relative",
              selectedRole === id
                ? "text-blue-600"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon />
            <span>{label}</span>
            {selectedRole === id && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Tutor Notice */}
      {selectedRole === "tutor" && (
        <div className="flex gap-2.5 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30 rounded-xl px-4 py-3 mb-4">
          <Info size={15} className="text-blue-500 shrink-0 mt-0.5" />
          <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
            <span className="font-semibold">Lưu ý:</span> Sau khi đăng ký, hồ sơ Gia sư của bạn sẽ cần được đội ngũ của chúng tôi xét duyệt trước khi hiển thị.
          </p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          label="Họ và tên"
          placeholder="Nhập họ và tên đầy đủ"
          leftIcon={<User size={15} />}
          error={errors.fullName?.message}
          {...register("fullName")}
        />

        <FormField
          label="Email"
          type="email"
          placeholder="example@email.com"
          leftIcon={<Mail size={15} />}
          error={errors.email?.message}
          {...register("email")}
        />

        <FormField
          label="Số điện thoại"
          type="tel"
          placeholder="Nhập số điện thoại"
          leftIcon={<Phone size={15} />}
          error={errors.phoneNumber?.message}
          {...register("phoneNumber")}
        />

        <PasswordField
          label="Mật khẩu"
          placeholder="Ít nhất 8 ký tự"
          error={errors.password?.message}
          {...register("password")}
        />

        <PasswordField
          label="Xác nhận mật khẩu"
          placeholder="Nhập lại mật khẩu"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />

        {/* Terms */}
        <p className="text-xs text-muted-foreground leading-relaxed pt-1">
          Bằng việc nhấn Đăng ký, bạn đồng ý với{" "}
          <Link href="#" className="text-blue-600 font-medium hover:underline">
            Điều khoản dịch vụ
          </Link>{" "}
          và{" "}
          <Link href="#" className="text-blue-600 font-medium hover:underline">
            Chính sách bảo mật
          </Link>{" "}
          của chúng tôi.
        </p>

        {/* Submit */}
        <Button
          type="submit"
          className="w-full h-11 text-sm font-semibold rounded-xl transition-all"
          disabled={isPending}
        >
          {isPending ? "Đang đăng ký..." : "Đăng ký ngay"}
        </Button>
      </form>

      {/* Login Link */}
      <p className="text-center text-sm text-muted-foreground mt-4">
        Đã có tài khoản?{" "}
        <Link href="/login" className="text-blue-600 font-semibold hover:underline">
          Đăng nhập
        </Link>
      </p>
    </div>
  )
}
