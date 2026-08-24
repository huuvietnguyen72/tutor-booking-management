'use client';

import React from 'react';
import { ShieldCheck, Heart, FileText, Zap } from 'lucide-react';

const values = [
  {
    title: "Chuyên nghiệp",
    description: "Quy trình tuyển chọn & đào tạo gia sư chuẩn sư phạm, đảm bảo chất lượng giảng dạy đồng bộ trên toàn hệ thống.",
    icon: <ShieldCheck className="w-8 h-8 text-blue-600 dark:text-blue-400" />,
    color: "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400"
  },
  {
    title: "Tận tâm",
    description: "Luôn đặt sự tiến bộ của học sinh lên hàng đầu, lắng nghe và thấu hiểu nhu cầu riêng biệt của từng gia đình.",
    icon: <Heart className="w-8 h-8 text-red-600 dark:text-red-400" />,
    color: "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400"
  },
  {
    title: "Minh bạch",
    description: "Công khai, minh bạch về học phí, trình độ chuyên môn và đánh giá từ cộng đồng học viên.",
    icon: <FileText className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />,
    color: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400"
  },
  {
    title: "Đổi mới",
    description: "Không ngừng cập nhật công nghệ và phương pháp giáo dục hiện đại, mang lại trải nghiệm tối ưu cho người dùng.",
    icon: <Zap className="w-8 h-8 text-amber-600 dark:text-amber-400" />,
    color: "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400"
  }
];

export function CoreValues() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <h2 className="text-4xl font-extrabold text-foreground tracking-tight">Giá trị cốt lõi</h2>
          <p className="text-lg text-muted-foreground">
            Tại Sapphire Clarity, chúng tôi định hình mọi hoạt động xoay quanh 4 cột trụ chính, 
            đảm bảo tính bền vững và sự hài lòng tuyệt đối.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((item, index) => (
            <div 
              key={index}
              className={`p-8 bg-card rounded-3xl shadow-sm hover:shadow-xl transition-all border border-border flex flex-col items-center text-center group animate-in fade-in slide-in-from-bottom-8 fill-mode-both duration-700`}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className={`w-20 h-20 flex items-center justify-center rounded-2xl mb-8 group-hover:scale-110 transition-transform ${item.color}`}>
                {item.icon}
              </div>
              <h3 className="text-xl font-bold mb-4 text-foreground">{item.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
