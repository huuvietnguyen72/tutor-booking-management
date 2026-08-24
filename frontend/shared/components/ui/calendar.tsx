"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronLeft, ChevronRight, ChevronDown, Calendar } from "lucide-react"
import { cn } from "@/shared/lib/utils"

// ─── Constants & Helpers ──────────────────────────────────────────────────────

const WEEKDAYS = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"]
const MONTHS_SHORT = ["Th.1", "Th.2", "Th.3", "Th.4", "Th.5", "Th.6", "Th.7", "Th.8", "Th.9", "Th.10", "Th.11", "Th.12"]
const MONTHS_FULL = [
  "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4",
  "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8",
  "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12",
]

/** Number of years shown in a single year-picker page */
const YEAR_PAGE_SIZE = 12

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}
function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay()
}
function formatDate(date: Date): string {
  const d = date.getDate().toString().padStart(2, "0")
  const m = (date.getMonth() + 1).toString().padStart(2, "0")
  return `${d}/${m}/${date.getFullYear()}`
}
function isSameDay(a: Date, b: Date) {
  return a.getDate() === b.getDate() && a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear()
}

// ─── View types ───────────────────────────────────────────────────────────────

type CalView = "day" | "month" | "year"

// ─── CalendarPicker ───────────────────────────────────────────────────────────

interface CalendarPickerProps {
  selected: Date | null
  onSelect: (date: Date) => void
  minDate?: Date
}

