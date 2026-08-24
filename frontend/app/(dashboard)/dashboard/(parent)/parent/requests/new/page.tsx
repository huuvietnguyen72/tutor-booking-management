"use client";

import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ROUTES } from "@/shared/constants/app";
import { useCreateRequest } from "@/server/_actions/request-action";

// Sub-components
import { FormHeader } from "@/app/(dashboard)/dashboard/(parent)/parent/requests/new/_sections/form-header";
import { BasicInfoSection } from "@/app/(dashboard)/dashboard/(parent)/parent/requests/new/_sections/basic-info-section";
import { NotesSection } from "@/app/(dashboard)/dashboard/(parent)/parent/requests/new/_sections/notes-section";
import { FormActions } from "@/app/(dashboard)/dashboard/(parent)/parent/requests/new/_sections/form-actions";

import {
  requestFormSchema,
  RequestFormValues,
} from "@/app/(dashboard)/dashboard/(parent)/parent/requests/new/_sections/schema";

export default function NewRequestPage() {
  const router = useRouter();
  const methods = useForm<RequestFormValues>({
    resolver: zodResolver(requestFormSchema),
    defaultValues: {
      subjectId: "",
      studentId: "",
      gradeLevel: "",
      desiredPrice: 200000,
      teachingMode: "OFFLINE",
      preferredArea: "",
      scheduleNote: "",
      sessionsPerWeek: 2,
    },
  });

  const { handleSubmit } = methods;
  const { mutateAsync: createRequest } = useCreateRequest();

  const onSubmit = async (data: RequestFormValues) => {
    let toastId: string | number | undefined;
    try {
      // Mapping gradeLevel: "1" -> 1, ..., "12" -> 12, "Other" -> 13
      const gradeLevelNum =
        data.gradeLevel === "other" ? 13 : Number(data.gradeLevel);

      const requestPayload = {
        subjectId: Number(data.subjectId),
        studentId: Number(data.studentId),
        gradeLevel: gradeLevelNum,
        teachingMode: data.teachingMode,
        desiredPrice: data.desiredPrice,
        sessionsPerWeek: String(data.sessionsPerWeek),
        description: data.scheduleNote,
        address: data.preferredArea,
      };

      toastId = toast.loading("Đang gửi yêu cầu tìm gia sư...");
      await createRequest(requestPayload);
      toast.success("Đăng yêu cầu thành công!", { id: toastId });
      router.push(ROUTES.PARENT.REQUESTS);
    } catch (error) {
      console.error("Create request error:", error);
      toast.error("Có lỗi xảy ra, vui lòng thử lại.", { id: toastId });
    }
  };

  return (
    <FormProvider {...methods}>
      <div className="max-w-4xl mx-auto space-y-3.5 md:space-y-8 p-2.5 md:p-8">
        <FormHeader
          title="Đăng yêu cầu tìm gia sư"
          description="Cung cấp thông tin chi tiết để tìm được gia sư phù hợp nhất."
        />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <BasicInfoSection />
          <NotesSection />
          <FormActions />
        </form>
      </div>
    </FormProvider>
  );
}
