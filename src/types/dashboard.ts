export interface DashboardStats {
  totalContacts: number;
  totalTestimonials: number;
  totalVisitors: number;
  totalVisits: number;
}

export interface DashboardRecentContact {
  _id: string;
  name: string;
  email: string;
  message: string;
  ipAddress?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardRecentTestimonial {
  _id: string;
  testimonial: string;
  name: string;
  designation: string;
  company: string;
  image: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardRecentVisitor {
  _id: string;
  ipAddress: string;
  visits: number;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardData {
  stats: DashboardStats;
  recentContacts: DashboardRecentContact[];
  recentTestimonials: DashboardRecentTestimonial[];
  recentVisitors: DashboardRecentVisitor[];
}
