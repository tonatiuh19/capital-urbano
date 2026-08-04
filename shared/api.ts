export interface Development {
  id: number;
  slug: string;
  name: string;
  tagline?: string | null;
  description_short?: string | null;
  description?: string | null;
  location_label?: string | null;
  address_line?: string | null;
  city?: string | null;
  state?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  units_label?: string | null;
  status: string;
  delivery_estimate?: string | null;
  total_floors?: number | null;
  total_units?: number | null;
  hero_image_url?: string | null;
  brochure_url?: string | null;
  highlights?: string[] | null;
  external_site_url?: string | null;
  liv_project_slug?: string | null;
  contact_email?: string | null;
  contact_phone?: string | null;
  is_featured?: number;
  is_active?: number;
  display_order?: number;
  media?: DevelopmentMedia[];
}

export interface DevelopmentMedia {
  id: number;
  media_type: "image" | "video";
  url: string;
  caption?: string | null;
  display_order: number;
}

export interface QualityPillar {
  id: number;
  title: string;
  description_short?: string | null;
  description?: string | null;
  icon?: string | null;
  display_order: number;
}

export type TeamSection = "leadership" | "technical" | "general";

export interface TeamMember {
  id: number;
  name: string;
  role_title?: string | null;
  bio_short?: string | null;
  bio?: string | null;
  photo_url?: string | null;
  linkedin_url?: string | null;
  team_section?: TeamSection | null;
  is_leadership: number;
}

export interface CmsPage {
  slug: string;
  title: string;
  body_markdown?: string | null;
  meta_description?: string | null;
  updated_at?: string;
}

export interface FaqItem {
  id: number;
  question: string;
  answer: string;
  category: string;
}

export interface ContactPageData {
  settings: Record<string, string>;
  faq: FaqItem[];
  developments: Development[];
  page?: CmsPage | null;
}

export interface SiteSettings {
  settings: Record<string, string>;
}

export interface DevelopmentMapMarker {
  id: number;
  slug: string;
  name: string;
  location_label?: string | null;
  latitude: number;
  longitude: number;
  hero_image_url?: string | null;
  status: string;
  display_order?: number;
}

export interface DevelopmentsMapResponse {
  center: { lat: number; lng: number };
  markers: DevelopmentMapMarker[];
}

export type BlogPostStatus = "draft" | "scheduled" | "published" | "archived";

export type BlogSectionType =
  | "text"
  | "heading"
  | "image"
  | "gallery"
  | "youtube"
  | "embed"
  | "quote"
  | "cta";

export interface BlogAuthor {
  id: number;
  slug: string;
  name: string;
  role_title?: string | null;
  bio?: string | null;
  photo_url?: string | null;
  is_active?: number;
  display_order?: number;
}

export interface BlogCategory {
  id: number;
  slug: string;
  name: string;
  description?: string | null;
  display_order?: number;
  is_active?: number;
}

export interface BlogTag {
  id: number;
  slug: string;
  name: string;
}

export interface BlogPostSection {
  id?: number;
  section_type: BlogSectionType;
  title?: string | null;
  body?: string | null;
  image_url?: string | null;
  /** Gallery URLs, youtube id, embed html, cta href, etc. */
  meta_json?: Record<string, unknown> | string | null;
  display_order: number;
  is_active?: number;
}

export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
  meta_keywords?: string | null;
  hero_image_url?: string | null;
  author_id?: number | null;
  category_id?: number | null;
  status: BlogPostStatus;
  published_at?: string | null;
  scheduled_at?: string | null;
  is_featured?: number;
  display_order?: number;
  created_at?: string;
  updated_at?: string;
  author?: BlogAuthor | null;
  category?: BlogCategory | null;
  tags?: BlogTag[];
  sections?: BlogPostSection[];
  tag_ids?: number[];
}
