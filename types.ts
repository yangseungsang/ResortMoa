
// Enums for filtering
export enum Brand {
  SONO = 'SONO',
  HANWHA = 'HANWHA',
  KENSINGTON = 'KENSINGTON',
  Lotte = 'LOTTE',
  Kumho = 'KUMHO',
}

export enum Region {
  Gangwon = 'Gangwon',
  Jeju = 'Jeju',
  Gyeongsang = 'Gyeongsang',
  Jeolla = 'Jeolla',
  Chungcheong = 'Chungcheong',
  Gyeonggi = 'Gyeonggi',
}

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

export interface Resort {
  id: number;
  name: string;
  brand: Brand;
  region_depth1: Region;
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
  application_type: ApplicationType;
  reviews: Review[];
  images?: string[]; // Gallery images
}

export interface FilterState {
  searchQuery: string;
  selectedRegion: Region | 'ALL';
  selectedBrand: Brand | 'ALL';
}
