import { TutorBioProps } from "@/shared/types/tutor-detail";
import { ShieldCheck, CheckCircle2 } from "lucide-react";

export function TutorBio({ bio }: TutorBioProps) {
  return (
    <div className="bg-card rounded-2xl border border-border shadow-sm p-5 space-y-4">
      <h2 className="text-base font-bold text-foreground flex items-center gap-2">
        <ShieldCheck size={18} className="text-primary" />
        Giới thiệu bản thân
      </h2>

      <p className="text-muted-foreground leading-relaxed text-sm whitespace-pre-line">
        {bio}
      </p>

      {/* Verification badges */}
      <div className="grid grid-cols-2 gap-3 pt-1">
        <div className="flex items-center gap-3 bg-muted/40 rounded-xl p-3 border border-border/50">
          <div className="h-8 w-8 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg flex items-center justify-center shrink-0">
            <CheckCircle2 size={18} />
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground/70 font-semibold uppercase">
              Xác thực danh tính
            </p>
            <p className="text-xs font-bold text-foreground">Đã kiểm duyệt</p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-muted/40 rounded-xl p-3 border border-border/50">
          <div className="h-8 w-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center shrink-0">
            <ShieldCheck size={18} />
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground/70 font-semibold uppercase">
              Bằng cấp
            </p>
            <p className="text-xs font-bold text-foreground">Đã xác thực</p>
          </div>
        </div>
      </div>
    </div>
  );
}
