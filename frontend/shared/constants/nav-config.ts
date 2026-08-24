import { IRole } from "@/server/_types/auth-type";

export interface INavLink {
  label: string;
  href: string;
  noActiveState?: boolean;
}

export const NAV_LINKS: Record<Exclude<IRole, "ADMIN">, INavLink[]> = {
  TUTOR: [
    { label: "Trang chủ", href: "/" },
    { label: "Lịch dạy", href: "/dashboard/tutor/schedule" },
    { label: "Yêu cầu dạy học", href: "/dashboard/tutor/marketplace" },
    { label: "Hồ sơ", href: "/dashboard/tutor/profile" },
  ],
  PARENT: [
    { label: "Trang chủ", href: "/" },
    { label: "Tìm gia sư", href: "/tutor" },
    { label: "Lịch học", href: "/dashboard/parent/schedules" },
    { label: "Yêu cầu của tôi", href: "/dashboard/parent/requests" },
  ],
};

export const ROLE_TITLE_MAP: Record<Exclude<IRole, "ADMIN">, string> = {
  TUTOR: "Gia sư",
  PARENT: "Phụ huynh",
};
