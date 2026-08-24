"use client";

import { useGetSubjects, useCreateSubject, useUpdateSubject, useDeleteSubject } from "@/server/_actions/admin-action";
import { SubjectResponse } from "@/server/_types/admin-type";
import { Card } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Plus, Edit2, Trash2, Library, Users, ArrowRight, Save, X, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { useState, useCallback, useMemo, memo } from "react";
import { ConfirmDialog } from "@/shared/components/ui/confirm-dialog";
import { formatErrorMessage } from "@/shared/lib/utils";

const SubjectEditCard = memo(function SubjectEditCard({ subject, formData, onSave, onCancel, onNameChange, onDescChange }: any) {
  return (
    <Card className="p-6 border-2 border-dashed border-primary/40 bg-primary/5 rounded-4xl flex flex-col gap-4 animate-in zoom-in-95 duration-300">
      <div className="space-y-4">
        <input
          autoFocus
          placeholder="Tên môn học..."
          className="w-full bg-background border-none rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 ring-primary"
          value={formData.name}
          onChange={onNameChange}
        />
        <textarea
          placeholder="Mô tả ngắn..."
          className="w-full bg-background border-none rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 ring-primary min-h-25"
          value={formData.description}
          onChange={onDescChange}
        />
      </div>
      <div className="flex gap-2 mt-auto">
        <Button onClick={() => onSave(subject?.id)} className="flex-1 rounded-xl font-black bg-primary">LƯU</Button>
        <Button onClick={onCancel} variant="ghost" className="rounded-xl">HỦY</Button>
      </div>
    </Card>
  );
});

const SubjectCard = memo(function SubjectCard({ subject, onEdit, onDelete }: any) {
  return (
    <Card className="p-8 border-none shadow-xl shadow-black/5 bg-card/60 backdrop-blur-sm rounded-4xl group hover:bg-card hover:scale-[1.02] transition-all duration-500 relative overflow-hidden">
      <>
        <div className="flex justify-between items-start mb-6">
          <div className="p-4 bg-primary/10 rounded-2xl text-primary shadow-inner group-hover:bg-primary group-hover:text-white transition-all duration-500 group-hover:rotate-12">
            <Library size={28} />
          </div>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg hover:bg-primary/10 hover:text-primary"
              onClick={() => onEdit(subject)}
            >
              <Edit2 size={14} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg hover:bg-destructive/10 hover:text-destructive"
              onClick={() => onDelete(subject.id)}
            >
              <Trash2 size={14} />
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-black group-hover:text-primary transition-colors">{subject.name}</h3>
          <p className="text-sm font-medium text-muted-foreground leading-relaxed line-clamp-2">
            {subject.description}
          </p>
        </div>

        <div className="mt-8 pt-6 border-t border-border/50 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-black text-muted-foreground/60 uppercase tracking-widest">
            <Users size={14} />
            {subject.tutorCount} Gia sư
          </div>
          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
            <ArrowRight size={14} />
          </div>
        </div>
      </>

      <div className="absolute -right-4 -bottom-4 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity duration-500 pointer-events-none">
        <Library size={120} />
      </div>
    </Card>
  );
});

