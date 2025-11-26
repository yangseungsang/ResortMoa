import { Resort, Brand, Region, PlaceCategory, ApplicationType } from '../types';

export const MOCK_RESORTS: Resort[] = [
  {
    id: 1,
    name: "Sono Felice Delpino",
    brand: Brand.SONO,
    region_depth1: Region.Gangwon,
    region_depth2: "Goseong",
    latitude: 38.2039,
    longitude: 128.5133,
    address: "1153 Misiryeong-yetgil, Toseong-myeon, Goseong-gun, Gangwon-do",
    check_in_out: "15:00 / 11:00",
    contact: "1588-4888",
    thumbnail_url: "https://picsum.photos/800/600?random=1",
    facilities: ["Infinity Pool", "Sauna", "Golf", "Cafe"],
    application_type: ApplicationType.LOTTERY,
    reviews: [
      { id: 1, author: "Employee A", rating: 5, comment: "The view of Ulsanbawi Rock is breathtaking!", date: "2024-10-15" },
      { id: 2, author: "Manager Kim", rating: 4, comment: "Room condition was great, but check-in took a while.", date: "2024-09-20" }
    ],
    rooms: [
      {
        id: 101,
        resort_id: 1,
        name: "Gold Suite",
        capacity: "5 Pax",
        features: "2 Bedrooms, 2 Bathrooms, Mountain View",
        image_path: "https://picsum.photos/400/300?random=10",
        description_long: "The Gold Suite offers a luxurious stay with a panoramic view of Seoraksan Mountain. It features a spacious living room and modern kitchen amenities.",
        amenities: ["TV", "WiFi", "Refrigerator", "Induction", "Hair Dryer"],
        more_images: ["https://picsum.photos/400/300?random=101", "https://picsum.photos/400/300?random=102"]
      },
      {
        id: 102,
        resort_id: 1,
        name: "Royal Suite",
        capacity: "7 Pax",
        features: "3 Bedrooms, 3 Bathrooms, Jacuzzi",
        image_path: "https://picsum.photos/400/300?random=11",
        description_long: "Perfect for large families, the Royal Suite includes a private jacuzzi overlooking the mountains.",
        amenities: ["Jacuzzi", "TV", "WiFi", "Full Kitchen"],
        more_images: ["https://picsum.photos/400/300?random=103"]
      },
    ],
    nearby_places: [
      {
        id: 201,
        resort_id: 1,
        name: "Seoraksan National Park",
        category: PlaceCategory.TOUR,
        distance_text: "Car 10 min",
        description: "Famous for beautiful autumn foliage and hiking trails.",
        latitude: 38.1190,
        longitude: 128.4650,
        image_url: "https://picsum.photos/400/300?random=201",
        detail_content: "Seoraksan is the third-highest mountain in South Korea. The park is known for its views, clear streams, and vibrant flora."
      },
      {
        id: 202,
        resort_id: 1,
        name: "Sokcho Central Market",
        category: PlaceCategory.FOOD,
        distance_text: "Car 20 min",
        description: "Try the Dakgangjeong (Sweet crispy chicken).",
        latitude: 38.2045,
        longitude: 128.5910,
        image_url: "https://picsum.photos/400/300?random=202",
        detail_content: "A bustling traditional market offering a variety of local street foods, fresh seafood, and dried fish."
      },
    ],
  },
  {
    id: 2,
    name: "Hanwha Resort Haeundae",
    brand: Brand.HANWHA,
    region_depth1: Region.Gyeongsang,
    region_depth2: "Busan",
    latitude: 35.1543,
    longitude: 129.1417,
    address: "32, Marine city 3-ro, Haeundae-gu, Busan",
    check_in_out: "15:00 / 11:00",
    contact: "051-749-5500",
    thumbnail_url: "https://picsum.photos/800/600?random=2",
    facilities: ["Sky Lounge", "Sauna", "Convention"],
    application_type: ApplicationType.FIRST_COME,
    reviews: [
        { id: 3, author: "Staff Lee", rating: 5, comment: "Best location in Busan. Walking distance to everything.", date: "2024-08-01" }
    ],
    rooms: [
      {
        id: 103,
        resort_id: 2,
        name: "Family Ocean",
        capacity: "4 Pax",
        features: "1 Bedroom, 1 Living room, Ocean View",
        image_path: "https://picsum.photos/400/300?random=12",
        description_long: "Enjoy the stunning view of Gwangan Bridge from your living room.",
        amenities: ["Ocean View", "TV", "Mini Bar"]
      },
    ],
    nearby_places: [
      {
        id: 203,
        resort_id: 2,
        name: "Haeundae Beach",
        category: PlaceCategory.TOUR,
        distance_text: "Walk 5 min",
        description: "Korea's most famous beach.",
        latitude: 35.1587,
        longitude: 129.1604,
        image_url: "https://picsum.photos/400/300?random=203",
        detail_content: "Haeundae Beach is an urban beach in Busan, South Korea. It is often dubbed one of the country's most famous and popular beaches."
      },
    ],
  },
  {
    id: 3,
    name: "Kensington Resort Jeju",
    brand: Brand.KENSINGTON,
    region_depth1: Region.Jeju,
    region_depth2: "Seogwipo",
    latitude: 33.2496,
    longitude: 126.5645,
    address: "128, Ieodo-ro, Seogwipo-si, Jeju-do",
    check_in_out: "15:00 / 11:00",
    contact: "064-739-9001",
    thumbnail_url: "https://picsum.photos/800/600?random=3",
    facilities: ["Outdoor Pool", "BBQ Garden", "Kids Club"],
    application_type: ApplicationType.APPROVE,
    reviews: [],
    rooms: [
      {
        id: 104,
        resort_id: 3,
        name: "Premier Twin",
        capacity: "3 Pax",
        features: "Ocean view terrace, recently renovated",
        image_path: "https://picsum.photos/400/300?random=13",
        description_long: "Recently renovated rooms featuring modern interiors and a private terrace.",
        amenities: ["Terrace", "Bathtub", "Coffee Machine"]
      },
    ],
    nearby_places: [
      {
        id: 204,
        resort_id: 3,
        name: "Olle Market",
        category: PlaceCategory.FOOD,
        distance_text: "Car 15 min",
        description: "Traditional market with fresh seafood.",
        latitude: 33.2490,
        longitude: 126.5690,
        image_url: "https://picsum.photos/400/300?random=204",
        detail_content: "Seogwipo Olle Market is the largest market in Seogwipo. It is a traditional market that was formed in the early 1960s."
      },
    ],
  },
];

export const fetchResorts = async (): Promise<Resort[]> => {
  // Simulate network delay
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_RESORTS), 300);
  });
};