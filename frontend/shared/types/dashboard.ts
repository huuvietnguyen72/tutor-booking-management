import { IRole } from "@/server/_types/auth-type"

export interface IUser {
  id: string
  name: string
  email: string
  role: IRole
  avatar?: string
  createdAt: string
}

// ─── Admin Dashboard ──────────────────────────────────────────────
export interface IAdminStats {
  totalUsers: number
  totalTutors: number
  totalParents: number
  totalBookings: number
  pendingApprovals: number
  monthlyRevenue: number
  revenueGrowth: number
  bookingGrowth: number
}

export interface IRecentUser {
  id: string
  name: string
  email: string
  role: IRole
  status: 'active' | 'pending' | 'suspended'
  joinedAt: string
  avatar?: string
}

export interface IPendingTutor {
  id: string
  name: string
  email: string
  subject: string
  experience: number
  submittedAt: string
  avatar?: string
  documents: string[]
}

export interface IAdminBooking {
  id: string
  parentName: string
  tutorName: string
  subject: string
  date: string
  status: 'upcoming' | 'completed' | 'cancelled'
  amount: number
}

// ─── Tutor Dashboard ──────────────────────────────────────────────
export interface ITutorStats {
  totalStudents: number
  upcomingSessions: number
  monthlyEarnings: number
  averageRating: number
  totalReviews: number
  completedSessions: number
  earningsGrowth: number
}

export interface IUpcomingSession {
  id: string
  studentName: string
  parentName: string
  subject: string
  date: string
  time: string
  duration: number // minutes
  status: 'confirmed' | 'pending' | 'cancelled'
  avatar?: string
}

export interface IReview {
  id: string
  studentName: string
  parentName: string
  rating: number
  comment: string
  date: string
  avatar?: string
}

export interface IEarningRecord {
  month: string
  amount: number
}

// ─── Parent Dashboard ─────────────────────────────────────────────
export interface IParentStats {
  totalChildren: number
  upcomingSessions: number
  activeTutors: number
  totalSpent: number
  spentGrowth: number
}

export interface IChild {
  id: string
  name: string
  age: number
  grade: string
  subjects: string[]
  avatar?: string
  activeTutors: number
  upcomingSessions: number
}

export interface IParentSession {
  id: string
  tutorName: string
  childName: string
  subject: string
  date: string
  time: string
  duration: number
  status: 'upcoming' | 'completed' | 'cancelled'
  amount: number
  avatar?: string
}

export interface IBookingHistory {
  id: string
  tutorName: string
  childName: string
  subject: string
  sessions: number
  totalPaid: number
  lastSession: string
  status: 'active' | 'completed'
}
