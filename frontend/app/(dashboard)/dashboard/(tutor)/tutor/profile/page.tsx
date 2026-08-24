"use client";

import { useRef, useState, useEffect, useCallback } from "react";
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
  Fingerprint,
  KeyRound,
  Lock
} from "lucide-react";
import { useGetMe, useUpdateProfile, useUpdateAvatar } from "@/server/_actions/auth-action";
import { useGetTutorProfile } from "@/server/_actions/tutor-action";
import { TutorProfileForm } from "./_sections/tutor-profile-form";
import { toast } from "sonner";
import Link from "next/link";
import { ROUTES } from "@/shared/constants/app";
import { cn, formatErrorMessage } from "@/shared/lib/utils";

export default function TutorProfilePage() {
  const { data: user, isLoading: isUserLoading } = useGetMe();
  const { data: tutorProfile, isLoading: isTutorLoading } = useGetTutorProfile();
  const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile();
  const { mutate: uploadAvatar, isPending: isUploadingAvatar } = useUpdateAvatar();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  const handleSubmitBasic = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData, {
      onSuccess: (res) => {
        toast.success(res.message);
      },
      onError: (error: any) => {
        toast.error(formatErrorMessage(error, "Có lỗi xảy ra khi cập nhật hồ sơ"));
      },
    });
  }, [formData, updateProfile]);

  const handleAvatarClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
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

    const formDataObj = new FormData();
    formDataObj.append("file", file);

    uploadAvatar(formDataObj, {
      onSuccess: (res) => {
        toast.success(res.message);
      },
      onError: (error: any) => {
        toast.error(formatErrorMessage(error, "Có lỗi xảy ra khi tải ảnh lên"));
      },
    });
  }, [uploadAvatar]);

  const handleFullNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, fullName: e.target.value }));
  }, []);

  const handlePhoneChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, phone: e.target.value }));
  }, []);

  if (isUserLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8 md:py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Avatar & Basic Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="relative overflow-hidden rounded-4xl border border-border bg-card shadow-xl shadow-primary/5">
            <div className="h-32 w-full bg-linear-to-br from-primary/20 via-primary/10 to-transparent" />
            
            <div className="px-6 pb-8">
              <div className="relative -mt-16 mb-6 flex flex-col items-center">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                />
                <div 
                  onClick={handleAvatarClick}
                  className="group relative h-32 w-32 rounded-4xl border-4 border-background bg-muted shadow-2xl overflow-hidden cursor-pointer"
                >
                  {user?.avatarUrl ? (
                    <Image
                      src={user.avatarUrl}
                      alt={user.fullName}
                      fill
                      loading="eager"
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
                
                <div className="mt-4 text-center">
                  <h2 className="text-xl font-black tracking-tight text-foreground uppercase">
                    {user?.fullName}
                  </h2>
                  <p className="text-xs font-bold text-muted-foreground mt-1">ID: GS-{user?.id?.toString().slice(-6).toUpperCase()}</p>
                </div>
              </div>

              <form onSubmit={handleSubmitBasic} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                    Địa chỉ Email
                  </label>
                  <input
                    type="email"
                    value={user?.email || ""}
                    disabled
                    readOnly
                    className="h-12 w-full rounded-xl border-border bg-muted/50 px-4 text-xs font-bold text-muted-foreground cursor-not-allowed opacity-70"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                    Họ và tên
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={handleFullNameChange}
                    className="h-12 w-full rounded-xl border-border bg-muted/30 px-4 text-xs font-bold text-foreground focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    className="h-12 w-full rounded-xl border-border bg-muted/30 px-4 text-xs font-bold text-foreground focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
                <Button 
                   type="submit" 
                   disabled={isUpdating}
                   className="w-full mt-2 h-12 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white font-black uppercase tracking-widest text-[10px] shadow-none"
                >
                  {isUpdating ? <Loader2 size={16} className="animate-spin" /> : "Cập nhật cơ bản"}
                </Button>
              </form>
            </div>
          </div>

          {/* Account Integrity */}
          <div className={cn(
            "rounded-4xl border p-6 transition-all duration-500",
            tutorProfile?.approvalStatus === "APPROVED" ? "bg-emerald-500/5 border-emerald-500/10" :
            tutorProfile?.approvalStatus === "PENDING" ? "bg-amber-500/5 border-amber-500/10" :
            "bg-rose-500/5 border-rose-500/10"
          )}>
             <div className="flex items-center gap-3 mb-4">
                <div className={cn(
                  "h-10 w-10 flex items-center justify-center rounded-xl",
                  tutorProfile?.approvalStatus === "APPROVED" ? "bg-emerald-500/20 text-emerald-600" :
                  tutorProfile?.approvalStatus === "PENDING" ? "bg-amber-500/20 text-amber-600" :
                  "bg-rose-500/20 text-rose-600"
                )}>
                   <ShieldCheck size={20} strokeWidth={2.5} />
                </div>
                <div>
                   <h3 className={cn(
                     "text-xs font-black uppercase tracking-widest",
                     tutorProfile?.approvalStatus === "APPROVED" ? "text-emerald-700" :
                     tutorProfile?.approvalStatus === "PENDING" ? "text-amber-700" :
                     "text-rose-700"
                   )}>
                     {tutorProfile?.approvalStatus === "APPROVED" ? "Đối Tác Đã Xác Thực" :
                      tutorProfile?.approvalStatus === "PENDING" ? "Hồ Sơ Đang Xét Duyệt" :
                      "Cần Cập Nhật Hồ Sơ"}
                   </h3>
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
                </div>
             </div>
             <p className={cn(
               "text-[11px] font-medium leading-relaxed mb-6",
               tutorProfile?.approvalStatus === "APPROVED" ? "text-emerald-800/70" :
               tutorProfile?.approvalStatus === "PENDING" ? "text-amber-800/70" :
               "text-rose-800/70"
             )}>
               {tutorProfile?.approvalStatus === "APPROVED" ? (
                 "Chúc mừng! Hồ sơ của bạn đã vượt qua các bước đối soát chuyên môn và sẵn sàng tiếp nhận lớp."
               ) : tutorProfile?.approvalStatus === "PENDING" ? (
                 "Quản trị viên đang thẩm định thông tin và bằng cấp của bạn. Vui lòng kiên nhẫn đợi trong 24h làm việc."
               ) : (
                 tutorProfile?.rejectionReason || "Một số thông tin chưa đạt yêu cầu. Đừng lo lắng, hãy điều chỉnh theo hướng dẫn của Admin để được duyệt lại."
               )}
             </p>
             
             <Link
                href={ROUTES.CHANGE_PASSWORD}
                className="w-full flex items-center justify-center gap-2 h-11 rounded-xl bg-orange-500/10 text-orange-600 hover:bg-orange-500 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest"
             >
                <Lock size={14} />
                Đổi mật khẩu
             </Link>
          </div>
        </div>

        {/* Right Column: Tutor Details */}
        <div className="lg:col-span-2 space-y-8">
           <div className="rounded-4xl border border-border bg-card p-6 md:p-10 shadow-xl shadow-primary/5">
              <div className="flex items-center gap-4 mb-8">
                 <div className="h-12 w-12 flex items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-inner">
                    <Fingerprint size={24} strokeWidth={2.5} />
                 </div>
                 <div>
                    <h2 className="text-xl font-black tracking-tight text-foreground uppercase">Thông tin chuyên môn</h2>
                    <p className="text-sm font-medium text-muted-foreground italic">Phần thông tin này sẽ hiển thị với phụ huynh và học sinh.</p>
                 </div>
              </div>
              
              <TutorProfileForm />
           </div>
        </div>
      </div>
    </div>
  );
}

function Button({ children, className, ...props }: any) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
