'use client';

import Image from 'next/image';
import { Linkedin, Twitter, Mail } from 'lucide-react';

const team = [
  {
    name: "TS. Nguyễn Văn A",
    role: "CEO & Founder",
    image: "/images/about/ceo.png",
    bio: "15 năm kinh nghiệm quản lý giáo dục quốc tế, chuyên gia tư vấn chiến lược chuyển đổi số trường học."
  },
  {
    name: "ThS. Lê Thị B",
    role: "Giám đốc Học thuật",
    image: "/images/about/academic.png",
    bio: "Chuyên gia tâm lý giáo dục, tác giả nhiều chương trình đào tạo gia sư chuẩn sư phạm hiện đại."
  },
  {
    name: "Trần Minh C",
    role: "Giám đốc Công nghệ (CTO)",
    image: "/images/about/cto.png",
    bio: "Kỹ sư phần mềm từ các tập đoàn công nghệ lớn, kiến trúc sư trưởng của hệ thống Sapphire Clarity."
  }
];

export function OurTeam() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <h2 className="text-4xl font-extrabold text-foreground tracking-tight">Đội ngũ sáng lập</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Hội tụ những chuyên gia tâm huyết trong lĩnh vực giáo dục và công nghệ, 
            cam kết mang lại giá trị thực chất cho cộng đồng.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
          {team.map((member, index) => (
            <div 
              key={index} 
              className="group relative animate-in fade-in slide-in-from-bottom-8 fill-mode-both duration-700"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className="relative aspect-3/4 rounded-[2.5rem] overflow-hidden mb-8 shadow-xl transition-transform duration-500 group-hover:-translate-y-4">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                {/* Social Overlay */}
                <div className="absolute inset-0 bg-blue-900/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-6">
                  <a href="#" className="w-12 h-12 bg-card rounded-full flex items-center justify-center hover:bg-muted transition-colors">
                    <Linkedin className="w-5 h-5 text-primary" />
                  </a>
                  <a href="#" className="w-12 h-12 bg-card rounded-full flex items-center justify-center hover:bg-muted transition-colors">
                    <Twitter className="w-5 h-5 text-primary" />
                  </a>
                  <a href="#" className="w-12 h-12 bg-card rounded-full flex items-center justify-center hover:bg-muted transition-colors">
                    <Mail className="w-5 h-5 text-primary" />
                  </a>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-2xl font-black text-foreground">{member.name}</h3>
                  <p className="text-primary font-bold uppercase tracking-widest text-xs">{member.role}</p>
                </div>
                <p className="text-muted-foreground leading-relaxed italic">
                  &quot;{member.bio}&quot;
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
