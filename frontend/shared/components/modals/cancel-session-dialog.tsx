"use client";

import { useState } from "react";
import { AlertCircle } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";

interface CancelSessionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  isPending?: boolean;
}

export function CancelSessionDialog({ isOpen, onClose, onConfirm, isPending }: CancelSessionDialogProps) {
  const [reason, setReason] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!reason.trim()) return;
    onConfirm(reason);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md p-0 border-none bg-card overflow-hidden rounded-[2.5rem] shadow-2xl">
        <div className="p-8 space-y-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="h-16 w-16 rounded-3xl bg-red-500/10 text-red-500 flex items-center justify-center shadow-lg shadow-red-500/5">
              <AlertCircle size={32} />
            </div>
            <DialogHeader className="space-y-1">
              <DialogTitle className="text-xl font-black text-foreground text-center">
                Hủy buổi học
              </DialogTitle>
              <p className="text-sm font-bold text-muted-foreground">
                Bạn có chắc chắn muốn hủy buổi học này?
              </p>
            </DialogHeader>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">
                Lý do hủy buổi <span className="text-red-500">*</span>
              </label>
              <textarea
                autoFocus
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Ví dụ: Có việc đột xuất, sức khỏe không ổn định..."
                className="w-full min-h-[120px] p-4 rounded-2xl bg-muted/50 border border-border focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 outline-none transition-all resize-none text-sm font-medium"
                required
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 h-12 rounded-2xl bg-muted text-foreground text-xs font-black uppercase tracking-widest transition-all hover:bg-muted/80 active:scale-95"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                disabled={!reason.trim() || isPending}
                className={cn(
                  "flex-1 h-12 rounded-2xl text-white text-xs font-black uppercase tracking-widest transition-all shadow-lg active:scale-95",
                  reason.trim() && !isPending
                    ? "bg-red-500 hover:bg-red-600 shadow-red-500/20"
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                )}
              >
                {isPending ? "Đang xử lý..." : "Xác nhận hủy"}
              </button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
