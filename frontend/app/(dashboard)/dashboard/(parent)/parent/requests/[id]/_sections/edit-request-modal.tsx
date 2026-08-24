"use client";

import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogDescription 
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Pencil, Save } from "lucide-react";
import { useUpdateRequest } from "@/server/_actions/request-action";
import { IRequest, IUpdateRequestRequest } from "@/server/_types/request-type";
import { 
  requestFormSchema, 
  RequestFormValues 
} from "@/app/(dashboard)/dashboard/(parent)/parent/requests/new/_sections/schema";
import { BasicInfoSection } from "@/app/(dashboard)/dashboard/(parent)/parent/requests/new/_sections/basic-info-section";
import { NotesSection } from "@/app/(dashboard)/dashboard/(parent)/parent/requests/new/_sections/notes-section";
import { useToggle } from "@/shared/hooks/use-toggle";

interface EditRequestModalProps {
  request: IRequest;
}

export function EditRequestModal({ request }: EditRequestModalProps) {
  const openState = useToggle(false);
  const { mutateAsync: updateRequest, isPending } = useUpdateRequest(request.id);

  const methods = useForm<RequestFormValues>({
    resolver: zodResolver(requestFormSchema),
    defaultValues: {
      subjectId: request.subjectId.toString(),
      studentId: request.studentId.toString(),
      gradeLevel: request.gradeLevel.toString(),
      desiredPrice: request.desiredPrice,
      teachingMode: request.teachingMode,
      preferredArea: request.preferredArea || request.address || "",
      scheduleNote: request.scheduleNote || request.description || "",
      sessionsPerWeek: request.sessionsPerWeek,
    },
  });

  const onSubmit = async (data: RequestFormValues) => {
    let toastId: string | number | undefined;
    try {
      const payload: IUpdateRequestRequest = {
        teachingMode: data.teachingMode as any,
        desiredPrice: data.desiredPrice,
        sessionsPerWeek: String(data.sessionsPerWeek),
        scheduleNote: data.scheduleNote,
        preferredArea: data.preferredArea,
      };

      toastId = toast.loading("Đang cập nhật yêu cầu...");
      await updateRequest(payload);
      toast.success("Cập nhật thành công!", { id: toastId });
      openState.close();
    } catch (error) {
      console.error("Update request error:", error);
      toast.error("Có lỗi xảy ra, vui lòng thử lại.", { id: toastId });
    }
  };

  return (
    <Dialog open={openState.value} onOpenChange={openState.setValue}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 rounded-xl">
          <Pencil size={18} />
          Sửa yêu cầu
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 border-none bg-background/95 backdrop-blur-md shadow-2xl rounded-3xl scrollbar-none">
        <DialogHeader className="p-6 md:p-8 bg-linear-to-br from-blue-600 to-indigo-700 text-white">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <DialogTitle className="text-2xl font-bold">Sửa yêu cầu tìm gia sư</DialogTitle>
              <DialogDescription className="text-blue-100/80 text-sm">Cập nhật lại thông tin để gia sư có cái nhìn chính xác nhất.</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="p-4 md:p-8">
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-8">
              <BasicInfoSection disabledFields={[]} />
              <NotesSection />

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={openState.close}
                  className="rounded-xl h-12 px-6"
                >
                  Hủy
                </Button>
                <Button 
                  type="submit" 
                  disabled={isPending}
                  className="rounded-xl h-12 px-8 bg-blue-600 hover:bg-blue-700 text-white gap-2 shadow-lg shadow-blue-500/20 transition-all active:scale-95"
                >
                  {isPending ? "Đang lưu..." : (
                    <>
                      <Save size={18} />
                      Lưu thay đổi
                    </>
                  )}
                </Button>
              </div>
            </form>
          </FormProvider>
        </div>
      </DialogContent>
    </Dialog>
  );
}
