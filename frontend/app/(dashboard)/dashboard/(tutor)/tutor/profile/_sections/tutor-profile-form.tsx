"use client";

import { useState, useEffect, useCallback } from "react";
import {
  BookOpen,
  MapPin,
  GraduationCap,
  Briefcase,
  Save,
  Loader2,
  Globe,
  Home,
  Zap,
  ChevronDown,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Separator } from "@/shared/components/ui/separator";
import {
  useGetTutorProfile,
  useUpdateTutorProfile,
} from "@/server/_actions/tutor-action";
import { IUpdateTutorRequest } from "@/server/_types/tutor-type";
import { toast } from "sonner";
import { formatErrorMessage } from "@/shared/lib/utils";

export function TutorProfileForm() {
  const { data: profile, isLoading } = useGetTutorProfile();
  const { mutate: updateProfile, isPending: isUpdating } =
    useUpdateTutorProfile();

  const [formData, setFormData] = useState<IUpdateTutorRequest>({
    educationLevel: "BACHELOR",
    experience: "",
    qualifications: "",
    teachingMode: "ONLINE",
    teachingArea: "",
  });

  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (profile && !isInitialized) {
      setFormData({
        educationLevel: profile.educationLevel || "BACHELOR",
        experience: profile.experience || "",
        qualifications: profile.qualifications || "",
        teachingMode: profile.teachingMode || "ONLINE",
        teachingArea: profile.teachingArea || "",
      });
      setIsInitialized(true);
    }
  }, [profile, isInitialized]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();

    // Simple validation
    if (!formData.educationLevel) {
      toast.error("Vui lòng nhập trình độ học vấn");
      return;
    }

    updateProfile(formData, {
      onSuccess: (res: any) => {
        toast.success(res.message || "Cập nhật hồ sơ gia sư thành công");
      },
      onError: (err: any) => {
        toast.error(formatErrorMessage(err, "Có lỗi xảy ra khi cập nhật hồ sơ gia sư"));
      },
    });
  }, [formData, updateProfile]);

  const handleEducationLevelChange = useCallback((val: string) => {
    setFormData(prev => ({ ...prev, educationLevel: val }));
  }, []);

  const handleTeachingModeChange = useCallback((val: string) => {
    setFormData(prev => ({
      ...prev,
      teachingMode: val,
      teachingArea: val === "ONLINE" ? "" : prev.teachingArea,
    }));
  }, []);

  const handleExperienceChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, experience: e.target.value }));
  }, []);

  const handleQualificationsChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, qualifications: e.target.value }));
  }, []);

  const handleTeachingAreaChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, teachingArea: e.target.value }));
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-24 w-full animate-pulse rounded-2xl bg-muted"
          />
        ))}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10 group/form">
      {/* Section 1: Cấu hình chung */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-2 rounded-xl bg-primary/10 text-primary">
            <Zap size={18} />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-foreground">
              Cấu hình chung
            </h3>
            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tight italic">
              Thiết lập các thông tin cơ bản về hồ sơ của bạn
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Education Level */}
          <div className="space-y-3">
            <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-2">
              <GraduationCap size={14} className="text-primary" />
              Trình độ học vấn
            </label>
            <Select
              value={formData.educationLevel}
              onValueChange={handleEducationLevelChange}
            >
              <SelectTrigger className="h-14 w-full rounded-2xl border-border bg-card px-4 text-sm font-bold text-foreground shadow-sm transition-all focus:border-primary/50 focus:ring-4 focus:ring-primary/10 tracking-tight">
                <SelectValue placeholder="Chọn trình độ học vấn..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="HIGH_SCHOOL">THPT (Cấp 3)</SelectItem>
                <SelectItem value="BACHELOR">Đại học / Cử nhân</SelectItem>
                <SelectItem value="MASTER">Thạc sĩ</SelectItem>
                <SelectItem value="PHD">Tiến sĩ</SelectItem>
                <SelectItem value="OTHER">Trình độ khác</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Teaching Mode */}
          <div className="space-y-3">
            <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-2">
              <Globe size={14} className="text-primary" />
              Hình thức dạy
            </label>
            <Select
              key={`teaching-mode-${isInitialized}`}
              value={formData.teachingMode}
              onValueChange={handleTeachingModeChange}
            >
              <SelectTrigger className="h-14 w-full rounded-2xl border-border bg-card px-4 text-sm font-bold text-foreground shadow-sm transition-all focus:border-primary/50 focus:ring-4 focus:ring-primary/10 tracking-tight">
                <SelectValue placeholder="Chọn hình thức dạy..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ONLINE">Online</SelectItem>
                <SelectItem value="OFFLINE">Offline</SelectItem>
                <SelectItem value="BOTH">Cả hai hình thức</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Separator className="bg-border/50" />

      {/* Section 2: Kinh nghiệm & Chuyên môn */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-2 rounded-xl bg-primary/10 text-primary">
            <BookOpen size={18} />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-foreground">
              Kinh nghiệm & Chuyên môn
            </h3>
            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tight italic">
              Mô tả chi tiết năng lực và quá trình giảng dạy của bạn
            </p>
          </div>
        </div>

        {/* Experience */}
        <div className="space-y-3">
          <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-2">
            <Briefcase size={14} className="text-primary" />
            Kinh nghiệm giảng dạy
          </label>
          <textarea
            value={formData.experience}
            onChange={handleExperienceChange}
            rows={4}
            placeholder="Mô tả chi tiết kinh nghiệm giảng dạy của bạn (ví dụ: 3 năm dạy tại trung tâm, kinh nghiệm ôn thi đại học...)"
            className="w-full rounded-2xl border-border bg-card p-4 text-sm font-bold text-foreground shadow-sm transition-all focus:border-primary/50 focus:ring-4 focus:ring-primary/10 tracking-tight leading-relaxed min-h-30"
          />
        </div>

        {/* Qualifications */}
        <div className="space-y-3">
          <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-2">
            <BookOpen size={14} className="text-primary" />
            Bằng cấp & Chứng chỉ
          </label>
          <textarea
            value={formData.qualifications}
            onChange={handleQualificationsChange}
            rows={5}
            placeholder="Liệt kê các bằng cấp, chứng chỉ sư phạm hoặc chuyên môn liên quan của bạn..."
            className="w-full rounded-2xl border-border bg-card p-4 text-sm font-bold text-foreground shadow-sm transition-all focus:border-primary/50 focus:ring-4 focus:ring-primary/10 tracking-tight leading-relaxed min-h-40"
          />
        </div>
      </div>

      <Separator className="bg-border/50" />

      {/* Section 3: Địa điểm hoạt động */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-2 rounded-xl bg-primary/10 text-primary">
            <MapPin size={18} />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-foreground">
              Khu vực hoạt động
            </h3>
            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tight italic">
              Thông tin về phạm vi di chuyển (nếu có)
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-2">
            <MapPin size={14} className="text-primary" />
            Khu vực dạy (nếu có)
          </label>
          <input
            type="text"
            value={formData.teachingArea}
            onChange={handleTeachingAreaChange}
            disabled={formData.teachingMode === "ONLINE"}
            placeholder={
              formData.teachingMode === "ONLINE"
                ? "Không áp dụng cho dạy Online"
                : "Ví dụ: Quận 1, Quận 7, TP.HCM..."
            }
            className={`h-14 w-full rounded-2xl border-border bg-card px-4 text-sm font-bold text-foreground shadow-sm transition-all focus:border-primary/50 focus:ring-4 focus:ring-primary/10 tracking-tight ${
              formData.teachingMode === "ONLINE"
                ? "opacity-50 cursor-not-allowed bg-muted"
                : ""
            }`}
          />
          <p className="text-[10px] text-muted-foreground italic ml-1">
            {formData.teachingMode === "ONLINE"
              ? "* Bạn đang chọn hình thức Online nên không cần điền khu vực này."
              : "* Vui lòng liệt kê các Quận/Huyện bạn có thể đến dạy tận nơi."}
          </p>
        </div>
      </div>

      <div className="pt-6">
        <button
          type="submit"
          disabled={isUpdating}
          className="flex h-16 w-full items-center justify-center gap-3 rounded-2xl bg-primary text-sm font-black uppercase tracking-widest text-white shadow-xl shadow-primary/20 transition-all hover:bg-primary/90 active:scale-95 disabled:opacity-50 group-hover/form:-translate-y-0.5 duration-300"
        >
          {isUpdating ? (
            <Loader2 className="h-6 w-6 animate-spin text-white" />
          ) : (
            <>
              <Save
                size={20}
                className="group-hover:rotate-12 transition-transform"
              />
              Cập nhật hồ sơ chuyên môn
            </>
          )}
        </button>
      </div>
    </form>
  );
}
