"use client";

import React from "react";
import { X, ArrowRight } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { useGoogleRegister as useGoogleRegisterMutation } from "@/server/_actions/auth-action";
import { toast } from "sonner";
import { IRole } from "@/server/_types/auth-type";
import { ROUTES } from "@/shared/constants/app";
import { useRouter } from "next/navigation";

interface SocialRolePopupProps {
  roles: {
    id: string;
    title: string;
    description: string;
    icon: React.ReactElement<React.SVGProps<SVGSVGElement>>;
    bg: string;
    border: string;
  }[];
  isOpen: boolean;
  onClose: () => void;
  googleToken: string;
}

export function SocialRolePopup({
  roles,
  isOpen,
  onClose,
  googleToken,
}: SocialRolePopupProps) {
  const router = useRouter();
  const googleRegisterMutation = useGoogleRegisterMutation();

  if (!isOpen) return null;

  const handleRoleSelect = async (roleId: string) => {
    if (!googleToken) {
      toast.error("Vui lòng đăng nhập Google trước");
      return;
    }

    const toastId = toast.loading("Đang đăng ký tài khoản...");

    try {
      await googleRegisterMutation.mutateAsync({
        idToken: googleToken,
        role: roleId as IRole,
      });

      toast.success("Đăng ký & Đăng nhập thành công!", { id: toastId });
      router.refresh();
      onClose();

      // Redirect based on role
      if (roleId === "PARENT") {
        router.push(ROUTES.PARENT.DASHBOARD);
      } else if (roleId === "TUTOR") {
        router.push(ROUTES.TUTOR.DASHBOARD);
      } else {
        router.push(ROUTES.HOME);
      }
    } catch (error) {
      toast.error("Đăng nhập bằng Google thất bại", { id: toastId });
      console.error("Google Login Error:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative bg-white w-full max-w-[520px] max-h-[calc(100dvh-2rem)] rounded-4xl sm:rounded-3xl shadow-2xl overflow-y-auto sm:overflow-hidden animate-in fade-in zoom-in duration-300 scrollbar-hide">
        {/* Header */}
        <div className="px-5 sm:px-8 pt-12 sm:pt-8 pb-3 sm:pb-4 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={18} className="sm:w-5 sm:h-5" />
          </button>

          <div className="text-center space-y-1.5 sm:space-y-2 px-4 sm:px-0">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
              Bạn đăng nhập với vai trò nào?
            </h2>
            <p className="text-[13px] sm:text-sm text-gray-500 max-w-[280px] sm:max-w-none mx-auto leading-relaxed">
              Vui lòng chọn vai trò để tiếp tục đăng nhập bằng mạng xã hội
            </p>
          </div>
        </div>

        {/* Content - Role Selection */}
        <div className="px-5 sm:px-8 pb-6 sm:pb-8 pt-2 sm:pt-0 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {roles.map((role) => (
            <button
              key={role.id}
              onClick={() => handleRoleSelect(role.id)}
              className={cn(
                "group flex flex-col items-center text-center p-5 sm:p-6 rounded-2xl border-2 border-transparent transition-all duration-300",
                "bg-white border-gray-50 shadow-sm hover:shadow-md active:scale-[0.98] sm:active:scale-100",
                role.border,
              )}
            >
              <div
                className={cn(
                  "w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mb-3 sm:mb-4 transition-transform duration-300 group-hover:scale-110",
                  role.bg,
                )}
              >
                {React.cloneElement(role.icon, {
                  className: cn(role.icon.props.className, "size-6 sm:size-7")
                })}
              </div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1.5 sm:mb-2">
                {role.title}
              </h3>
              <p className="text-[11px] sm:text-xs text-gray-500 leading-relaxed mb-3 sm:mb-4">
                {role.description}
              </p>
              <div className="flex items-center gap-1.5 text-blue-600 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                <span>Tiếp tục</span>
                <ArrowRight size={14} />
              </div>
            </button>
          ))}
        </div>

        {/* Footer info */}
        <div className="px-5 sm:px-8 pb-6 sm:pb-8 text-center border-t border-gray-50 pt-5 sm:pt-6">
          <p className="text-[10px] sm:text-[11px] text-gray-400 uppercase tracking-widest font-semibold">
            Tutors Booking Management System
          </p>
        </div>
      </div>
    </div>
  );
}
