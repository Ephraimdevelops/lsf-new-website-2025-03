export interface HeroSlide {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  image: string;
  ctaText?: string;
  ctaLink?: string;
  order: number;
  active: boolean;
  startDate?: string;
  endDate?: string;
}
