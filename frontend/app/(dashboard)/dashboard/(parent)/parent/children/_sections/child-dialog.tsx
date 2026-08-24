"use client";

import React, { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { User } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { FormField } from "@/shared/components/ui/form-field";
import { Textarea } from "@/shared/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { AcademicStatus } from "@/shared/types/child";
import { cn } from "@/shared/lib/utils";

import { CHILD_STATUS_STYLES } from "@/shared/constants/child-styles";

import { IStudent, AcademicLevel } from "@/server/_types/student-type";

const childSchema = z.object({
  fullName: z.string().min(2, "Họ tên phải có ít nhất 2 ký tự"),
  grade: z.string().min(1, "Vui lòng chọn lớp"),
  school: z.string().min(1, "Vui lòng nhập tên trường"),
  academicLevel: z.enum(["EXCELLENT", "GOOD", "AVERAGE", "WEAK"]),
  specialNotes: z.string().optional(),
  avatarBgColor: z.string().min(1),
});

type ChildFormValues = z.infer<typeof childSchema>;

interface ChildDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<IStudent, "id" | "parentId"> & { id?: number }) => void;
  initialData?: IStudent | null;
}

const GRADES = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
const STATUS_OPTIONS: { label: string; value: AcademicStatus }[] = [
  { label: "Giỏi", value: "EXCELLENT" },
  { label: "Khá", value: "GOOD" },
  { label: "Trung bình", value: "AVERAGE" },
  { label: "Yếu", value: "WEAK" },
];

export function ChildDialog({ isOpen, onClose, onSubmit, initialData }: ChildDialogProps) {
  const isEdit = !!initialData;

  const form = useForm<ChildFormValues>({
    resolver: zodResolver(childSchema),
    defaultValues: {
      fullName: "",
      grade: "",
      school: "",
      academicLevel: "GOOD",
      specialNotes: "",
      avatarBgColor: "bg-blue-50",
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = form;


  useEffect(() => {
    if (initialData) {
      reset({
        fullName: initialData.fullName,
        grade: String(initialData.grade),
        school: initialData.school || "",
        academicLevel: initialData.academicLevel || "GOOD",
        specialNotes: initialData.specialNotes || "",
        avatarBgColor: "bg-blue-50",
      });
    } else {
      reset({
        fullName: "",
        grade: "",
        school: "",
        academicLevel: "GOOD",
        specialNotes: "",
        avatarBgColor: "bg-blue-50",
      });
    }
  }, [initialData, reset, isOpen]);

  const onFormSubmit = (values: ChildFormValues) => {
    onSubmit({
      fullName: values.fullName,
      grade: Number(values.grade),
      school: values.school,
      academicLevel: values.academicLevel,
      specialNotes: values.specialNotes,
      id: initialData?.id,
    } as any);
    onClose();
  };


  const academicLevel = useWatch({ control, name: "academicLevel" });
  const grade = useWatch({ control, name: "grade" });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[95vh] overflow-y-auto sm:max-w-[540px] border-border bg-background p-0 rounded-4xl gap-0">
        <DialogHeader className="p-6 md:p-8 border-b border-border bg-card/50">
          <DialogTitle className="text-2xl font-black text-foreground tracking-tight">
            {isEdit ? "SỬA THÔNG TIN BÉ" : "THÊM BÉ MỚI"}
          </DialogTitle>
          <DialogDescription className="text-sm font-medium text-muted-foreground mt-1">
            Vui lòng điền thông tin chi tiết dưới đây để hoàn thiện hồ sơ học tập của bé.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)} className="p-6 md:p-8 space-y-8">
          {/* Avatar placeholder - avatar not stored in DB */}
          {/* <div className="flex flex-col items-center justify-center space-y-4">
            <div
              className={cn(
                "relative h-28 w-28 overflow-hidden rounded-full border-4 border-card shadow-2xl ring-2 ring-primary/10 ring-offset-2 ring-offset-background",
                CHILD_STATUS_STYLES[academicLevel as AcademicStatus]?.avatar || "bg-blue-50/50"
              )}
            >
              <div className="flex h-full w-full items-center justify-center bg-muted/50">
                <User size={40} className="text-muted-foreground opacity-50" />
              </div>
            </div>
          </div> */}

          <div className="grid grid-cols-1 gap-6">
            <FormField
              label="Họ và tên của bé"
              placeholder="Nhập đầy đủ họ và tên"
              error={errors.fullName?.message}
              {...register("fullName")}
              className="rounded-xl border-border bg-card focus-visible:ring-primary h-12"
            />

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Lớp Học</label>
                <Select
                  onValueChange={(v) => setValue("grade", v)}
                  value={grade}
                >
                  <SelectTrigger className={cn("h-12 rounded-xl border-border bg-card focus:ring-primary", errors.grade && "border-red-400 ring-red-400/20")}>
                    <SelectValue placeholder="Chọn lớp" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-border bg-popover shadow-2xl">
                    {GRADES.map((grade) => (
                      <SelectItem key={grade} value={grade} className="py-2.5 rounded-lg focus:bg-primary/10">
                        Lớp {grade}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.grade && (
                  <p className="text-[10px] font-bold text-red-500 mt-1 ml-1">{errors.grade.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Học Lực Hiện Tại</label>
                <Select
                  onValueChange={(v) => setValue("academicLevel", v as AcademicLevel)}
                  value={academicLevel}
                >
                  <SelectTrigger className="h-12 rounded-xl border-border bg-card focus:ring-primary">
                    <SelectValue placeholder="Chọn học lực" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-border bg-popover shadow-2xl">
                    {STATUS_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value} className="py-2.5 rounded-lg focus:bg-primary/10">
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <FormField
              label="Trường đang theo học"
              placeholder="Tên trường tiểu học / trung học"
              error={errors.school?.message}
              {...register("school")}
              className="rounded-xl border-border bg-card focus-visible:ring-primary h-12"
            />

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Ghi chú về bé (không bắt buộc)</label>
              <Textarea
                placeholder="Ví dụ: Bé cần tập trung môn Toán hơn, bé khá nhút nhát..."
                {...register("specialNotes")}
                className="min-h-[100px] rounded-2xl border-border bg-card focus-visible:ring-primary p-4 resize-none leading-relaxed"
              />
            </div>
          </div>

          <DialogFooter className="flex flex-col-reverse sm:flex-row gap-3 pt-6 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 h-12 rounded-xl border-border bg-transparent font-bold text-xs uppercase tracking-wider text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
            >
              Hủy bỏ
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 h-12 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-primary/20 active:scale-[0.98] transition-all"
            >
              {isEdit ? "Cập nhật hồ sơ" : "Thêm vào danh sách"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
