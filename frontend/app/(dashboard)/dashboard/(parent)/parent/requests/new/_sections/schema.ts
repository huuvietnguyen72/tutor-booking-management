import * as z from "zod";

export const requestFormSchema = z.object({
  subjectId: z.string().min(1, "Vui lòng chọn môn học"),
  studentId: z.string().min(1, "Vui lòng chọn học sinh"),
  gradeLevel: z.string().min(1, "Vui lòng chọn lớp"),
  desiredPrice: z.number().min(50000, "Lương tối thiểu 50,000đ/buổi"),
  teachingMode: z.enum(["ONLINE", "OFFLINE", "BOTH"]),
  preferredArea: z.string().optional(),
  scheduleNote: z.string().min(10, "Ghi chú & Yêu cầu ít nhất 10 ký tự"),
  sessionsPerWeek: z.number().min(1, "Ít nhất 1 buổi/tuần").max(7, "Tối đa 7 buổi/tuần"),
});

export type RequestFormValues = z.infer<typeof requestFormSchema>;
