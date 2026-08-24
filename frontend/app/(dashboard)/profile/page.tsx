"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { 
  User, 
  Mail, 
  Phone, 
  Camera, 
  ShieldCheck, 
  ChevronRight,
  Loader2,
  Save,
  KeyRound
} from "lucide-react";
import { useGetMe, useUpdateProfile, useUpdateAvatar } from "@/server/_actions/auth-action";
import { useGetTutorProfile } from "@/server/_actions/tutor-action";
import { ROUTES } from "@/shared/constants/app";
import { cn, formatErrorMessage } from "@/shared/lib/utils";
import Link from "next/link";
import { toast } from "sonner";

export default function ProfilePage() {
  const { data: user, isLoading: isUserLoading } = useGetMe();
  const { data: tutorProfile } = useGetTutorProfile(user?.role === "TUTOR");
  const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile();
  const { mutate: uploadAvatar, isPending: isUploadingAvatar } = useUpdateAvatar();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
  });

  useEffect(() => {
    if (user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        fullName: user.fullName || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData, {
      onSuccess: (res) => {
        toast.success(res.message);
      },
      onError: (error: any) => {
        toast.error(formatErrorMessage(error, "Có lỗi xảy ra khi cập nhật hồ sơ"));
      },
    });
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validation
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast.error("Định dạng file không hỗ trợ. Vui lòng chọn JPG, PNG hoặc WebP.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Kích thước ảnh quá lớn. Vui lòng chọn ảnh dưới 2MB.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    uploadAvatar(formData, {
      onSuccess: (res) => {
        toast.success(res.message);
      },
      onError: (error: any) => {
        toast.error(formatErrorMessage(error, "Có lỗi xảy ra khi tải ảnh lên"));
      },
    });
  };

  if (isUserLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12 md:py-20">
      <div className="relative overflow-hidden rounded-[2.5rem] border border-border bg-card shadow-2xl shadow-primary/5">
        {/* Cover Background */}
        <div className="h-40 w-full bg-linear-to-br from-primary/20 via-primary/10 to-transparent" />
        
        <div className="px-6 pb-10 md:px-12">
          {/* Avatar Section */}
          <div className="relative -mt-16 mb-8 flex flex-col items-center gap-6 sm:flex-row sm:items-end">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
            />
            <div 
              onClick={handleAvatarClick}
              className="group relative h-32 w-32 shrink-0 rounded-3xl border-4 border-background bg-muted shadow-xl overflow-hidden cursor-pointer"
            >
              {user?.avatarUrl ? (
                <Image
                  src={user.avatarUrl}
                  alt={user.fullName}
                  fill
                  className={`object-cover transition-transform duration-500 group-hover:scale-110 ${isUploadingAvatar ? "opacity-30" : ""}`}
                  sizes="128px"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-primary/10 text-primary">
                  <User size={48} strokeWidth={2.5} />
                </div>
              )}
              
              {isUploadingAvatar ? (
                <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                  <Loader2 size={32} className="text-primary animate-spin" />
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                  <Camera className="text-white" size={24} />
                </div>
              )}
            </div>
            
            <div className="flex-1 text-center sm:text-left pb-2">
              <h1 className="text-3xl font-black tracking-tight text-foreground uppercase">
                {user?.fullName}
              </h1>
              <div className="mt-2 inline-flex items-center rounded-xl bg-primary/10 px-3 py-1 text-[10px] font-black text-primary uppercase tracking-widest ring-1 ring-primary/20">
                {user?.role === "PARENT"
                  ? "Phụ Huynh"
                  : user?.role === "ADMIN"
                    ? "Quản Trị Viên"
                    : "Gia Sư"}
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 grid gap-8 md:grid-cols-2">
            {/* Left Column: Basic Info */}
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                  Email (Không thể thay đổi)
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/50" size={18} />
                  <input
                    type="email"
                    value={user?.email || ""}
                    disabled
                    className="h-14 w-full rounded-2xl border-border bg-muted/50 pl-12 pr-4 text-sm font-bold text-muted-foreground cursor-not-allowed tracking-tight"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                  Họ và tên
                </label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" size={18} />
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    required
                    placeholder="Nhập họ tên đầy đủ"
                    className="h-14 w-full rounded-2xl border-border bg-card pl-12 pr-4 text-sm font-bold text-foreground shadow-sm transition-all focus:border-primary/50 focus:ring-4 focus:ring-primary/10 tracking-tight"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                  Số điện thoại
                </label>
                <div className="relative group">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" size={18} />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                    placeholder="Nhập số điện thoại"
                    className="h-14 w-full rounded-2xl border-border bg-card pl-12 pr-4 text-sm font-bold text-foreground shadow-sm transition-all focus:border-primary/50 focus:ring-4 focus:ring-primary/10 tracking-tight"
                  />
                </div>
              </div>
            </div>

            {/* Right Column: Account Status & Actions */}
            <div className="flex flex-col justify-between">
              <div className="rounded-4xl bg-muted/30 p-6 border border-border shadow-inner">
                <div className="flex items-center gap-4 mb-4">
                  <div className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-xl shadow-sm",
                    user?.role === "TUTOR" ? (
                      tutorProfile?.approvalStatus === "APPROVED" ? "bg-emerald-500/10 text-emerald-500" :
                      tutorProfile?.approvalStatus === "PENDING" ? "bg-amber-500/10 text-amber-500" :
                      "bg-rose-500/10 text-rose-500"
                    ) : (
                      user?.isActive ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"
                    )
                  )}>
                    <ShieldCheck size={20} />
                  </div>
                  <div className="flex flex-col">
                    <h3 className={cn(
                      "text-xs font-black uppercase tracking-widest",
                      user?.role === "TUTOR" ? (
                        tutorProfile?.approvalStatus === "APPROVED" ? "text-emerald-700" :
                        tutorProfile?.approvalStatus === "PENDING" ? "text-amber-700" :
                        "text-rose-700"
                      ) : (
                        user?.isActive ? "text-emerald-700" : "text-amber-700"
                      )
                    )}>
                      {user?.role === "TUTOR" ? (
                        tutorProfile?.approvalStatus === "APPROVED" ? "Đối Tác Đã Xác Thực" :
                        tutorProfile?.approvalStatus === "PENDING" ? "Hồ Sơ Đang Xét Duyệt" :
                        "Cần Cập Nhật Hồ Sơ"
                      ) : (
                        user?.isActive ? "Tài Khoản Đã Xác Thực" : "Chờ Kích Hoạt Tài Khoản"
                      )}
                    </h3>
                    {user?.role === "TUTOR" && (
                      <span className={cn(
                        "text-[10px] font-bold opacity-70",
                        tutorProfile?.approvalStatus === "APPROVED" ? "text-emerald-600" :
                        tutorProfile?.approvalStatus === "PENDING" ? "text-amber-600" :
                        "text-rose-600"
                      )}>
                        {tutorProfile?.approvalStatus === "APPROVED" ? "Cấp độ: Chuyên gia" :
                         tutorProfile?.approvalStatus === "PENDING" ? "Đang thẩm định thông tin" :
                         "Vui lòng chỉnh sửa lại"}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link
                  href={ROUTES.CHANGE_PASSWORD}
                  className="flex h-14 flex-1 items-center justify-center gap-3 rounded-2xl bg-muted text-sm font-black uppercase tracking-widest text-foreground border border-border transition-all hover:bg-muted/80 active:scale-95"
                >
                  <KeyRound className="h-4 w-4" />
                  Đổi mật khẩu
                </Link>

                <button
                  type="submit"
                  disabled={isUpdating}
                  className="flex h-14 flex-1 items-center justify-center gap-3 rounded-2xl bg-primary text-sm font-black uppercase tracking-widest text-white shadow-xl shadow-primary/20 transition-all hover:bg-primary/90 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
                >
                  {isUpdating ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      <Save size={18} />
                      Lưu thay đổi
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
