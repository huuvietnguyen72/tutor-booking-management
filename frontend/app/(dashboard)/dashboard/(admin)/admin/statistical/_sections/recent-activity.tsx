"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { 
  Activity, 
  UserPlus, 
  GraduationCap, 
  AlertCircle,
  Clock,
  Check
} from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { ActivityLog } from "@/shared/types/admin-stats";

const MOCK_ACTIVITIES: ActivityLog[] = [
  {
    id: "1",
    type: "TUTOR_REGISTERED",
    title: "Gia sư mới đăng ký",
    description: "Nguyễn Văn A vừa gửi hồ sơ đăng ký môn Toán học.",
    timestamp: "2 giờ trước",
    status: "info"
  },
  {
    id: "2",
    type: "COURSE_ACCEPTED",
    title: "Phụ huynh chấp nhận gia sư",
    description: "Phụ huynh Trần Thị B đã chấp nhận lời mời từ gia sư Nguyễn Văn A.",
    timestamp: "5 giờ trước",
    status: "success"
  },
  {
    id: "3",
    type: "USER_JOINED",
    title: "Thành viên mới",
    description: "Lê Văn C vừa gia nhập hệ thống Tutor Booking.",
    timestamp: "8 giờ trước",
    status: "success"
  },
  {
    id: "4",
    type: "SYSTEM_ALERT",
    title: "Cảnh báo hệ thống",
    description: "Có 5 yêu cầu thay đổi mật khẩu chưa được xác thực.",
    timestamp: "1 ngày trước",
    status: "warning"
  },
  {
    id: "5",
    type: "COURSE_BOOKED",
    title: "Yêu cầu đặt chỗ mới",
    description: "Một yêu cầu đặt chỗ mới cho môn Tiếng Anh lớp 12.",
    timestamp: "1 ngày trước",
    status: "info"
  }
];

const ICON_MAP = {
  TUTOR_REGISTERED: GraduationCap,
  COURSE_ACCEPTED: Check,
  USER_JOINED: UserPlus,
  SYSTEM_ALERT: AlertCircle,
  COURSE_BOOKED: Activity
};

const STATUS_STYLING = {
  success: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  warning: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  info: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  error: "bg-rose-500/10 text-rose-500 border-rose-500/20"
};

export function RecentActivity() {
  return (
    <Card className="shadow-xl shadow-black/5 bg-card/50 backdrop-blur-sm border-none rounded-4xl overflow-hidden flex flex-col h-full">
      <CardHeader className="p-8 pb-4">
        <CardTitle className="text-lg font-black tracking-tight flex items-center gap-2">
          <Activity size={20} className="text-primary" />
          Hoạt động gần đây
        </CardTitle>
        <p className="text-xs text-muted-foreground font-medium mt-1">
          Nhật ký hệ thống thời gian thực
        </p>
      </CardHeader>
      
      <CardContent className="p-8 pt-2 flex-1">
        <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:h-full before:w-0.5 before:-translate-x-px before:bg-linear-to-b before:from-primary/20 before:via-primary/5 before:to-transparent">
          {MOCK_ACTIVITIES.map((activity, index) => {
            const Icon = ICON_MAP[activity.type];
            return (
              <div key={activity.id} className="relative flex items-start gap-4 group">
                <div className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border-4 border-background shadow-lg transition-transform group-hover:scale-110",
                  STATUS_STYLING[activity.status]
                )}>
                  <Icon size={16} strokeWidth={3} />
                </div>
                
                <div className="flex flex-col gap-1 transition-all group-hover:translate-x-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-black tracking-tight">
                      {activity.title}
                    </h4>
                    <Badge variant="outline" className="h-5 text-[9px] font-black uppercase tracking-widest px-1.5 py-0 border-primary/20 bg-primary/5 text-primary">
                      {activity.type.split('_')[0]}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground font-medium leading-relaxed max-w-70">
                    {activity.description}
                  </p>
                  <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground/60 font-bold uppercase tracking-wider mt-1">
                    <Clock size={10} strokeWidth={3} />
                    {activity.timestamp}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>

      <div className="p-4 bg-muted/5 mt-auto border-t border-border/10">
        <button className="w-full text-center py-2 text-xs font-black text-primary hover:text-primary/80 transition-colors tracking-widest uppercase">
          XEM TẤT CẢ HOẠT ĐỘNG
        </button>
      </div>
    </Card>
  );
}
