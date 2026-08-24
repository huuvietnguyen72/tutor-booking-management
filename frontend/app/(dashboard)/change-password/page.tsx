"use client";

import { useState } from "react";
import { 
  Lock, 
  KeyRound, 
  ShieldAlert, 
  Eye, 
  EyeOff, 
  Loader2, 
  CheckCircle2,
  AlertTriangle,
  ArrowRight
} from "lucide-react";
import { useChangePassword } from "@/server/_actions/auth-action";
import { cn, formatErrorMessage } from "@/shared/lib/utils";
import { toast } from "sonner";
import Link from "next/link";
import { ROUTES } from "@/shared/constants/app";
import { passwordSchema } from "@/shared/lib/password-schema";

export default function ChangePasswordPage() {
  const { mutate: changePassword, isPending: isChanging } = useChangePassword();
  
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp");
      return;
    }

    const validation = passwordSchema.safeParse(formData.newPassword);
    if (!validation.success) {
      toast.error(validation.error.issues[0].message);
      return;
    }

    changePassword({
      oldPassword: formData.oldPassword,
      newPassword: formData.newPassword,
    }, {
      onSuccess: (res: any) => {
        toast.success(res.message || "Đổi mật khẩu thành công");
        setFormData({ oldPassword: "", newPassword: "", confirmPassword: "" });
      },
      onError: (error: any) => {
        toast.error(formatErrorMessage(error, "Có lỗi xảy ra khi đổi mật khẩu"));
      },
    });
  };

  const passwordRequirements = [
    { label: "Ít nhất 8 ký tự", met: formData.newPassword.length >= 8 },
    { label: "Chữ in hoa (A-Z)", met: /[A-Z]/.test(formData.newPassword) },
    { label: "Chữ in thường (a-z)", met: /[a-z]/.test(formData.newPassword) },
    { label: "Chữ số (0-9)", met: /\d/.test(formData.newPassword) },
    { label: "Ký tự đặc biệt", met: /[^a-zA-Z0-9]/.test(formData.newPassword) },
  ];

  return (
    <div className="container mx-auto max-w-2xl px-4 py-12 md:py-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="relative overflow-hidden rounded-4xl border border-border bg-card p-6 md:p-12 shadow-2xl shadow-primary/5">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
        
        <div className="relative z-10 text-center mb-10">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-4xl bg-primary/10 text-primary shadow-inner">
            <KeyRound size={40} strokeWidth={2.5} className="animate-pulse" />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-foreground uppercase">
            Đổi mật khẩu
          </h1>
          <p className="mt-3 text-muted-foreground font-medium text-sm">
            Mật khẩu của bạn nên được cập nhật định kỳ để bảo đảm an toàn thông tin.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
          {/* Old Password */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
              Mật khẩu cũ
            </label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" size={18} />
              <input
                type={showOldPassword ? "text" : "password"}
                value={formData.oldPassword}
                onChange={(e) => setFormData({ ...formData, oldPassword: e.target.value })}
                required
                placeholder="Nhập mật khẩu hiện tại"
                className="h-14 w-full rounded-2xl border-border bg-card pl-12 pr-12 text-sm font-bold text-foreground shadow-sm transition-all focus:border-primary/50 focus:ring-4 focus:ring-primary/10 tracking-tight"
              />
              <button
                type="button"
                onClick={() => setShowOldPassword(!showOldPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showOldPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="my-8 h-px w-full bg-linear-to-r from-transparent via-border to-transparent" />

          {/* New Password */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
              Mật khẩu mới
            </label>
            <div className="relative group">
              <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" size={18} />
              <input
                type={showNewPassword ? "text" : "password"}
                value={formData.newPassword}
                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                required
                placeholder="Nhập mật khẩu mới"
                className="h-14 w-full rounded-2xl border-border bg-card pl-12 pr-12 text-sm font-bold text-foreground shadow-sm transition-all focus:border-primary/50 focus:ring-4 focus:ring-primary/10 tracking-tight"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            
            {/* Password Requirements */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-2 px-1">
              {passwordRequirements.map((req, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className={cn(
                    "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors",
                    req.met ? "bg-emerald-500 border-emerald-500 text-white" : "border-muted-foreground/30 text-transparent"
                  )}>
                    <CheckCircle2 size={10} />
                  </div>
                  <span className={cn(
                    "text-[9px] font-bold tracking-tight uppercase",
                    req.met ? "text-emerald-500" : "text-muted-foreground/60"
                  )}>
                    {req.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
              Xác nhận mật khẩu mới
            </label>
            <div className="relative group">
              <ShieldAlert className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" size={18} />
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
                placeholder="Nhập lại mật khẩu mới"
                className="h-14 w-full rounded-2xl border-border bg-card pl-12 pr-12 text-sm font-bold text-foreground shadow-sm transition-all focus:border-primary/50 focus:ring-4 focus:ring-primary/10 tracking-tight"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Warning Card */}
          <div className="rounded-3xl bg-rose-500/5 p-4 border border-rose-500/20">
            <div className="flex items-start gap-3">
              <AlertTriangle className="text-rose-500 shrink-0 mt-0.5" size={16} />
              <p className="text-[10px] font-medium text-rose-500 leading-normal">
                Lưu ý: Sau khi đổi mật khẩu, bạn cần đăng nhập lại trên tất cả các thiết bị khác để đảm bảo an toàn.
              </p>
            </div>
          </div>

          <div className="pt-4 flex flex-col gap-4">
            <button
              type="submit"
              disabled={isChanging}
              className="group flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-primary text-sm font-black uppercase tracking-widest text-white shadow-xl shadow-primary/20 transition-all hover:bg-primary/90 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
            >
              {isChanging ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <span>Xác nhận đổi mật khẩu</span>
                  <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
            
            <Link 
              href={ROUTES.HOME}
              className="text-center text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
            >
              Quay về trang chủ
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
