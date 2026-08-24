"use client";

import { useState, useCallback, useMemo } from "react";
import { LoginForm } from "./_sections/login-form";
import { SocialRolePopup } from "./_sections/social-role-popup";
import { cn } from "@/shared/lib/utils";
import { GraduationCap } from "lucide-react";
import FamilyIcon from "@/shared/components/icons/family-icon";
import { useGoogleLogin } from "@/server/_actions/auth-action";
import { toast } from "sonner";
import { ROUTES } from "@/shared/constants/app";
import { useRouter, useSearchParams } from "next/navigation";

import { Suspense } from "react";
import { AuthContainer } from "@/shared/components/layout/auth-container";

export default function LoginPage() {
  return (
    <Suspense 
      fallback={
        <AuthContainer className="flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600" />
            <p className="text-muted-foreground font-medium animate-pulse">Đang chuẩn bị...</p>
          </div>
        </AuthContainer>
      }
    >
      <LoginContent />
    </Suspense>
  );
}

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const [showRolePopup, setShowRolePopup] = useState(false);
  const [googleToken, setGoogleToken] = useState<string | null>(null);

  const { mutate: googleLogin } = useGoogleLogin();

  const handleGoogleSuccess = useCallback((token: string) => {
    const toastId = toast.loading("Đang kiểm tra tài khoản Google...");
    
    googleLogin(
      { idToken: token },
      {
        onSuccess: (res) => {
          if (res.exist) {
            toast.success("Đăng nhập bằng Google thành công!", { id: toastId });
            router.refresh();
            const roleRedirects: Record<string, string> = {
              PARENT: ROUTES.PARENT.DASHBOARD,
              TUTOR: ROUTES.TUTOR.DASHBOARD,
              ADMIN: ROUTES.ADMIN.DASHBOARD,
            };
            const rolePath = res.role ? roleRedirects[res.role] : ROUTES.HOME;
            const redirectPath = (res.role && roleRedirects[res.role]) ? roleRedirects[res.role] : (callbackUrl || ROUTES.HOME);
            router.push(redirectPath);
          } else {
            toast.dismiss(toastId);
            setGoogleToken(token);
            setShowRolePopup(true);
          }
        },
        onError: (err) => {
          toast.error("Kiểm tra Google login thất bại", { id: toastId });
          console.error("Google verify error:", err);
        },
      }
    );
  }, [googleLogin, router, callbackUrl]);

  const roles = useMemo(() => [
    {
      id: "PARENT",
      title: "Phụ huynh",
      description: "Tìm gia sư phù hợp cho con em của mình",
      icon: <FamilyIcon className="text-blue-600 size-7" />,
      bg: "bg-blue-50",
      border: "hover:border-blue-200 hover:bg-blue-50/50",
    },
    {
      id: "TUTOR",
      title: "Gia sư",
      description: "Đăng ký để trở thành gia sư và bắt đầu giảng dạy",
      icon: <GraduationCap size={32} className="text-indigo-600" />,
      bg: "bg-indigo-50",
      border: "hover:border-indigo-200 hover:bg-indigo-50/50",
    },
  ], []);

  return (
    <>
      <AuthContainer 
        className={cn(
          "transition-all duration-500",
          showRolePopup ? "blur-md scale-[0.98] opacity-50" : "blur-0 scale-100 opacity-100"
        )}
      >
        <LoginForm
          onSocialClick={() => setShowRolePopup(true)}
          onGoogleSuccess={handleGoogleSuccess}
        />
      </AuthContainer>

      {/* Social Role Selection Popup */}
      <SocialRolePopup
        roles={roles}
        isOpen={showRolePopup}
        onClose={() => {
          setShowRolePopup(false);
          setGoogleToken(null);
        }}
        googleToken={googleToken || ""}
      />
    </>
  );
}