export function CalendarPicker({ selected, onSelect, minDate }: CalendarPickerProps) {
  const today = new Date()
  const min = minDate ?? today

  const [view, setView] = useState<CalView>("day")
  const [viewYear, setViewYear] = useState(selected?.getFullYear() ?? today.getFullYear())
  const [viewMonth, setViewMonth] = useState(selected?.getMonth() ?? today.getMonth())
  // Year picker: the first year shown in the current page
  const [yearPageStart, setYearPageStart] = useState(
    Math.floor((selected?.getFullYear() ?? today.getFullYear()) / YEAR_PAGE_SIZE) * YEAR_PAGE_SIZE
  )

  // ── Day View helpers ────────────────────────────────────────────────────────
  const daysInMonth = getDaysInMonth(viewYear, viewMonth)
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth)
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  const canGoPrevMonth = () => {
    const firstOfView = new Date(viewYear, viewMonth, 1)
    return firstOfView > new Date(min.getFullYear(), min.getMonth(), 1)
  }
  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) }
    else setViewMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) }
    else setViewMonth(m => m + 1)
  }

  // ── Month View helpers ──────────────────────────────────────────────────────
  const canGoPrevYear = () => viewYear > min.getFullYear()
  const prevYear = () => setViewYear(y => y - 1)
  const nextYear = () => setViewYear(y => y + 1)

  const selectMonth = (m: number) => {
    setViewMonth(m)
    setView("day")
  }

  // ── Year View helpers ───────────────────────────────────────────────────────
  const years = Array.from({ length: YEAR_PAGE_SIZE }, (_, i) => yearPageStart + i)
  const prevYearPage = () => setYearPageStart(s => s - YEAR_PAGE_SIZE)
  const nextYearPage = () => setYearPageStart(s => s + YEAR_PAGE_SIZE)
  const canGoPrevYearPage = () => yearPageStart > min.getFullYear()

  const selectYear = (y: number) => {
    setViewYear(y)
    setView("month")
  }

  // Keep year page in sync when viewYear changes from outside
  const openYearView = () => {
    setYearPageStart(Math.floor(viewYear / YEAR_PAGE_SIZE) * YEAR_PAGE_SIZE)
    setView("year")
  }

  // ── Cyclic header label ─────────────────────────────────────────────────────
  // day view header: "Tháng 3 2026"  → click → month view
  // month view header: "2026"         → click → year view
  // year view header: "2024 – 2035"   → click back to day view

  return (
    <div className="p-3 select-none w-full">

      {/* ── Navigation Bar ── */}
      <div className="flex items-center justify-between mb-3">
        {/* Prev arrow */}
        <button
          onClick={() => {
            if (view === "day") prevMonth()
            else if (view === "month") { if (canGoPrevYear()) prevYear() }
            else { if (canGoPrevYearPage()) prevYearPage() }
          }}
          disabled={
            view === "day" ? !canGoPrevMonth()
            : view === "month" ? !canGoPrevYear()
            : !canGoPrevYearPage()
          }
          className="h-7 w-7 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-accent disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={16} />
        </button>

        {/* Clickable header label */}
        <button
          onClick={() => {
            if (view === "day") setView("month")
            else if (view === "month") openYearView()
            else setView("day")
          }}
          className="flex items-center gap-1 text-sm font-bold text-foreground hover:bg-accent transition-colors rounded-lg px-2 py-0.5"
        >
          {view === "day" && <>{MONTHS_FULL[viewMonth]} {viewYear}</>}
          {view === "month" && <>{viewYear}</>}
          {view === "year" && <>{yearPageStart} – {yearPageStart + YEAR_PAGE_SIZE - 1}</>}
          <ChevronDown
            size={13}
            className={`transition-transform ${view !== "day" ? "rotate-180" : ""}`}
          />
        </button>

        {/* Next arrow */}
        <button
          onClick={() => {
            if (view === "day") nextMonth()
            else if (view === "month") nextYear()
            else nextYearPage()
          }}
          className="h-7 w-7 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-accent transition-colors"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* ── Day View ── */}
      {view === "day" && (
        <>
          {/* Weekday labels */}
          <div className="grid grid-cols-7 mb-1">
            {WEEKDAYS.map(d => (
              <div key={d} className="text-center text-[10px] font-semibold text-muted-foreground/70 py-1">{d}</div>
            ))}
          </div>

          {/* Day grid */}
          <div className="grid grid-cols-7 gap-y-0.5">
            {cells.map((day, idx) => {
              if (day === null) return <div key={`blank-${idx}`} />
              const cellDate = new Date(viewYear, viewMonth, day)
              const minDay = new Date(min.getFullYear(), min.getMonth(), min.getDate())
              const isDisabled = cellDate < minDay
              const isSelected = selected ? isSameDay(cellDate, selected) : false
              const isToday = isSameDay(cellDate, today)

              return (
                <button
                  key={day}
                  disabled={isDisabled}
                  onClick={() => onSelect(cellDate)}
                  className={[
                    "h-8 w-full rounded-lg text-xs font-medium transition-all",
                    isDisabled ? "text-muted-foreground/30 cursor-not-allowed" : "hover:bg-accent hover:text-accent-foreground cursor-pointer",
                    isSelected ? "bg-primary! text-primary-foreground! font-bold shadow-sm" : "",
                    isToday && !isSelected ? "ring-1 ring-primary/50 text-primary font-bold" : "",
                    !isSelected && !isToday && !isDisabled ? "text-foreground" : "",
                  ].filter(Boolean).join(" ")}
                >
                  {day}
                </button>
              )
            })}
          </div>
        </>
      )}

      {/* ── Month View ── */}
      {view === "month" && (
        <div className="grid grid-cols-3 gap-1.5">
          {MONTHS_SHORT.map((label, m) => {
            const isDisabled = viewYear < min.getFullYear() || (viewYear === min.getFullYear() && m < min.getMonth())
            const isSelected = selected && selected.getFullYear() === viewYear && selected.getMonth() === m
            const isCurrent = today.getFullYear() === viewYear && today.getMonth() === m

            return (
              <button
                key={label}
                disabled={isDisabled}
                onClick={() => selectMonth(m)}
                className={[
                  "h-9 rounded-xl text-xs font-semibold transition-all",
                  isDisabled ? "text-muted-foreground/30 cursor-not-allowed" : "hover:bg-accent hover:text-accent-foreground cursor-pointer",
                  isSelected ? "bg-primary! text-primary-foreground! shadow-sm" : "",
                  isCurrent && !isSelected ? "ring-1 ring-primary/50 text-primary" : "",
                  !isSelected && !isCurrent && !isDisabled ? "text-foreground" : "",
                ].filter(Boolean).join(" ")}
              >
                {label}
              </button>
            )
          })}
        </div>
      )}

      {/* ── Year View ── */}
      {view === "year" && (
        <div className="grid grid-cols-3 gap-1.5">
          {years.map(y => {
            const isDisabled = y < min.getFullYear()
            const isSelected = selected && selected.getFullYear() === y
            const isCurrent = today.getFullYear() === y

            return (
              <button
                key={y}
                disabled={isDisabled}
                onClick={() => selectYear(y)}
                className={[
                  "h-9 rounded-xl text-xs font-semibold transition-all",
                  isDisabled ? "text-muted-foreground/30 cursor-not-allowed" : "hover:bg-accent hover:text-accent-foreground cursor-pointer",
                  isSelected ? "bg-primary! text-primary-foreground! shadow-sm" : "",
                  isCurrent && !isSelected ? "ring-1 ring-primary/50 text-primary" : "",
                  !isSelected && !isCurrent && !isDisabled ? "text-foreground" : "",
                ].filter(Boolean).join(" ")}
              >
                {y}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ─── DatePickerInput – trigger + dropdown ────────────────────────────────────

interface DatePickerInputProps {
  value: Date | null
  onChange: (date: Date) => void
  placeholder?: string
  minDate?: Date
  className?: string
}

export function DatePickerInput({ 
  value, 
  onChange, 
  placeholder = "Chọn ngày...", 
  minDate,
  className 
}: DatePickerInputProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const handleSelect = (date: Date) => {
    onChange(date)
    setOpen(false)
  }

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className={cn(
          "flex w-full items-center gap-2 border rounded-xl h-10 px-3 text-sm transition-colors text-left bg-background",
          open ? "border-primary ring-1 ring-primary/20" : "border-input hover:border-accent-foreground/20",
          value ? "text-foreground" : "text-muted-foreground",
          className
        )}
      >
        <Calendar size={15} className={value ? "text-primary" : "text-muted-foreground"} />
        <span className="flex-1 truncate">{value ? formatDate(value) : placeholder}</span>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 mt-1.5 left-0 right-0 bg-popover border border-border rounded-2xl shadow-xl dark:shadow-none overflow-hidden animate-in fade-in zoom-in duration-200">
          <CalendarPicker selected={value} onSelect={handleSelect} minDate={minDate} />
        </div>
      )}
    </div>
  )
}
