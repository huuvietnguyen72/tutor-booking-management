"use client";

import { useState, useCallback, memo } from "react";
import {
  Search,
  Filter,
  MapPin,
  Calendar,
  DollarSign,
  Clock,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  Loader2,
  ChevronLeft,
  MessageSquare,
} from "lucide-react";
import {
  useGetRequests,
  useApplyForRequest,
  useGetMyApplications
} from "@/server/_actions/request-action";
import { IRequest } from "@/server/_types/request-type";
import { toast } from "sonner";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { cn, formatErrorMessage, formatPrice } from "@/shared/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/shared/components/ui/dialog";
import { Textarea } from "@/shared/components/ui/textarea";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";

const JobCard = memo(function JobCard({ job, isSelected, onSelect }: any) {
  return (
    <div
      onClick={() => onSelect(job)}
      className={cn(
        "group relative cursor-pointer rounded-3xl border p-6 transition-all duration-300",
        isSelected
          ? "border-primary bg-primary/5 shadow-xl shadow-primary/5"
          : "border-border bg-card hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5",
      )}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge
              variant="secondary"
              className="bg-primary/10 text-primary border-none text-[10px] font-black uppercase tracking-widest px-2 py-0.5"
            >
              {job.subjectName}
            </Badge>
            <Badge className="bg-amber-500/10 text-amber-600 border-none text-[10px] font-black uppercase tracking-widest px-2 py-0.5">
              Lớp {job.gradeLevel}
            </Badge>
          </div>
          <h3 className="text-lg font-black text-foreground group-hover:text-primary transition-colors">
            {job.studentName}
          </h3>
        </div>
        <div className="text-right">
          <p className="text-lg font-black text-primary">
            {job.desiredPrice.toLocaleString()}đ
            <span className="text-[10px] text-muted-foreground font-black uppercase tracking-tighter">
              /buổi
            </span>
          </p>
          <p className="text-[10px] font-bold text-muted-foreground uppercase">
            {job.sessionsPerWeek} buổi/tuần
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-muted-foreground">
        <div className="flex items-center gap-2">
          <MapPin size={14} className="text-primary/60" />
          {job.address || "Trực tuyến"}
        </div>
        <div className="flex items-center gap-2">
          <Clock size={14} className="text-primary/60" />
          Đăng lúc{" "}
          {new Date(job.createdAt).toLocaleDateString("vi-VN")}
        </div>
      </div>

      <ChevronRight
        className={cn(
          "absolute right-4 top-1/2 -translate-y-1/2 transition-all duration-500",
          isSelected
            ? "translate-x-0 opacity-100 text-primary"
            : "translate-x-4 opacity-0",
        )}
      />
    </div>
  );
});

