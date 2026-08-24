"use client"

import { Suspense } from "react"
import { FilterSidebar } from "./_sections/filter-sidebar"
import { TutorList } from "./_sections/tutor-list"
import { Button } from "@/shared/components/ui/button"
import { SlidersHorizontal, ChevronLeft, ChevronRight } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/shared/components/ui/sheet"
import { cn } from "@/shared/lib/utils"
import { useTutorFilter } from "@/shared/hooks/use-tutor-filter"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { Skeleton } from "@/shared/components/ui/skeleton"

// ─── Loading Skeletons ────────────────────────────────────────────────────────

function FilterSidebarLoader() {
  return <Skeleton className="rounded-3xl h-[600px] w-full" />
}

function ListLoader() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="rounded-3xl h-48 w-full" />
      ))}
    </div>
  )
}

// ─── Pagination ───────────────────────────────────────────────────────────────

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const SIBLING_COUNT = 1

  const buildPageItems = (): (number | "...")[] => {
    const items: (number | "...")[] = [1]

    if (currentPage > SIBLING_COUNT + 2) {
      items.push("...")
    }

    const rangeStart = Math.max(2, currentPage - SIBLING_COUNT)
    const rangeEnd = Math.min(totalPages - 1, currentPage + SIBLING_COUNT)
    for (let i = rangeStart; i <= rangeEnd; i++) {
      items.push(i)
    }

    if (currentPage < totalPages - SIBLING_COUNT - 1) {
      items.push("...")
    }

    if (totalPages > 1) {
      items.push(totalPages)
    }

    return items
  }

  return (
    <div className="flex items-center justify-center gap-2 pt-6">
      <Button
        variant="outline"
        size="icon"
        className="rounded-xl border-border text-muted-foreground hover:text-blue-600 hover:border-blue-200 disabled:opacity-30"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <ChevronLeft size={20} />
      </Button>

      {buildPageItems().map((page, i) => (
        <Button
          key={i}
          variant={page === currentPage ? "default" : "outline"}
          className={cn(
            "w-10 h-10 rounded-xl font-bold transition-all",
            page === currentPage
              ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
              : "border-border text-muted-foreground hover:border-blue-200 hover:text-blue-600 hover:bg-muted",
            page === "..." && "cursor-default hover:bg-transparent hover:border-border hover:text-muted-foreground"
          )}
          onClick={() => typeof page === "number" && onPageChange(page)}
        >
          {page}
        </Button>
      ))}

      <Button
        variant="outline"
        size="icon"
        className="rounded-xl border-border text-muted-foreground hover:text-blue-600 hover:border-blue-200 disabled:opacity-30"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        <ChevronRight size={20} />
      </Button>
    </div>
  )
}

// ─── Page Entry Point ─────────────────────────────────────────────────────────

export default function TutorSearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background pt-32 flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4" />
          <p className="text-muted-foreground font-medium">Đang tải danh sách gia sư...</p>
        </div>
      }
    >
      <TutorSearchContent />
    </Suspense>
  )
}

// ─── Main Content ─────────────────────────────────────────────────────────────

function TutorSearchContent() {
  const { totalPages, currentPage } = useTutorFilter()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", page.toString())
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="min-h-screen bg-background pb-20 transition-colors duration-500">
      {/* Header Banner */}
      <div className="bg-blue-600 dark:bg-blue-900/40 pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.2),transparent)] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto text-center space-y-4 relative z-10">
          <h1 className="text-3xl md:text-5xl font-black text-white leading-tight">
            TÌM KIẾM <span className="text-blue-200 dark:text-blue-400 uppercase">GIA SƯ</span> PHÙ HỢP
          </h1>
          <p className="text-blue-50/90 dark:text-blue-100/80 text-lg max-w-2xl mx-auto font-medium">
            Hàng ngàn gia sư giỏi từ các trường đại học hàng đầu sẵn sàng đồng hành cùng bạn.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-10 relative z-20">
        {/* Mobile Filter Trigger */}
        <div className="lg:hidden mb-6 flex justify-center">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                className="bg-card text-foreground border-border shadow-xl rounded-full px-8 py-6 h-auto text-lg font-bold gap-3 hover:bg-muted transition-all"
              >
                <SlidersHorizontal size={20} className="text-blue-600 dark:text-blue-400" />
                Bộ lọc & Tìm kiếm
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[350px] p-0 overflow-y-auto bg-card border-border">
              <SheetHeader className="p-4 border-b border-border">
                <SheetTitle className="text-left text-xl font-black text-foreground">Bộ lọc tìm kiếm</SheetTitle>
                <SheetDescription className="text-left text-muted-foreground">
                  Điều chỉnh các tùy chọn để tìm gia sư phù hợp nhất với bạn.
                </SheetDescription>
              </SheetHeader>
              <div className="p-4">
                <Suspense fallback={<FilterSidebarLoader />}>
                   <FilterSidebar />
                </Suspense>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block">
            <Suspense fallback={<FilterSidebarLoader />}>
              <FilterSidebar />
            </Suspense>
          </aside>

          {/* Main Content */}
          <main className="space-y-10">
            <Suspense fallback={<ListLoader />}>
              <TutorList />
            </Suspense>

            {totalPages > 0 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </main>
        </div>
      </div>
    </div>
  )
}