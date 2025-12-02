
export enum PlaceCategory {
  TOUR = 'TOUR',
  FOOD = 'FOOD',
  STORE = 'STORE',
}

export enum ApplicationType {
  LOTTERY = 'LOTTERY', // 추첨제
  FIRST_COME = 'FIRST_COME', // 선착순
  APPROVE = 'APPROVE', // 담당자 승인
}

// Data Models
export interface Review {
  id: number;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

export interface NearbyPlace {
  id: number;
  resort_id: number;
  name: string;
  category: PlaceCategory;
  distance_text: string;
  description: string;
  latitude?: number;
  longitude?: number;
  image_url?: string;
  images?: string[]; // Multiple images for slider
  more_images?: string[]; // Additional images from server
  detail_content?: string; // HTML or text for detail view
  info_attributes?: { label: string; value: string; }[]; // Dynamic Key-Value pairs for extra info
}

export interface RoomType {
  id: number;
  resort_id: number;
  name: string;
  capacity: string;
  features: string;
  image_path: string;
  description_long?: string;
  amenities?: string[];
  more_images?: string[];
}

export interface BookingRule {
  name: string;          // e.g. "Lottery System"
  description: string;   // Full combined description (Generic + Brand specific)
  badge_text: string;    // Short text for list view (e.g. "Lottery: 1st-10th")
  ui_theme: {            // Visual style
      bg: string;
      text: string;
      border: string;
      icon_color: string;
  };
}

export interface GuideSection {
  id: number;
  title: string;      // e.g. "Support Criteria"
  content: string;    // Main description
  details?: string[]; // Bullet points
  category: 'CRITERIA' | 'RULES' | 'RESTRICTION' | 'CONTACT' | 'ETC';
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
  thumbnail_url: string;
  contact: string;
  facilities: string[]; 
  rooms: RoomType[];
  nearby_places: NearbyPlace[];
  reviews: Review[];
  review_summary?: string; // Server provided review summary
  images?: string[]; // Gallery images
  booking_rule?: BookingRule; // Unified booking rule object
}

export interface FilterState {
  searchQuery: string;
  selectedRegion: string; 
  selectedBrand: string; 
}