const SubjectManagementPage = () => {
  const { data: subjects, isLoading } = useGetSubjects();
  const createMutation = useCreateSubject();
  const updateMutation = useUpdateSubject();
  const deleteMutation = useDeleteSubject();

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const handleNameChange = useCallback((e: any) => {
    setFormData(prev => ({ ...prev, name: e.target.value }));
  }, []);

  const handleDescChange = useCallback((e: any) => {
    setFormData(prev => ({ ...prev, description: e.target.value }));
  }, []);

  const handleCreateClick = useCallback(() => {
    setIsAdding(true);
    setFormData({ name: "", description: "" });
  }, []);

  const handleCreate = useCallback(() => {
    if (!formData.name) return toast.error("Vui lòng nhập tên môn học");
    const toastId = toast.loading("Đang thêm môn học mới...");
    createMutation.mutate(formData, {
      onSuccess: () => {
        toast.success("Đã thêm môn học mới!", { id: toastId });
        setIsAdding(false);
        setFormData({ name: "", description: "" });
      },
      onError: (err: any) => {
        toast.error(formatErrorMessage(err, "Không thể thêm môn học. Vui lòng thử lại."), { id: toastId });
      }
    });
  }, [formData, createMutation]);

  const handleUpdate = useCallback((id: number) => {
    const toastId = toast.loading("Đang cập nhật môn học...");
    updateMutation.mutate({ id, ...formData }, {
      onSuccess: () => {
        toast.success("Đã cập nhật môn học!", { id: toastId });
        setEditingId(null);
        setFormData({ name: "", description: "" });
      },
      onError: (err: any) => {
        toast.error(formatErrorMessage(err, "Không thể cập nhật môn học. Vui lòng thử lại."), { id: toastId });
      }
    });
  }, [formData, updateMutation]);

  const handleDelete = useCallback((id: number) => {
    setDeleteId(id);
  }, []);

  const handleEditSubject = useCallback((subject: SubjectResponse) => {
    setEditingId(subject.id);
    setFormData({ name: subject.name, description: subject.description });
  }, []);

  const handleCancelEdit = useCallback(() => {
    setEditingId(null);
    setFormData({ name: "", description: "" });
  }, []);

  const confirmDelete = useCallback(() => {
    if (deleteId) {
      const toastId = toast.loading("Đang xóa môn học...");
      deleteMutation.mutate(deleteId, {
        onSuccess: () => {
          toast.success("Đã xóa môn học!", { id: toastId });
          setDeleteId(null);
        },
        onError: (err: any) => {
          toast.error(formatErrorMessage(err, "Không thể xóa môn học. Vui lòng thử lại."), { id: toastId });
        }
      });
    }
  }, [deleteId, deleteMutation]);

  const editingSubject = useMemo(() => {
    return subjects?.find((s: SubjectResponse) => s.id === editingId);
  }, [subjects, editingId]);

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight">Danh mục Môn học</h1>
          <p className="text-muted-foreground font-medium">
            Quản lý các môn học và lĩnh vực giảng dạy trên hệ thống.
          </p>
        </div>
        <Button 
          onClick={handleCreateClick}
          className="rounded-2xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 text-primary-foreground font-black px-6"
        >
          <Plus size={18} className="mr-2" />
          THÊM MÔN HỌC
        </Button>
      </div>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Add New Card Overlay */}
        {isAdding && (
          <SubjectEditCard
            subject={null}
            formData={formData}
            onSave={handleCreate}
            onCancel={() => setIsAdding(false)}
            onNameChange={handleNameChange}
            onDescChange={handleDescChange}
          />
        )}

        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-64 w-full rounded-4xl" />
          ))
        ) : editingId ? (
          <>
            <SubjectEditCard
              subject={editingSubject}
              formData={formData}
              onSave={handleUpdate}
              onCancel={handleCancelEdit}
              onNameChange={handleNameChange}
              onDescChange={handleDescChange}
            />
            {subjects?.map((subject: SubjectResponse) => (
              subject.id !== editingId && (
                <SubjectCard key={subject.id} subject={subject} onEdit={handleEditSubject} onDelete={handleDelete} />
              )
            ))}
          </>
        ) : (
          subjects?.map((subject: SubjectResponse) => (
            <SubjectCard key={subject.id} subject={subject} onEdit={handleEditSubject} onDelete={handleDelete} />
          ))
        )}
      </div>

      <ConfirmDialog
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
        title="Xác nhận xóa"
        description="Bạn có chắc chắn muốn xóa môn học này? Hành động này không thể hoàn tác."
        confirmText="XÓA NGAY"
        cancelText="HỦY"
        variant="danger"
      />
    </div>
  );
};

export default SubjectManagementPage;
