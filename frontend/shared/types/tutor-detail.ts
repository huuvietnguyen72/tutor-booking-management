import { ITutorAvailability, ITutorSubject } from "@/server/_types/tutor-type";

export interface SubjectPrice {
  label: string;
  price: number; // VND per session
  duration: number; // minutes
}

export interface Schedule {
  [day: string]: string[]; // e.g. { "T2": ["08:00 - 10:00", "20:00 - 22:00"] }
}

export interface Review {
  name: string;
  avatar?: string;
  comment: string;
  rating: number;
  timeAgo: string;
}

export interface TutorTabsProps {
  subjects: string[];
  price: number;
  levels: string[];
  format: ("Online" | "Trực tiếp" | "Cả hai" | string)[];
  rating: number;
  reviewCount: number;
  tutorId: string;
  apiAvailability?: ITutorAvailability[];
  apiSubjects?: ITutorSubject[];
}

export interface TutorBioProps {
  bio: string;
}

export interface TutorHeaderProps {
  tutor: {
    name: string;
    avatar: string;
    university: string;
    major: string;
    rating: number;
    reviewCount: number;
    location: string;
    responseTime: string;
    subjects: string[];
    isTopRated?: boolean;
    experience?: string;
  };
}

export interface BookingSidebarProps {
  price: number;
  subjects: string[];
  apiSubjects?: ITutorSubject[];
}
