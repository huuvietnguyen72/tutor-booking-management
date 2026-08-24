"use client"

import { Search, MapPin, Star, SlidersHorizontal } from "lucide-react"
import { Checkbox } from "@/shared/components/ui/checkbox"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Slider } from "@/shared/components/ui/slider"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select"
import { useState, useEffect, useCallback } from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { useDebounce } from "@/shared/hooks/use-debounce" 
import { LEVEL_OPTIONS, RATING_OPTIONS } from "@/shared/constants/filter-options"
import { useGetAllSubjects } from "@/server/_actions/tutor-action"

export function FilterSidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { data: allSubjects, isLoading: isLoadingSubjects } = useGetAllSubjects()

  // State managed by URL Search Params
  const query = searchParams.get("q") || ""
  const selectedSubjects = searchParams.get("subject")?.split(",") || []
  const level = searchParams.get("level") || "all"
  const minPrice = parseInt(searchParams.get("minPrice") || "150")
  const maxPrice = parseInt(searchParams.get("maxPrice") || "500")
  const format = searchParams.get("format") || "both" // offline | online | both
  const location = searchParams.get("location") || ""
  const selectedRatings = searchParams.get("rating")?.split(",") || []

  // State for inputs (debounced)
  const [localQuery, setLocalQuery] = useState(query)
  const [localLocation, setLocalLocation] = useState(location)
  const debouncedQuery = useDebounce(localQuery, 500)
  const debouncedLocation = useDebounce(localLocation, 500)

  const [priceRange, setPriceRange] = useState<number[]>([minPrice, maxPrice])
  const debouncedPriceRange = useDebounce(priceRange, 500)

  // Update URL helper
  const createQueryString = useCallback(
    (params: Record<string, string | string[] | null>) => {
      const newParams = new URLSearchParams(searchParams.toString())

      Object.entries(params).forEach(([key, value]) => {
        if (value === null || value === "" || (Array.isArray(value) && value.length === 0) || value === "all") {
          newParams.delete(key)
        } else {
          newParams.set(key, Array.isArray(value) ? value.join(",") : value)
        }
      })

      return newParams.toString()
    },
    [searchParams]
  )

  const updateFilters = useCallback((params: Record<string, string | string[] | null>) => {
    const queryString = createQueryString({ ...params, page: "1" }) // Reset to page 1 on filter change
    router.push(`${pathname}?${queryString}`, { scroll: false })
  }, [createQueryString, pathname, router])

  // Sync inputs when URL changes (external sync)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLocalQuery(query)
    setLocalLocation(location)
    setPriceRange([minPrice, maxPrice])
  }, [query, location, minPrice, maxPrice])

  // Update URL when debounced values change
  useEffect(() => {
    // Only update if debounced value is in sync with current local value
    // This prevents stale debounced values from overwriting the URL during a reset/clear all
    if (debouncedQuery !== query && debouncedQuery === localQuery) {
      updateFilters({ q: debouncedQuery })
    }
  }, [debouncedQuery, query, updateFilters, localQuery])

  useEffect(() => {
    if (debouncedLocation !== location && debouncedLocation === localLocation) {
      updateFilters({ location: debouncedLocation })
    }
  }, [debouncedLocation, location, updateFilters, localLocation])

  // Update URL when debounced price changes
  useEffect(() => {
    if (
      (debouncedPriceRange[0] !== minPrice || debouncedPriceRange[1] !== maxPrice) &&
      debouncedPriceRange[0] === priceRange[0] &&
      debouncedPriceRange[1] === priceRange[1]
    ) {
      updateFilters({
        minPrice: debouncedPriceRange[0].toString(),
        maxPrice: debouncedPriceRange[1].toString()
      })
    }
  }, [debouncedPriceRange, minPrice, maxPrice, updateFilters, priceRange])

  const handleSubjectChange = (subject: string, checked: boolean) => {
    const newSubjects = checked ? [subject] : []
    updateFilters({ subject: newSubjects })
  }

  const handleRatingChange = (rating: string, checked: boolean) => {
    const newRatings = checked
      ? [...selectedRatings, rating]
      : selectedRatings.filter(r => r !== rating)
    updateFilters({ rating: newRatings })
  }

  const handleClearAll = () => {
    // Reset all local states immediately
    setLocalQuery("")
    setLocalLocation("")
    setPriceRange([150, 500])
    
    // Clear URL query parameters
    router.push(pathname)
  }

  return (
    <div className="space-y-8 bg-card p-6 rounded-3xl border border-border h-fit lg:sticky lg:top-32 transition-colors duration-500 shadow-sm">
      {/* Search Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
          <SlidersHorizontal size={18} className="text-blue-600 dark:text-blue-400" />
          Bộ lọc tìm kiếm
        </h3>
        <button 
          onClick={handleClearAll}
          className="text-sm text-blue-600 dark:text-blue-400 font-semibold hover:underline cursor-pointer"
        >
          Xóa hết
        </button>
      </div>

      {/* Search Input */}
      <div className="space-y-4">
        <h4 className="font-bold text-foreground/80 text-xs uppercase tracking-widest flex items-center gap-2">
          <span className="w-1 h-3 bg-blue-600 dark:bg-blue-400 rounded-full" />
          Tìm kiếm
        </h4>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <Input 
            placeholder="Tìm theo tên gia sư..." 
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            className="pl-10 rounded-xl border-border h-11 focus:ring-blue-500 bg-muted/30 cursor-text text-foreground placeholder:text-muted-foreground" 
          />
        </div>
      </div>

      {/* Subject Filter */}
      <div className="space-y-4">
        <h4 className="font-bold text-foreground/80 text-xs uppercase tracking-widest flex items-center gap-2">
          <span className="w-1 h-3 bg-blue-600 dark:bg-blue-400 rounded-full" />
          Môn học
        </h4>
        <div className="grid grid-cols-1 gap-3 max-h-60 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-muted-foreground/20">
          {isLoadingSubjects ? (
            <div className="text-sm text-muted-foreground animate-pulse">Đang tải môn học...</div>
          ) : (
            allSubjects?.map((subject: any) => (
              <div key={subject.id} className="flex items-center space-x-3 group cursor-pointer p-1 rounded-lg hover:bg-muted/50 transition-colors">
                <Checkbox 
                  id={subject.name} 
                  className="cursor-pointer border-border data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                  checked={selectedSubjects.includes(subject.name)}
                  onCheckedChange={(checked) => handleSubjectChange(subject.name, checked as boolean)}
                />
                <Label htmlFor={subject.name} className="text-sm font-medium text-foreground/70 group-hover:text-foreground cursor-pointer select-none transition-colors">
                  {subject.name}
                </Label>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Class Level */}
      <div className="space-y-4">
        <h4 className="font-bold text-foreground/80 text-xs uppercase tracking-widest flex items-center gap-2">
          <span className="w-1 h-3 bg-blue-600 dark:bg-blue-400 rounded-full" />
          Cấp học
        </h4>
        <Select 
          value={level} 
          onValueChange={(val) => updateFilters({ level: val })}
        >
          <SelectTrigger className="w-full rounded-xl border-border h-11 focus:ring-blue-500 cursor-pointer text-foreground bg-muted/30">
            <SelectValue placeholder="Chọn cấp học" />
          </SelectTrigger>
          <SelectContent className="rounded-xl bg-card border-border">
            {LEVEL_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value} className="cursor-pointer text-foreground focus:bg-muted focus:text-foreground">{opt.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Price Range */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-foreground/80 text-xs uppercase tracking-widest flex items-center gap-2">
            <span className="w-1 h-3 bg-blue-600 dark:bg-blue-400 rounded-full" />
            Chi phí học
          </h4>
        </div>
        <Slider
          value={priceRange}
          max={1000}
          step={50}
          onValueChange={setPriceRange}
          className="py-4 cursor-pointer"
        />
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 px-3 py-2 bg-muted/40 border border-border rounded-xl text-center">
            <span className="text-[10px] text-muted-foreground block uppercase font-bold tracking-tighter">Từ</span>
            <span className="text-sm font-bold text-foreground">{priceRange[0]}k</span>
          </div>
          <div className="flex-1 px-3 py-2 bg-muted/40 border border-border rounded-xl text-center">
            <span className="text-[10px] text-muted-foreground block uppercase font-bold tracking-tighter">Đến</span>
            <span className="text-sm font-bold text-foreground">{priceRange[1]}k+</span>
          </div>
        </div>
      </div>

      {/* Format Toggle */}
      <div className="space-y-4">
        <h4 className="font-bold text-foreground/80 text-xs uppercase tracking-widest flex items-center gap-2">
          <span className="w-1 h-3 bg-blue-600 dark:bg-blue-400 rounded-full" />
          Hình thức
        </h4>
        <div className="flex p-1 bg-muted rounded-xl text-foreground">
          <button 
            onClick={() => updateFilters({ format: "offline" })}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all cursor-pointer ${
              format === "offline" ? "bg-card shadow-sm text-blue-600 dark:text-blue-400" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Trực tiếp
          </button>
          <button 
            onClick={() => updateFilters({ format: "online" })}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all cursor-pointer ${
              format === "online" ? "bg-card shadow-sm text-blue-600 dark:text-blue-400" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Online
          </button>
          <button 
            onClick={() => updateFilters({ format: "both" })}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all cursor-pointer ${
              format === "both" ? "bg-card shadow-sm text-blue-600 dark:text-blue-400" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Cả hai
          </button>
        </div>
      </div>

      {/* Location - Hidden as not supported by API yet */}
      {/* 
      <div className="space-y-4">
        <h4 className="font-bold text-foreground/80 text-xs uppercase tracking-widest flex items-center gap-2">
          <span className="w-1 h-3 bg-blue-600 dark:bg-blue-400 rounded-full" />
          Khu vực
        </h4>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <Input 
            placeholder="Nhập quận/huyện..." 
            value={localLocation}
            onChange={(e) => setLocalLocation(e.target.value)}
            className="pl-10 rounded-xl border-border h-11 focus:ring-blue-500 bg-muted/30 cursor-text text-foreground placeholder:text-muted-foreground" 
          />
        </div>
      </div>
      */}

      {/* Rating - Hidden as not supported by API yet */}
      {/*
      <div className="space-y-4 pb-4">
        <h4 className="font-bold text-foreground/80 text-xs uppercase tracking-widest flex items-center gap-2">
          <span className="w-1 h-3 bg-blue-600 dark:bg-blue-400 rounded-full" />
          Đánh giá
        </h4>
        <div className="space-y-2">
          {RATING_OPTIONS.map((star) => (
            <div key={star} className="flex items-center space-x-3 group cursor-pointer p-1 rounded-lg hover:bg-muted/50 transition-colors">
              <Checkbox 
                id={`star-${star}`} 
                className="cursor-pointer border-border data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                checked={selectedRatings.includes(star.toString())}
                onCheckedChange={(checked) => handleRatingChange(star.toString(), checked as boolean)}
              />
              <Label htmlFor={`star-${star}`} className="flex items-center gap-1 cursor-pointer select-none">
                <div className="flex text-yellow-500">
                  {Array(star).fill(0).map((_, i) => <Star key={i} size={14} fill="currentColor" strokeWidth={0} />)}
                  {Array(5 - star).fill(0).map((_, i) => <Star key={i + star} size={14} className="text-muted/50" />)}
                </div>
                {star < 5 && <span className="text-xs text-muted-foreground font-medium ml-1">Trở lên</span>}
              </Label>
            </div>
          ))}
        </div>
      </div>
      */}
    </div>
  )
}
