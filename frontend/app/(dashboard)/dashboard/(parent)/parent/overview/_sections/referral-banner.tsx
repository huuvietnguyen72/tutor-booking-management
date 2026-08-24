import { Gift } from "lucide-react";

export function ReferralBanner() {
  return (
    <div className="relative overflow-hidden rounded-4xl bg-primary px-8 py-10 shadow-2xl shadow-primary/20 animate-in fade-in zoom-in-95 duration-700 delay-500 fill-mode-both">
      {/* Decorative patterns */}
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl opacity-50" />
      <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-black/10 blur-3xl opacity-30" />

      <div className="relative flex flex-col items-center justify-between gap-8 md:flex-row">
        <div className="max-w-md text-center md:text-left">
          <h3 className="text-2xl font-black text-white tracking-tight leading-tight">
            Giới thiệu bạn bè, <br />
            nhận ngay ưu đãi!
          </h3>
          <p className="mt-4 text-white/80 font-medium leading-relaxed">
            Chia sẻ trải nghiệm của bạn với bạn bè và nhận gói giảm giá 20% cho cả
            hai khi họ đăng ký buổi học đầu tiên.
          </p>
        </div>
        
        <button className="group flex shrink-0 items-center justify-center gap-3 rounded-2xl bg-white px-8 py-4 text-sm font-black text-primary shadow-xl shadow-black/5 hover:bg-opacity-90 active:scale-95 transition-all duration-200">
          <Gift size={20} strokeWidth={2.5} className="group-hover:rotate-12 transition-transform" />
          <span>CHIA SẺ NGAY</span>
        </button>
      </div>
    </div>
  );
}
