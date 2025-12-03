
export enum PlaceCategory {
  TOUR = 'TOUR',
  FOOD = 'FOOD',
  STORE = 'STORE',
}

export enum ApplicationType {
  LOTTERY = 'LOTTERY',
  FIRST_COME = 'FIRST_COME',
  APPROVE = 'APPROVE',
}

export interface FilterState {
  searchQuery: string;
  selectedRegion: string;
  selectedBrand: string;
}

export interface Review {
  id: number;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

export interface BookingRule {
  name: string;
  description: string;
  badge_text: string;
  ui_theme: {
    bg: string;
    text: string;
    border: string;
    icon_color: string;
  };
}

export interface RoomType {
  id: number;
  name: string;
  capacity: string;
  features: string;
  image_path: string;
  description_long?: string;
  amenities?: string[];
  more_images?: string[];
}

export interface NearbyPlace {
  id: number;
  name: string;
  category: PlaceCategory;
  description: string;
  latitude: number;
  longitude: number;
  image_url: string;
  images?: string[];
  more_images?: string[];
  detail_content?: string;
  info_attributes?: { label: string; value: string }[];
}

export interface ExternalLink {
  label: string;
  url: string;
}

export interface Resort {
  id: number;
  name: string;
  brand: string;
  region_depth1: string;
  region_depth2: string;
  latitude: number;
  longitude: number;
  address: string;
  check_in_out: string;
  contact: string;
  thumbnail_url: string;
  facilities: string[];
  booking_rule?: BookingRule;
  reviews: Review[];
  review_summary?: string;
  images: string[];
  rooms: RoomType[];
  nearby_places: NearbyPlace[];
  external_links?: ExternalLink[];
}

export interface GuideSection {
  id: number;
  title: string;
  content: string;
  details?: string[];
  category: string;
}
