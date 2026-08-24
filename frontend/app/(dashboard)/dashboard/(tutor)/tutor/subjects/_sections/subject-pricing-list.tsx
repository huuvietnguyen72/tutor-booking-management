"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { 
  Trash2, 
  BookOpen, 
  Save, 
  Loader2,
  DollarSign,
  Layers,
  PlusSquare
} from "lucide-react";
import { useGetTutorSubjects, useAddTutorSubject, useUpdateTutorSubject, useDeleteTutorSubject, useGetAllSubjects, useGetTutorProfile } from "@/server/_actions/tutor-action";
import { toast } from "sonner";
import { formatErrorMessage } from "@/shared/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

interface IGroupedSubject {
  subjectId: number;
  subjectName: string;
  entries: {
    id: number | string; // number if exists on server, string if new
    gradeLevel: number;
    pricePerSession: number;
    isNew?: boolean;
    isDeleted?: boolean;
    isModified?: boolean;
  }[];
}

export function SubjectPricingList() {
  const { data: user } = useGetTutorProfile();
  const { data: subjects, isLoading: isSubjectsLoading } = useGetTutorSubjects(user?.id || "", !!user?.id);
  const { data: allAvailableSubjects } = useGetAllSubjects();
  
  const addSubjectMutation = useAddTutorSubject();
  const updateSubjectMutation = useUpdateTutorSubject();
  const deleteSubjectMutation = useDeleteTutorSubject();

  const [localGrouped, setLocalGrouped] = useState<IGroupedSubject[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [addingSubjectId, setAddingSubjectId] = useState<string>("");
  const gradeOptions = useMemo(() => [1,2,3,4,5,6,7,8,9,10,11,12], []);
  const visibleGroups = useMemo(
    () => localGrouped.filter((g) => g.entries.some((e) => !e.isDeleted)),
    [localGrouped]
  );
  const hasAnyGroup = visibleGroups.length > 0;

  // Grouping logic: flat API array -> grouped UI structure
  useEffect(() => {
    if (subjects) {
      const groups: Record<number, IGroupedSubject> = {};
      subjects.forEach(s => {
        if (!groups[s.subjectId]) {
          groups[s.subjectId] = {
            subjectId: s.subjectId,
            subjectName: s.subjectName,
            entries: []
          };
        }
        groups[s.subjectId].entries.push({
          id: s.id,
          gradeLevel: s.gradeLevel,
          pricePerSession: s.pricePerSession
        });
      });
      setLocalGrouped(Object.values(groups));
    }
  }, [subjects]);

  const addSubjectGroup = useCallback((subjectId: number, subjectName: string) => {
    if (localGrouped.find(g => g.subjectId === subjectId)) {
      toast.error("Môn học này đã có trong danh sách");
      return;
    }
    setLocalGrouped([
      ...localGrouped,
      {
        subjectId,
        subjectName,
        entries: [{ id: `new-${Date.now()}`, gradeLevel: 1, pricePerSession: 0, isNew: true }]
      }
    ]);
  }, [localGrouped]);

  const addGradeToGroup = useCallback((subjectId: number) => {
    setLocalGrouped(prev => prev.map(group => {
      if (group.subjectId === subjectId) {
        return {
          ...group,
          entries: [...group.entries, { id: `new-${Date.now()}`, gradeLevel: 1, pricePerSession: 0, isNew: true }]
        };
      }
      return group;
    }));
  }, []);

  const updateEntry = useCallback((subjectId: number, entryId: number | string, field: string, value: any) => {
    setLocalGrouped(prev => prev.map(group => {
      if (group.subjectId === subjectId) {
        return {
          ...group,
          entries: group.entries.map(e => e.id === entryId ? { ...e, [field]: value, isModified: !e.isNew } : e)
        };
      }
      return group;
    }));
  }, []);

  const removeEntry = useCallback((subjectId: number, entryId: number | string) => {
    setLocalGrouped(prev => prev.map(group => {
      if (group.subjectId === subjectId) {
        const entry = group.entries.find(e => e.id === entryId);
        if (entry?.isNew) {
           return { ...group, entries: group.entries.filter(e => e.id !== entryId) };
        }
        return {
          ...group,
          entries: group.entries.map(e => e.id === entryId ? { ...e, isDeleted: true } : e)
        };
      }
      return group;
    }).filter(group => group.entries.some(e => !e.isDeleted)));
  }, []);

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    try {
      const promises: Promise<any>[] = [];
      
      localGrouped.forEach(group => {
        group.entries.forEach(e => {
          if (e.isDeleted && typeof e.id === 'number') {
            promises.push(deleteSubjectMutation.mutateAsync(e.id));
          } else if (e.isNew && !e.isDeleted) {
            promises.push(addSubjectMutation.mutateAsync({
              subjectId: group.subjectId,
              gradeLevel: Number(e.gradeLevel),
              pricePerSession: Number(e.pricePerSession)
            }));
          } else if (e.isModified && !e.isDeleted && typeof e.id === 'number') {
            promises.push(updateSubjectMutation.mutateAsync({
              id: e.id,
              data: {
                gradeLevel: Number(e.gradeLevel),
                pricePerSession: Number(e.pricePerSession)
              }
            }));
          }
        });
      });

      if (promises.length === 0) {
        toast.info("Không có thay đổi nào để lưu");
        return;
      }

      await Promise.all(promises);
      toast.success("Cập nhật môn học và học phí thành công");
    } catch (err: any) {
      console.error(err);
      toast.error(formatErrorMessage(err, "Có lỗi xảy ra khi lưu thay đổi"));
    } finally {
      setIsSaving(false);
    }
  }, [addSubjectMutation, deleteSubjectMutation, localGrouped, updateSubjectMutation]);

  if (isSubjectsLoading) {
    return (
      <div className="space-y-6">
        {[1, 2].map((i) => (
          <div key={i} className="h-48 w-full animate-pulse rounded-3xl bg-muted" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h3 className="text-[11px] font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-2">
          <BookOpen size={14} className="text-primary" />
          Danh sách môn học của bạn
        </h3>
        
        <div className="flex gap-2 w-full md:w-auto">
           <Select 
              value={addingSubjectId}
              onValueChange={(val) => {
                if (!val) return;
                const sub = allAvailableSubjects?.find(s => s.id === Number(val));
                if (sub) addSubjectGroup(sub.id, sub.name);
                // Reset to show placeholder again
                setAddingSubjectId("");
              }}
           >
              <SelectTrigger className="h-10 w-full md:w-55 rounded-xl border-border bg-muted/30 px-3 text-xs font-bold text-foreground focus:ring-2 focus:ring-primary/20 outline-hidden">
                <SelectValue placeholder="+ Thêm môn học mới" />
              </SelectTrigger>
              <SelectContent>
                {allAvailableSubjects?.map(s => (
                  <SelectItem key={s.id} value={s.id.toString()}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
           </Select>
        </div>
      </div>

      <div className="space-y-6">
        {visibleGroups.map((group) => (
          <div 
            key={group.subjectId} 
            className="group relative rounded-4xl border border-border bg-card p-4 md:p-8 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 animate-in fade-in slide-in-from-bottom-4"
          >
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-1/3 space-y-4">
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Môn học</label>
                   <div className="flex items-center gap-3 h-14 w-full rounded-2xl border-border bg-primary/5 px-4 text-sm font-black text-primary uppercase tracking-tight">
                      <BookOpen size={18} />
                      {group.subjectName}
                   </div>
                </div>
                <p className="text-[10px] text-muted-foreground italic px-1 leading-relaxed">
                   Bạn có thể dạy nhiều khối lớp khác nhau cho môn này với mức giá riêng biệt.
                </p>
              </div>

              <div className="flex-1 space-y-4">
                 <div className="flex items-center justify-between mb-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Phân lớp & Học phí (VNĐ/Giờ)</label>
                    <button 
                       onClick={() => addGradeToGroup(group.subjectId)}
                       className="text-[10px] font-black text-primary hover:underline uppercase tracking-widest flex items-center gap-1"
                    >
                      <PlusSquare size={12} />
                      Thêm lớp
                    </button>
                 </div>

                 <div className="space-y-3">
                   {group.entries.filter(e => !e.isDeleted).map((entry, index) => (
                     <div key={entry.id} className="flex gap-3 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="relative flex-1">
                           <Layers size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 z-10" />
                           <Select
                             value={entry.gradeLevel.toString()}
                             onValueChange={(val) => updateEntry(group.subjectId, entry.id, "gradeLevel", Number(val))}
                           >
                             <SelectTrigger className="h-12 w-full rounded-xl border-border bg-muted/20 pl-10 pr-4 text-xs font-bold text-foreground focus:bg-card transition-all outline-hidden appearance-none">
                               <SelectValue placeholder="Chọn lớp" />
                             </SelectTrigger>
                             <SelectContent>
                               {gradeOptions.map(g => (
                                 <SelectItem key={g} value={g.toString()}>Lớp {g}</SelectItem>
                               ))}
                             </SelectContent>
                           </Select>
                        </div>
                        <div className="relative flex-1">
                           <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50" />
                           <input
                             type="number"
                             value={entry.pricePerSession || ""}
                             onChange={(e) => updateEntry(group.subjectId, entry.id, "pricePerSession", parseInt(e.target.value) || 0)}
                             placeholder="Giá tiền/giờ"
                             className="h-12 w-full rounded-xl border-border bg-muted/20 pl-10 pr-4 text-xs font-bold text-foreground focus:bg-card transition-all"
                           />
                        </div>
                        <button
                          onClick={() => removeEntry(group.subjectId, entry.id)}
                          className="h-12 w-12 flex items-center justify-center rounded-xl text-muted-foreground hover:text-red-500 bg-muted/20 hover:bg-red-50 transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                     </div>
                   ))}
                 </div>
              </div>
            </div>
          </div>
        ))}

          {!hasAnyGroup && (
           <div className="py-20 flex flex-col items-center justify-center border-2 border-dashed border-border rounded-4xl bg-muted/5">
              <BookOpen size={48} className="text-muted-foreground/20 mb-4" />
              <p className="text-sm font-bold text-muted-foreground">Bạn chưa đăng ký môn học nào.</p>
              <p className="text-xs text-muted-foreground/60 mt-1">Hãy chọn môn học từ danh sách phía trên để bắt đầu.</p>
           </div>
        )}
      </div>

      <div className="pt-8 border-t border-border flex justify-end">
        <button
          onClick={handleSave}
          disabled={isSaving || !hasAnyGroup}
          className="flex h-14 w-full md:w-64 items-center justify-center gap-3 rounded-2xl bg-primary text-sm font-black uppercase tracking-widest text-white shadow-xl shadow-primary/20 transition-all hover:bg-primary/90 active:scale-95 disabled:opacity-50"
        >
          {isSaving ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              <Save size={18} />
              Lưu thay đổi môn học
            </>
          )}
        </button>
      </div>
    </div>
  );
}
