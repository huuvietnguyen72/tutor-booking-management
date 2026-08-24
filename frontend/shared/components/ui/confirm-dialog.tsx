"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "primary";
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Xác nhận",
  cancelText = "Hủy",
  variant = "primary",
}: ConfirmDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md gap-0 bg-white p-0">
        <div className="p-6">
          <div className="flex items-start gap-4">
            {variant === "danger" && (
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-50">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
            )}
            <div className="flex-1 space-y-2">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-slate-900">
                  {title}
                </DialogTitle>
                <DialogDescription className="text-[15px] leading-relaxed text-slate-500">
                  {description}
                </DialogDescription>
              </DialogHeader>
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-row items-center gap-3 border-t border-slate-100 bg-slate-50/50 p-4 px-6 sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1 rounded-xl bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 sm:flex-none sm:px-6"
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={cn(
              "flex-1 rounded-xl font-semibold shadow-sm sm:flex-none sm:px-6",
              variant === "danger"
                ? "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500"
                : "bg-blue-600 text-white hover:bg-blue-700"
            )}
          >
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
