"use client";

import { useGetDirectInvitations } from "@/server/_actions/booking-action";
import { IDirectInvitation } from "@/server/_types/marketplace-type";
import { DirectInvitationCard } from "./direct-invitation-card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Sparkles, Search, SlidersHorizontal, History, Clock } from "lucide-react";
import { useState, useMemo } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/shared/components/ui/tabs";
import { Input } from "@/shared/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { useDebounce } from "@/shared/hooks/use-debounce";

type TabStatus = "WAITING_TUTOR_CONFIRM" | "HISTORY";

export function DirectInvitations() {
  const [activeTab, setActiveTab] = useState<TabStatus>("WAITING_TUTOR_CONFIRM");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  const debouncedSearch = useDebounce(search, 300);

  // Fetch tất cả 1 lần, không truyền status filter để có data cho counts và client-side filtering
  const { data: response, isLoading } = useGetDirectInvitations({ perPage: 200 });
  const allInvitations: IDirectInvitation[] = response?.data || [];

  // Helper function để lọc và sắp xếp
  const processList = (list: IDirectInvitation[]) => {
    let result = [...list];
    
    // Tìm kiếm
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      result = result.filter(
        (inv) =>
          inv.parentName?.toLowerCase().includes(q) ||
          inv.subjectName?.toLowerCase().includes(q) ||
          inv.studentName?.toLowerCase().includes(q) ||
          inv.message?.toLowerCase().includes(q)
      );
    }

    // Sắp xếp
    if (sortBy === "newest") {
      result.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    } else if (sortBy === "oldest") {
      result.sort((a, b) => new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime());
    } else if (sortBy === "budget-high") {
      result.sort((a, b) => (b.budget || 0) - (a.budget || 0));
    }

    return result;
  };

  // Chia danh sách theo tab (Memoized)
  const lists = useMemo(() => {
    const pendingRaw = allInvitations.filter((i) => i.status === "PENDING");
    const historyRaw = allInvitations.filter((i) => 
      i.status === "ACCEPTED" || 
      i.status === "DECLINED" || 
      i.status === "PENDING_PAYMENTS"
    );

    return {
      pending: processList(pendingRaw),
      history: processList(historyRaw),
      counts: {
        pending: pendingRaw.length,
        history: historyRaw.length,
      }
    };
  }, [allInvitations, debouncedSearch, sortBy]);

  const renderEmptyState = (tab: TabStatus) => (
    <div className="flex flex-col items-center justify-center py-24 px-6 rounded-[2.5rem] bg-muted/10 border-2 border-dashed border-border/50 animate-in fade-in zoom-in duration-500">
      <div className="h-24 w-24 rounded-full bg-primary/5 flex items-center justify-center text-primary/30 mb-8 border border-primary/10">
        <Sparkles size={48} strokeWidth={1} />
      </div>
      <h3 className="text-2xl font-black text-foreground tracking-tight uppercase mb-3 text-center">
        {tab === "WAITING_TUTOR_CONFIRM" ? "Chưa có lời mời mới" : "Danh sách trống"}
      </h3>
      <p className="text-base text-muted-foreground font-medium text-center max-w-sm leading-relaxed">
        {debouncedSearch 
          ? "Không tìm thấy kết quả nào phù hợp với tìm kiếm của bạn."
          : tab === "WAITING_TUTOR_CONFIRM"
            ? "Bạn chưa nhận được lời mời dạy nào mới. Hãy cập nhật hồ sơ để nổi bật hơn nhé!"
            : "Không có dữ liệu trong mục này."}
      </p>
    </div>
  );

  const renderContent = (currentList: IDirectInvitation[], tabValue: TabStatus) => {
    if (isLoading) {
      return (
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-44 w-full rounded-4xl bg-muted/20" />
          ))}
        </div>
      );
    }

    if (currentList.length === 0) {
      return renderEmptyState(tabValue);
    }

    return (
      <div className="grid grid-cols-1 gap-6">
        {currentList.map((invitation) => (
          <DirectInvitationCard key={invitation.id} invitation={invitation} />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="h-8 w-1.5 rounded-full bg-primary shadow-[0_0_15px_rgba(var(--primary),0.5)]" />
            <h2 className="text-2xl font-black uppercase tracking-tight text-foreground">
              Quản lý lời mời
            </h2>
          </div>
          <p className="text-sm text-muted-foreground font-semibold uppercase tracking-wider">
            Theo dõi và phản hồi các yêu cầu từ phụ huynh
          </p>
        </div>

        {/* Search & Sort */}
        <div className="flex items-center gap-3 flex-wrap md:flex-nowrap">
          <div className="relative w-full md:w-72 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Tìm theo tên, môn học..."
              className="pl-11 h-11 rounded-2xl bg-muted/30 border-none focus-visible:ring-primary/20 transition-all font-medium"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-42.5 h-11 rounded-2xl bg-muted/30 border-none font-bold text-[10px] uppercase tracking-wider">
              <SlidersHorizontal className="h-3.5 w-3.5 mr-2 text-primary" />
              <SelectValue placeholder="Sắp xếp" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest" className="font-bold uppercase text-[10px]">Mới nhất</SelectItem>
              <SelectItem value="oldest" className="font-bold uppercase text-[10px]">Cũ nhất</SelectItem>
              <SelectItem value="budget-high" className="font-bold uppercase text-[10px]">Học phí cao</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabStatus)} className="w-full">
        <TabsList className="h-14 w-full md:w-auto p-1.5 bg-muted/30 rounded-2xl flex md:inline-flex gap-1 mb-8">
          <TabsTrigger value="WAITING_TUTOR_CONFIRM" className="flex-1 md:flex-none rounded-xl font-bold uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 px-6">
            <Clock className="h-3.5 w-3.5" />
            Mới
            {lists.counts.pending > 0 && (
              <span className="ml-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] text-primary-foreground font-black">
                {lists.counts.pending}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="HISTORY" className="flex-1 md:flex-none rounded-xl font-bold uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 px-6">
            <History className="h-3.5 w-3.5" />
            Lịch sử
          </TabsTrigger>
        </TabsList>

        <TabsContent value="WAITING_TUTOR_CONFIRM" className="mt-0 outline-none">
          {renderContent(lists.pending, "WAITING_TUTOR_CONFIRM")}
        </TabsContent>
        <TabsContent value="HISTORY" className="mt-0 outline-none">
          {renderContent(lists.history, "HISTORY")}
        </TabsContent>
      </Tabs>
    </div>
  );
}

