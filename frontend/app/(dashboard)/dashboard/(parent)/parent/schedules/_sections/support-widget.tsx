"use client";

import { LifeBuoy, Phone } from "lucide-react";

export function SupportWidget() {
  return (
    <div className="relative overflow-hidden rounded-4xl bg-linear-to-br from-primary via-primary/90 to-primary/80 dark:from-primary/20 dark:to-background border border-primary/20 dark:border-primary/30 p-8 text-white dark:text-foreground shadow-2xl shadow-primary/20 group hover:shadow-primary/30 transition-all duration-500">
      {/* Premium background effects */}
      <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-white/20 dark:bg-primary/20 blur-3xl animate-pulse" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-40 w-40 rounded-full bg-blue-400/20 dark:bg-primary/10 blur-[80px] pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-primary-foreground/10 dark:bg-primary/5 blur-3xl" />
      
      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="mb-6 flex items-center justify-center w-14 h-14 rounded-2xl bg-white/20 dark:bg-primary/20 backdrop-blur-md shadow-inner border border-white/30 dark:border-primary/20 group-hover:scale-110 transition-transform duration-500">
          <LifeBuoy size={28} strokeWidth={2.5} className="text-white dark:text-primary animate-[spin_10s_linear_infinite]" />
        </div>
        
        <h4 className="mb-3 text-xl font-black leading-tight tracking-tight">Cần hỗ trợ gấp?</h4>
        <p className="mb-8 text-sm font-medium text-white/80 dark:text-muted-foreground leading-relaxed">
          Đội ngũ chăm sóc khách hàng của chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7.
        </p>
        
        <button className="flex w-full items-center justify-center gap-3 rounded-2xl bg-white dark:bg-primary py-4 text-xs font-black uppercase tracking-widest text-primary dark:text-white hover:bg-opacity-90 hover:scale-[1.03] active:scale-[0.98] transition-all shadow-xl shadow-black/10 dark:shadow-primary/20">
          <Phone size={18} fill="currentColor" strokeWidth={0} />
          LIÊN HỆ NGAY
        </button>
      </div>
    </div>
  );
}
