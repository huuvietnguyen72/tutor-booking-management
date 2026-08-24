export interface Tutor {
  id: string | number;
  name: string;
  avatar: string;
  university: string;
  major: string;
  rating: number;
  reviewCount: number;
  subjects: string[];
  bio: string;
  price: number;
  location: string;
  responseTime: string;
  isTopRated?: boolean;
  format: ("Online" | "Trực tiếp")[];
  levels: string[];
}
