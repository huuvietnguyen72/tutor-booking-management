"use client";

import { useState } from "react";
import { ChildrenHeader } from "./_sections/children-header";
import { ChildrenList } from "./_sections/children-list";
import { ChildDialog } from "./_sections/child-dialog";
import { toast } from "sonner";
import { ConfirmDialog } from "@/shared/components/ui/confirm-dialog";
import { 
  useGetMyStudents, 
  useCreateStudent, 
  useUpdateStudent, 
  useDeleteStudent 
} from "@/server/_actions/student-action";
import { IStudent } from "@/server/_types/student-type";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { formatErrorMessage } from "@/shared/lib/utils";

export default function ChildrenManagementPage() {
  const { data: students = [], isLoading, isError, error: studentsError } = useGetMyStudents();
  const createStudent = useCreateStudent();
  const updateStudent = useUpdateStudent();
  const deleteStudent = useDeleteStudent();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedChild, setSelectedChild] = useState<IStudent | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [childToDelete, setChildToDelete] = useState<IStudent | null>(null);

  const handleOpenAddDialog = () => {
    setSelectedChild(null);
    setIsDialogOpen(true);
  };

  const handleOpenEditDialog = (child: IStudent) => {
    setSelectedChild(child);
    setIsDialogOpen(true);
  };

  const handleSubmit = (data: Omit<IStudent, "id" | "parentId"> & { id?: number }) => {
    if (data.id) {
      const toastId = toast.loading(`Đang cập nhật hồ sơ bé ${data.fullName}...`);
      updateStudent.mutate(data as IStudent, {
        onSuccess: () => {
          toast.success(`Đã cập nhật hồ sơ bé ${data.fullName} thành công!`, { id: toastId });
          setIsDialogOpen(false);
        },
        onError: (error: any) => {
          toast.error(formatErrorMessage(error, "Không thể cập nhật hồ sơ. Vui lòng thử lại."), { id: toastId });
        }
      });
    } else {
      const toastId = toast.loading(`Đang thêm hồ sơ bé ${data.fullName}...`);
      createStudent.mutate(data, {
        onSuccess: () => {
          toast.success(`Đã thêm bé ${data.fullName} vào danh sách thành công!`, { id: toastId });
          setIsDialogOpen(false);
        },
        onError: (error: any) => {
          toast.error(formatErrorMessage(error, "Không thể thêm hồ sơ. Vui lòng thử lại."), { id: toastId });
        }
      });
    }
  };

  const handleDeleteChild = (id: number) => {
    const child = students.find((c) => c.id === id);
    if (child) {
      setChildToDelete(child);
      setIsConfirmOpen(true);
    }
  };

  const handleConfirmDelete = () => {
    if (childToDelete) {
      const toastId = toast.loading(`Đang xóa hồ sơ bé ${childToDelete.fullName}...`);
      deleteStudent.mutate(childToDelete.id, {
        onSuccess: () => {
          toast.success(`Đã xóa thành công hồ sơ bé ${childToDelete.fullName}`, { id: toastId });
          setIsConfirmOpen(false);
          setChildToDelete(null);
        },
        onError: (error: any) => {
          toast.error(formatErrorMessage(error, "Không thể xóa hồ sơ. Vui lòng thử lại."), { id: toastId });
        }
      });
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="-mx-4 mb-4 px-4 pt-8 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <ChildrenHeader onAddClick={handleOpenAddDialog} />
      </div>

      <div className="pb-8">
        {isLoading ? (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <Skeleton className="h-75 w-full rounded-4xl bg-muted" />
            <Skeleton className="h-75 w-full rounded-4xl bg-muted" />
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-destructive font-bold">{formatErrorMessage(studentsError, "Đã xảy ra lỗi khi tải danh sách hồ sơ.")}</p>
          </div>
        ) : (
          <ChildrenList 
            childrenRecords={students} 
            onEditClick={handleOpenEditDialog}
            onDeleteClick={handleDeleteChild}
          />
        )}
      </div>

      <ChildDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleSubmit}
        initialData={selectedChild}
      />

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Xác nhận xóa"
        description={`Bạn có chắc chắn muốn xóa hồ sơ của bé ${childToDelete?.fullName}? Hành động này không thể hoàn tác.`}
        confirmText="Xóa ngay"
        cancelText="Hủy"
        variant="danger"
      />
    </div>
  );
}

