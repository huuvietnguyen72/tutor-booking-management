"use client";

import { useState } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { ListHeader } from "@/app/(dashboard)/dashboard/(parent)/parent/requests/_sections/list-header";
import { ListStats } from "@/app/(dashboard)/dashboard/(parent)/parent/requests/_sections/list-stats";
import { ListFilters } from "@/app/(dashboard)/dashboard/(parent)/parent/requests/_sections/list-filters";
import { ListContent } from "@/app/(dashboard)/dashboard/(parent)/parent/requests/_sections/list-content";
import { useGetMyRequests } from "@/server/_actions/request-action";
import { IRequest } from "@/server/_types/request-type";
import { formatErrorMessage } from "@/shared/lib/utils";

export default function RequestsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data: requests = [], isLoading, error, refetch } = useGetMyRequests();

  const filteredRequests = requests.filter((req: IRequest) => {
    const matchesSearch =
      req.subjectName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.gradeLevel.toString().includes(searchTerm);
    const matchesStatus = statusFilter === "all" || req.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (error) {
    return (
      <div className="text-center py-20 flex flex-col items-center gap-4">
        <AlertCircle size={48} className="text-destructive opacity-50" />
        <h3 className="text-xl font-bold">Có lỗi xảy ra khi tải danh sách</h3>
        <p className="text-muted-foreground">{formatErrorMessage(error, "Vui lòng thử lại sau hoặc liên hệ hỗ trợ.")}</p>
        <Button onClick={() => refetch()}>Thử lại</Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-4 md:p-8 max-w-7xl mx-auto">
      <ListHeader />
      <ListStats requests={requests} isLoading={isLoading} />
      <ListFilters 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm} 
        statusFilter={statusFilter} 
        setStatusFilter={setStatusFilter} 
      />
      <ListContent 
        isLoading={isLoading} 
        requests={filteredRequests} 
      />
    </div>
  );
}
