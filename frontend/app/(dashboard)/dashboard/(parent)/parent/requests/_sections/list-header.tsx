"use client";

import { Plus } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import Link from "next/link";
import { ROUTES } from "@/shared/constants/app";

export function ListHeader() {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div>
        <h1 className="text-3xl md:text-4xl font-black text-foreground tracking-tight">Yêu cầu của tôi</h1>
        <p className="text-muted-foreground mt-2 font-medium">Quản lý các tin đăng tìm gia sư và các ứng cử viên.</p>
      </div>
      <Link href={ROUTES.PARENT.REQUESTS + "/new"}>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white font-black h-14 px-8 rounded-2xl shadow-xl shadow-blue-500/30 group transition-all">
          <Plus className="mr-2 group-hover:scale-125 transition-transform" />
          Đăng yêu cầu mới
        </Button>
      </Link>
    </div>
  );
}
