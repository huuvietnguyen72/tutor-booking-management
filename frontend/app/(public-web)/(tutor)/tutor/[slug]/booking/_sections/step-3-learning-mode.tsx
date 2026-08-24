"use client";

import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/components/ui/button";
import { Label } from "@/shared/components/ui/label";
import { 
  Monitor, 
  MapPin, 
  Check, 
  ArrowLeft, 
  TrendingDown, 
  ShieldCheck,
  CheckCircle2
} from "lucide-react";

interface Step3Props {
  learningMode: "online" | "offline";
  onModeChange: (mode: "online" | "offline") => void;
  onBack: () => void;
  onNext: () => void;
}

export function Step3LearningMode({
  learningMode,
  onModeChange,
  onBack,
  onNext,
}: Step3Props) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      {/* Selection Cards */}
      <div className="space-y-4">
        <Label className="text-base font-bold text-foreground">Hình thức học</Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Online Card */}
          <button
            onClick={() => onModeChange("online")}
            className={cn(
              "relative flex flex-col p-6 rounded-3xl border-2 transition-all duration-300 text-left group",
              learningMode === "online"
                ? "border-blue-600 bg-blue-600/5 ring-4 ring-blue-600/10 shadow-lg shadow-blue-600/10"
                : "border-border bg-card hover:border-accent hover:bg-accent/10"
            )}
          >
            <div className={cn(
              "h-12 w-12 rounded-2xl mb-4 flex items-center justify-center transition-all duration-300",
              learningMode === "online" 
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/20" 
                : "bg-primary/10 text-blue-600 group-hover:scale-110"
            )}>
              <Monitor size={24} />
            </div>

            <div className="flex items-center gap-2 mb-1">
              <span className="font-bold text-foreground text-lg">Trực tuyến</span>
              <div className="flex items-center gap-1 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                <TrendingDown size={12} />
                <span>Giảm 10%</span>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground leading-relaxed font-medium">Học qua Google Meet, Zoom với đầy đủ công cụ tương tác.</p>
            
            {learningMode === "online" && (
              <div className="absolute bottom-6 right-6 bg-blue-600 text-white rounded-full p-1 shadow-md">
                <Check size={16} strokeWidth={3} />
              </div>
            )}
          </button>

          {/* Offline Card */}
          <button
            onClick={() => onModeChange("offline")}
            className={cn(
              "relative flex flex-col p-6 rounded-3xl border-2 transition-all duration-300 text-left group",
              learningMode === "offline"
                ? "border-blue-600 bg-blue-600/5 ring-4 ring-blue-600/10 shadow-lg shadow-blue-600/10"
                : "border-border bg-card hover:border-accent hover:bg-accent/10"
            )}
          >
            <div className={cn(
              "h-12 w-12 rounded-2xl mb-4 flex items-center justify-center transition-all duration-300",
              learningMode === "offline" 
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/20" 
                : "bg-muted text-muted-foreground group-hover:scale-110"
            )}>
              <MapPin size={24} />
            </div>

            <span className="font-bold text-foreground text-lg mb-1">Trực tiếp</span>
            <p className="text-sm text-muted-foreground leading-relaxed font-medium">Gia sư đến tận nhà để giảng dạy trực tiếp (Phí di chuyển tùy khu vực).</p>

            {learningMode === "offline" && (
              <div className="absolute bottom-6 right-6 bg-blue-600 text-white rounded-full p-1 shadow-md">
                <Check size={16} strokeWidth={3} />
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Policy Section */}
      <div className="bg-card rounded-3xl border border-border p-6 space-y-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-600 dark:text-orange-500 shrink-0">
            <ShieldCheck size={22} />
          </div>
          <div>
            <p className="font-bold text-foreground text-sm">Chính sách bảo đảm</p>
            <p className="text-xs text-muted-foreground">Quyền lợi của bạn luôn được ưu tiên hàng đầu</p>
          </div>
        </div>
        
        <div className="space-y-3">
          {[
            "Hoàn trả 100% học phí buổi đầu nếu không hài lòng.",
            "Miễn phí đổi gia sư nếu không phù hợp tính cách.",
            "Bảo mật thông tin cá nhân và chi trả phí minh bạch."
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3 text-xs text-muted-foreground leading-relaxed font-medium">
              <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 pt-4">
        <Button
          onClick={onBack}
          variant="outline"
          className="flex-1 h-14 rounded-2xl border-border bg-card text-muted-foreground font-bold hover:bg-muted transition-all flex items-center gap-2 group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          QUAY LẠI
        </Button>
        <Button
          onClick={onNext}
          className="flex-1 h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-600/20 transition-all active:scale-95"
        >
          TIẾP TỤC
        </Button>
      </div>

    </div>
  );
}
