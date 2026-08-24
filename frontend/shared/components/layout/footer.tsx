"use client";

import Link from "next/link";
import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { NO_FOOTER_ROUTES, APP_SAVE_KEY } from "@/shared/constants/app";
import { cn } from "@/shared/lib/utils";
import { Logo } from "./logo";
import { useGetMe } from "@/server/_actions/auth-action";
import { getCookie } from "cookies-next";

const Footer = () => {
  const pathname = usePathname();
  const token = getCookie(APP_SAVE_KEY.TOKEN_KEY);
  const { data: user } = useGetMe({ enabled: !!token });

  const showFooter =
    !NO_FOOTER_ROUTES.some((route) => pathname.startsWith(route)) &&
    !pathname.startsWith("/dashboard") &&
    user?.role !== "ADMIN";

  return (
    showFooter && (
      <footer className="bg-card border-t border-border pt-16 pb-8 mt-auto">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-foreground">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            {/* Brand & About */}
            <div>
              <Logo />
              <p className="text-muted-foreground text-sm leading-relaxed pr-4 pt-4">
                Nền tảng kết nối gia sư và học viên hàng đầu Việt Nam. Chúng tôi
                mang đến giải pháp học tập tối ưu, minh bạch và chất lượng.
              </p>
              <div className="flex gap-4 pt-6">
                <a
                  href="#"
                  className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all duration-500 shadow-sm"
                >
                  <Facebook size={20} />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all duration-500 shadow-sm"
                >
                  <Instagram size={20} />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all duration-500 shadow-sm"
                >
                  <Twitter size={20} />
                </a>
              </div>
            </div>

            {/* For Parents/Students */}
            <div>
              <h3 className="font-bold text-foreground mb-6 text-lg">
                Dành cho Phụ huynh
              </h3>
              <ul className="space-y-4">
                <li>
                  <Link
                    href="/tutor"
                    className="text-muted-foreground hover:text-primary hover:translate-x-1 inline-block transition-all duration-300"
                  >
                    Tìm gia sư
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-primary hover:translate-x-1 inline-block transition-all duration-300"
                  >
                    Lớp học tiêu biểu
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-primary hover:translate-x-1 inline-block transition-all duration-300"
                  >
                    Bảng giá
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-primary hover:translate-x-1 inline-block transition-all duration-300"
                  >
                    Cẩm nang học tập
                  </Link>
                </li>
              </ul>
            </div>

            {/* For Tutors */}
            <div>
              <h3 className="font-bold text-foreground mb-6 text-lg">
                Dành cho Gia sư
              </h3>
              <ul className="space-y-4">
                <li>
                  <Link
                    href="/signup/tutor"
                    className={cn(
                      "text-muted-foreground hover:text-primary hover:translate-x-1 inline-block transition-all duration-300",
                    )}
                  >
                    Đăng ký làm gia sư
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-primary hover:translate-x-1 inline-block transition-all duration-300"
                  >
                    Lớp mới nhận
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-primary hover:translate-x-1 inline-block transition-all duration-300"
                  >
                    Quy trình tuyển dụng
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-primary hover:translate-x-1 inline-block transition-all duration-300"
                  >
                    Kinh nghiệm dạy
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-bold text-foreground mb-6 text-lg">Liên hệ</h3>
              <ul className="space-y-6 flex flex-col">
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 transition-transform hover:scale-110">
                    <MapPin size={20} />
                  </div>
                  <span className="text-muted-foreground text-sm pt-2 leading-relaxed">
                    Tầng 3, Tòa nhà ABC, 123 Đường XYZ, Cầu Giấy, Hà Nội
                  </span>
                </li>
                <li className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 transition-transform hover:scale-110">
                    <Phone size={20} />
                  </div>
                  <span className="text-foreground font-medium">1900 1234</span>
                </li>
                <li className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 transition-transform hover:scale-110">
                    <Mail size={20} />
                  </div>
                  <span className="text-muted-foreground font-medium">cskh@giasupro.vn</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-muted-foreground text-sm font-medium">
              © {new Date().getFullYear()} GiaSưPro. All rights reserved.
            </p>
            <div className="flex gap-8 text-sm font-medium">
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors duration-300"
              >
                Điều khoản dịch vụ
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors duration-300"
              >
                Chính sách bảo mật
              </Link>
            </div>
          </div>
        </div>
      </footer>
    )
  );
};

export default Footer;
