import Link from "next/link";
import { GraduationCap } from "lucide-react";

export const Logo = () => (
  <Link
    href="/"
    className="flex items-center gap-2 text-blue-600 transition-transform hover:scale-105"
  >
    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
      <GraduationCap size={24} strokeWidth={2.5} />
    </div>
    <span className="hidden xl:inline text-xl font-bold tracking-tight text-blue-600 sm:text-2xl">
      Gia Sư Online
    </span>
  </Link>
);
