"use client";

import { useState, useCallback, useMemo, memo } from "react";
import Image from "next/image";
import { useGetUsers, useGetAdminStats, useGetTopTutors, useDeleteUser } from "@/server/_actions/admin-action";
import { UserResponse } from "@/server/_types/admin-type";
import { Card } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Badge } from "@/shared/components/ui/badge";
import { Search, UserCog, Trash2, UserCheck, Mail, Shield, Filter, LucideIcon, Trash } from "lucide-react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/shared/components/ui/confirm-dialog";
import { formatErrorMessage } from "@/shared/lib/utils";

const UserRow = memo(function UserRow({ user, isDeleting, onDelete }: any) {
  const roleBgColor = useMemo(() => {
    switch (user.role) {
      case 'ADMIN':
        return 'bg-purple-500/10 text-purple-600';
      case 'TUTOR':
        return 'bg-blue-500/10 text-blue-600';
      default:
        return 'bg-orange-500/10 text-orange-600';
    }
  }, [user.role]);

  return (
    <tr className="group hover:bg-muted/20 transition-colors">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center font-black text-primary shadow-sm overflow-hidden relative">
            {user.avatarUrl ? (
              <Image src={user.avatarUrl} alt={user.fullName} fill className="object-cover" />
            ) : (
              user.fullName.charAt(0)
            )}
          </div>
          <div className="space-y-0.5">
            <p className="font-bold text-sm group-hover:text-primary transition-colors">{user.fullName}</p>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Mail size={12} />
              {user.email}
            </p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <Badge variant="secondary" className={`
          font-black rounded-lg text-[10px] px-2 py-0.5 tracking-tight ${roleBgColor}
        `}>
          {user.role}
        </Badge>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <div className={`h-1.5 w-1.5 rounded-full ${user.isActive ? 'bg-emerald-500 animate-pulse' : 'bg-destructive'}`} />
          <span className={`text-xs font-bold ${user.isActive ? 'text-emerald-600' : 'text-destructive'}`}>
            {user.isActive ? 'Hoạt động' : 'Đã khóa'}
          </span>
        </div>
      </td>
      <td className="px-6 py-4 text-xs font-bold text-muted-foreground">
        {new Date(user.createdAt).toLocaleDateString('vi-VN')}
      </td>
      <td className="px-6 py-4 text-right">
        <div className="flex items-center justify-end gap-2">
          <Button variant="ghost" size="icon" className="rounded-xl hover:bg-primary/10 hover:text-primary">
            <UserCog size={18} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            disabled={isDeleting}
            onClick={() => onDelete(user.id)}
            className="rounded-xl transition-all hover:bg-destructive/10 hover:text-destructive text-destructive/70"
          >
            <Trash2 size={18} />
          </Button>
        </div>
      </td>
    </tr>
  );
});

const UserManagementPage = () => {
  const [keyword, setKeyword] = useState("");
  const { data: usersData, isLoading } = useGetUsers({ keyword });
  const deleteUserMutation = useDeleteUser();
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const users = usersData?.content || [];

  const handleKeywordChange = useCallback((e: any) => {
    setKeyword(e.target.value);
  }, []);

  const handleDeleteClick = useCallback((id: number) => {
    setDeleteId(id);
  }, []);

  const handleDeleteUser = useCallback(() => {
    if (!deleteId) return;
    const toastId = toast.loading("Đang xóa tài khoản...");
    deleteUserMutation.mutate(deleteId, {
      onSuccess: () => {
        toast.success("Đã xóa tài khoản thành công!", { id: toastId });
        setDeleteId(null);
      },
      onError: (err: any) => {
        toast.error(formatErrorMessage(err, "Có lỗi xảy ra khi xóa tài khoản"), { id: toastId });
      }
    });
  }, [deleteId, deleteUserMutation]);

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
            Quản lý Người dùng
            <Badge className="bg-primary text-primary-foreground font-black px-3 py-0.5 rounded-full text-xs">
              {users.length}
            </Badge>
          </h1>
          <p className="text-muted-foreground font-medium">
            Quản lý tài khoản Parent, Tutor và Admin trong hệ thống.
          </p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 bg-muted/30 p-1.5 rounded-2xl flex-1 md:w-75 border border-border">
            <div className="pl-3 pr-1 text-muted-foreground">
              <Search size={18} />
            </div>
            <input
              type="text"
              placeholder="Tìm theo tên, email..."
              value={keyword}
              onChange={handleKeywordChange}
              className="bg-transparent border-none focus:outline-none text-sm font-medium w-full py-1.5"
            />
          </div>
          <Button variant="outline" size="icon" className="rounded-xl shrink-0">
            <Filter size={18} />
          </Button>
        </div>
      </div>

      {/* User Table Card */}
      <Card className="border-none shadow-2xl shadow-black/5 bg-card/60 backdrop-blur-sm rounded-4xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border/50">
                <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-muted-foreground/60">Người dùng</th>
                <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-muted-foreground/60">Vai trò</th>
                <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-muted-foreground/60">Trạng thái</th>
                <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-muted-foreground/60">Ngày tham gia</th>
                <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-muted-foreground/60 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={5} className="px-6 py-4"><Skeleton className="h-12 w-full rounded-2xl" /></td>
                  </tr>
                ))
              ) : (
                users.map((user: UserResponse) => (
                  <UserRow 
                    key={user.id} 
                    user={user}
                    isDeleting={deleteUserMutation.isPending}
                    onDelete={handleDeleteClick}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteUser}
        title="Xóa tài khoản người dùng?"
        description="Hành động này không thể hoàn tác. Mọi dữ liệu liên quan đến người dùng này sẽ bị xoá vĩnh viễn khỏi hệ thống."
        variant="danger"
        confirmText="Xóa vĩnh viễn"
      />

      {/* Roles Info */}
      <div className="grid sm:grid-cols-3 gap-6">
        <RoleCard icon={<Shield size={20} />} title="Admin" desc="Quản trị viên toàn hệ thống, có quyền duyệt gia sư và quản lý doanh thu." color="text-purple-500" bgColor="bg-purple-500/10" />
        <RoleCard icon={<UserCog size={20} />} title="Tutor" desc="Gia sư tham gia giảng dạy, cần được admin xác minh hồ sơ trước khi hoạt động." color="text-blue-500" bgColor="bg-blue-500/10" />
        <RoleCard icon={<UserCog size={20} />} title="Parent" desc="Người dùng tìm kiếm gia sư và thanh toán các khóa học." color="text-orange-500" bgColor="bg-orange-500/10" />
      </div>
    </div>
  );
};

interface RoleCardProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
  color: string;
  bgColor: string;
}

const RoleCard = memo(function RoleCard({ icon, title, desc, color, bgColor }: RoleCardProps) {
  return (
    <Card className="p-6 border-none shadow-xl shadow-black/5 bg-card/40 backdrop-blur-sm rounded-3xl space-y-3 group hover:bg-card transition-all duration-300">
      <div className={`p-3 ${bgColor} ${color} rounded-2xl w-fit group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <div className="space-y-1">
        <h4 className="font-black text-sm uppercase tracking-wider">{title}</h4>
        <p className="text-xs text-muted-foreground font-medium leading-relaxed">{desc}</p>
      </div>
    </Card>
  );
});

export default UserManagementPage;
