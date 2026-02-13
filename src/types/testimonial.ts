export interface Testimonial {
  _id: string;
  testimonial: string;
  name: string;
  email?: string;
  designation: string;
  company: string;
  image: string | null;
  createdAt: string;
  updatedAt: string;
  isOwner?: boolean;
}