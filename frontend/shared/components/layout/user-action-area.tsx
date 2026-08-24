import { NotificationDropdown } from "./notification-dropdown";
import { UserDropdown } from "./user-dropdown";
import { ROLE_TITLE_MAP } from "@/shared/constants/nav-config";
import { IUserProfile } from "@/server/_types/auth-type";

export const UserActionArea = ({ user }: { user: IUserProfile }) => {
  const roleTitle =
    ROLE_TITLE_MAP[user.role as keyof typeof ROLE_TITLE_MAP] || "";

  return (
    <div className="flex items-center gap-2 sm:gap-4">
      <div className="h-8 w-px bg-border hidden sm:block mx-1" />
      <NotificationDropdown role={user.role} />
      <div className="h-8 w-px bg-border hidden sm:block mx-1" />
      <div className="flex items-center gap-3 text-right group cursor-pointer transition-all px-1">
        <div className="hidden flex-col xl:flex">
          <span className="text-sm font-black text-foreground leading-tight tracking-tight group-hover:text-primary transition-colors truncate max-w-30">
            {user.fullName}
          </span>
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none mt-0.5 opacity-80">
            {roleTitle}
          </span>
        </div>
        <UserDropdown user={user} />
      </div>
    </div>
  );
};
