export interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: string;
  image: string;
  bio: string;
  email?: string;
  linkedin?: string;
  twitter?: string;
  expertise?: string[];
  joinDate: string;
  order?: number;
}
