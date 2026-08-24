"use client";
import Link from 'next/link';
import { Button } from '@/shared/components/ui/button';
import { SearchX, Home, GraduationCap } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-5rem)] px-4 text-center bg-background relative overflow-hidden">
      {/* Decorative Gradient Background */}
      <div className="absolute inset-0 bg-linear-to-b from-background via-background to-primary/5 -z-10" />
      
      <div className="relative mb-8 mt-4 animate-in fade-in zoom-in duration-700">
        <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl opacity-50 animate-pulse"></div>
        <div className="relative bg-card p-6 sm:p-8 rounded-4xl shadow-2xl shadow-primary/5 border border-border flex items-center justify-center transition-colors duration-500">
          <SearchX className="w-16 h-16 sm:w-20 sm:h-20 text-primary" strokeWidth={1.5} />
        </div>
      </div>
      
      <h1 className="text-7xl sm:text-8xl font-black tracking-tighter mb-4 relative drop-shadow-sm animate-in slide-in-from-top-4 duration-700 delay-100">
        <span className="text-transparent bg-clip-text bg-linear-to-br from-primary via-indigo-500/80 to-purple-600/80 z-10 relative">404</span>
      </h1>
      
      <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-4 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-200">
        Không tìm thấy trang
      </h2>
      
      <p className="max-w-lg text-base sm:text-lg text-muted-foreground mb-10 leading-relaxed px-4 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-300 transition-colors">
        Xin lỗi, trang bạn đang tìm kiếm không tồn tại, đã bị xóa hoặc tạm thời không thể truy cập. Hãy thử tìm kiếm ở các trang khác hoặc quay về trang chủ.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center w-full max-w-sm sm:max-w-md px-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-400">
        <Link href="/" className="w-full sm:w-auto">
          <Button size="lg" className="rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all hover:-translate-y-0.5 w-full h-12 text-base font-semibold group">
            <Home className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
            Về Trang Chủ
          </Button>
        </Link>
        <Link href="/tutor" className="w-full sm:w-auto">
          <Button variant="outline" size="lg" className="rounded-xl border-2 transition-all w-full h-12 text-base font-semibold hover:-translate-y-0.5 bg-background shadow-sm">
            <GraduationCap className="mr-2 h-5 w-5" />
            Tìm Gia Sư
          </Button>
        </Link>
      </div>
    </div>
  );
}