export function JobList() {
  const { data: jobs = [], isLoading: isJobsLoading } = useGetRequests();
  const { data: myApps = [], isLoading: isAppsLoading } = useGetMyApplications();
  const isLoading = isJobsLoading || isAppsLoading;

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedJob, setSelectedJob] = useState<IRequest | null>(null);
  const [isApplyDialogOpen, setIsApplyDialogOpen] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [proposedPrice, setProposedPrice] = useState<number>(0);

  const { mutate: apply, isPending: isApplying } = useApplyForRequest(
    selectedJob?.id || 0,
  );
  
  const hasApplied = selectedJob ? myApps.some(app => app.requestId === selectedJob.id) : false;
  const filteredJobs = jobs.filter(
    (job) =>
      job.subjectName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.studentName?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  const handleSelectJob = useCallback((job: IRequest) => {
    setSelectedJob(job);
  }, []);

  const handleOpenApplyDialog = useCallback(() => {
    if (selectedJob) {
      setProposedPrice(selectedJob.desiredPrice);
      setIsApplyDialogOpen(true);
    }
  }, [selectedJob]);

  const handlePriceChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setProposedPrice(Number(e.target.value));
  }, []);

  const handleCoverLetterChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCoverLetter(e.target.value);
  }, []);

  const handleApply = () => {
    if (!coverLetter.trim()) {
      toast.error("Vui lòng nhập thư ngỏ");
      return;
    }

    const toastId = toast.loading("Đang gửi hồ sơ ứng tuyển...");
    apply(
      { coverLetter, proposedPrice },
      {
        onSuccess: () => {
          toast.success("Đã gửi hồ sơ ứng tuyển thành công!", { id: toastId });
          setIsApplyDialogOpen(false);
          setCoverLetter("");
        },
        onError: (err: any) => {
          toast.error(formatErrorMessage(err, "Có lỗi xảy ra khi ứng tuyển"), { id: toastId });
        },
      },
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-40 w-full animate-pulse rounded-3xl bg-muted"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left Side: Search & List */}
      <div className="lg:col-span-12 xl:col-span-7 space-y-6">
        <div className="relative group">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors"
            size={20}
          />
          <input
            type="text"
            placeholder="Tìm kiếm theo môn học hoặc tên học sinh..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full h-14 pl-12 pr-4 rounded-2xl border border-border bg-card text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
          />
        </div>

        <div className="space-y-4">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                isSelected={selectedJob?.id === job.id}
                onSelect={handleSelectJob}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center rounded-4xl border-2 border-dashed border-border opacity-50">
              <Search size={48} className="mb-4 text-muted-foreground" />
              <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
                Không tìm thấy yêu cầu nào
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Right Side: Job Detail View */}
      <div className="lg:col-span-12 xl:col-span-5">
        <div className="sticky top-8 space-y-6">
          {selectedJob ? (
            <div className="rounded-4xl border border-border bg-card p-8 shadow-2xl shadow-primary/5 animate-in fade-in zoom-in-95 duration-500">
              <div className="flex items-center gap-4 mb-8">
                <div className="h-16 w-16 flex items-center justify-center rounded-2xl bg-primary text-white shadow-xl shadow-primary/20">
                  <Sparkles size={32} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-foreground tracking-tight">
                    {selectedJob.subjectName}
                  </h2>
                  <p className="text-sm text-muted-foreground font-bold uppercase tracking-widest">
                    Lớp {selectedJob.gradeLevel} • {selectedJob.studentName}
                  </p>
                </div>
              </div>

              <div className="space-y-6 mb-8">
                <div className="space-y-2">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    Mô tả yêu cầu
                  </h4>
                  <p className="text-sm font-medium leading-relaxed text-foreground bg-muted/30 p-4 rounded-2xl border border-border italic">
                    "{selectedJob.description || "Không có mô tả chi tiết"}"
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      Ngân sách dự kiến
                    </h4>
                    <p className="text-sm font-black text-primary">
                      {formatPrice(selectedJob.desiredPrice, " / buổi")}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      Tần suất
                    </h4>
                    <p className="text-sm font-black text-foreground">
                      {selectedJob.sessionsPerWeek} buổi / tuần
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    Chi tiết khóa học
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge
                      variant="outline"
                      className="border-primary/20 text-primary uppercase text-[9px] font-bold"
                    >
                      {selectedJob.teachingMode}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="border-primary/20 text-primary uppercase text-[9px] font-bold"
                    >
                      Lớp {selectedJob.gradeLevel}
                    </Badge>
                  </div>
                </div>
              </div>

              {hasApplied ? (
                <Button
                  disabled
                  className="w-full h-16 rounded-2xl bg-muted text-muted-foreground text-sm font-black uppercase tracking-widest"
                >
                  <CheckCircle2 size={18} className="mr-2 text-primary" />
                  Đã ứng tuyển
                </Button>
              ) : (
                <Button
                  onClick={handleOpenApplyDialog}
                  className="w-full h-16 rounded-2xl bg-primary text-sm font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all hover:scale-[1.02] active:scale-95 group"
                >
                  Ứng tuyển ngay
                  <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              )}

              <p className="mt-4 text-[10px] text-center font-bold text-muted-foreground uppercase opacity-50 tracking-tighter">
                Yêu cầu ứng tuyển sẽ được gửi trực tiếp đến phụ huynh
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-20 text-center rounded-4xl border-2 border-dashed border-border opacity-40">
              <div className="p-6 rounded-full bg-muted mb-6">
                <Filter size={40} className="text-muted-foreground" />
              </div>
              <p className="text-sm font-black uppercase tracking-widest text-muted-foreground">
                Chọn một yêu cầu <br /> để xem chi tiết
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Application Dialog */}
      <Dialog open={isApplyDialogOpen} onOpenChange={setIsApplyDialogOpen}>
        <DialogContent className="sm:max-w-125 rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black uppercase tracking-tight">
              Hồ sơ ứng tuyển
            </DialogTitle>
            <DialogDescription className="font-medium">
              Gửi một lời chào ấn tượng và đề xuất mức lương để tăng cơ hội nhận
              lớp.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label
                htmlFor="price"
                className="text-xs font-black uppercase tracking-widest"
              >
                Mức lương đề xuất (đ/buổi)
              </Label>
              <div className="relative">
                <DollarSign
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-primary"
                  size={16}
                />
                <Input
                  id="price"
                  type="number"
                  value={proposedPrice}
                  onChange={handlePriceChange}
                  className="pl-10 h-12 rounded-xl focus:ring-primary/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="coverLetter"
                className="text-xs font-black uppercase tracking-widest"
              >
                Thư ngỏ / Giới thiệu bản thân
              </Label>
              <div className="relative">
                <MessageSquare
                  className="absolute left-3 top-3 text-muted-foreground"
                  size={16}
                />
                <Textarea
                  id="coverLetter"
                  placeholder="Ví dụ: Em đã có 3 năm kinh nghiệm dạy môn này, tính cách kiên nhẫn..."
                  value={coverLetter}
                  onChange={handleCoverLetterChange}
                  className="min-h-37.5 pl-10 pt-3 rounded-xl focus:ring-primary/20"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsApplyDialogOpen(false)}
              className="rounded-xl font-bold"
            >
              Hủy
            </Button>
            <Button
              onClick={handleApply}
              disabled={isApplying}
              className="rounded-xl bg-primary px-8 font-black uppercase tracking-widest"
            >
              {isApplying ? <Loader2 className="animate-spin mr-2" /> : null}
              Gửi hồ sơ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
