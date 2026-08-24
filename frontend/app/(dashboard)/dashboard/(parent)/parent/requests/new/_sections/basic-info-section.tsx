"use client";

import { BookOpen, MapPin, DollarSign, User } from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { cn } from "@/shared/lib/utils";
import { useFormContext } from "react-hook-form";
import { RequestFormValues } from "./schema";
import { useGetAllSubjects } from "@/server/_actions/tutor-action";
import { useGetMyStudents } from "@/server/_actions/student-action";

interface BasicInfoSectionProps {
  disabledFields?: Array<keyof RequestFormValues>;
}

export function BasicInfoSection({ disabledFields = [] }: BasicInfoSectionProps) {
  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = useFormContext<RequestFormValues>();

  const selectedMethod = watch("teachingMode");
  const { data: subjects = [] } = useGetAllSubjects();
  const { data: students = [] } = useGetMyStudents();

  return (
    <div className="bg-card border border-border rounded-2xl md:rounded-3xl p-4 sm:p-6 md:p-8 space-y-6 shadow-sm">
      <div className="flex items-center gap-3 border-b border-border pb-4">
        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-xl">
          <BookOpen size={20} />
        </div>
        <h2 className="text-xl font-bold">Thông tin lớp học</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label className="text-sm font-bold ml-1">Học sinh (Con cái)</Label>
          <Select 
            disabled={disabledFields.includes("studentId")}
            value={watch("studentId")}
            onValueChange={(val) => {
              setValue("studentId", val, { shouldValidate: true });
              const selectedStudent = students.find(s => s.id.toString() === val);
              if (selectedStudent?.grade) {
                setValue("gradeLevel", selectedStudent.grade.toString(), { shouldValidate: true });
              }
            }}
          >
            <SelectTrigger className="h-12 rounded-xl focus:ring-blue-600">
              <SelectValue placeholder="Chọn học sinh" />
            </SelectTrigger>
            <SelectContent>
              {students.map((student) => (
                <SelectItem key={student.id} value={student.id.toString()}>
                  {student.fullName} (Lớp {student.grade || "N/A"})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.studentId && (
            <p className="text-xs text-destructive font-medium ml-1">
              {String(errors.studentId.message)}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-bold ml-1">Môn học</Label>
          <Select 
            disabled={disabledFields.includes("subjectId")}
            value={watch("subjectId")}
            onValueChange={(val) => setValue("subjectId", val, { shouldValidate: true })}
          >
            <SelectTrigger className="h-12 rounded-xl focus:ring-blue-600">
              <SelectValue placeholder="Chọn môn học" />
            </SelectTrigger>
            <SelectContent>
              {subjects.map((subject) => (
                <SelectItem key={subject.id} value={subject.id.toString()}>
                  {subject.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.subjectId && (
            <p className="text-xs text-destructive font-medium ml-1">
              {String(errors.subjectId.message)}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-bold ml-1">Lớp / Cấp độ</Label>
          <Select 
            disabled={disabledFields.includes("gradeLevel")}
            value={watch("gradeLevel")}
            onValueChange={(val) => setValue("gradeLevel", val, { shouldValidate: true })}
          >
            <SelectTrigger className="h-12 rounded-xl focus:ring-blue-600">
              <SelectValue placeholder="Chọn lớp" />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map((val) => (
                <SelectItem key={val} value={val.toString()}>
                  {val === 13 ? "Ôn thi Đại học / Khác" : `Lớp ${val}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.gradeLevel && (
            <p className="text-xs text-destructive font-medium ml-1">
              {String(errors.gradeLevel.message)}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-bold ml-1">
            Mức lương mong muốn (VNĐ/buổi)
          </Label>
          <div className="relative">
            <DollarSign
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={18}
            />
            <Input
              type="number"
              placeholder="200,000"
              className="h-12 pl-10 rounded-xl focus:ring-blue-600 font-mono text-base"
              {...register("desiredPrice", { valueAsNumber: true })}
            />
          </div>
          {errors.desiredPrice && (
            <p className="text-xs text-destructive font-medium ml-1">
              {String(errors.desiredPrice.message)}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-bold ml-1">Số buổi / tuần</Label>
          <Input
            type="number"
            placeholder="2"
            className="h-12 rounded-xl focus:ring-blue-600 text-base"
            {...register("sessionsPerWeek", { valueAsNumber: true })}
          />
          {errors.sessionsPerWeek && (
            <p className="text-xs text-destructive font-medium ml-1">
              {String(errors.sessionsPerWeek.message)}
            </p>
          )}
        </div>

        <div className="space-y-3 col-span-1 md:col-span-2">
          <Label className="text-sm font-bold ml-1">Hình thức học</Label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { label: "Tại nhà", value: "OFFLINE" },
              { label: "Online", value: "ONLINE" },
              { label: "Cả hai", value: "BOTH" },
            ].map((m) => (
              <label
                key={m.value}
                className={cn(
                  "flex items-center justify-center gap-2 h-12 rounded-xl border-2 cursor-pointer transition-all font-bold text-[13px] md:text-sm",
                  selectedMethod === m.value
                    ? "border-blue-600 bg-blue-50 text-blue-600 dark:bg-blue-900/20"
                    : "border-border hover:border-blue-200 dark:hover:border-blue-800",
                )}
              >
                <input
                  type="radio"
                  className="hidden"
                  value={m.value}
                  checked={selectedMethod === m.value}
                  onChange={() => setValue("teachingMode", m.value as any)}
                />
                {m.label}
              </label>
            ))}
          </div>
        </div>
      </div>

      {selectedMethod !== "ONLINE" && (
        <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
          <Label className="text-sm font-bold ml-1">
            Địa chỉ cụ thể / Khu vực
          </Label>
          <div className="relative">
            <MapPin
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={18}
            />
            <Input
              placeholder="Ví dụ: Số 12, Ngõ 34, Cầu Giấy, Hà Nội"
              className="h-12 pl-10 rounded-xl focus:ring-blue-600"
              {...register("preferredArea")}
            />
          </div>
        </div>
      )}
    </div>
  );
}
