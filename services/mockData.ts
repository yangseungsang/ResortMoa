
import { Resort, Brand, Region, PlaceCategory, ApplicationType } from '../types';
import { generateBookingRule } from '../core/utils/brandRules';

// Define a raw type that includes application_type for internal generation logic
interface RawResortData extends Omit<Resort, 'booking_rule'> {
    application_type: ApplicationType;
    booking_rule?: undefined; 
}

const RAW_RESORTS: RawResortData[] = [
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
    images: [
        "https://picsum.photos/600/400?random=10",
        "https://picsum.photos/600/400?random=11",
        "https://picsum.photos/600/400?random=12",
        "https://picsum.photos/600/400?random=13"
    ],
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
        more_images: ["https://picsum.photos/400/300?random=101", "https://picsum.photos/400/300?random=102", "https://picsum.photos/400/300?random=108"]
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
        more_images: ["https://picsum.photos/400/300?random=103", "https://picsum.photos/400/300?random=104"]
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
        images: ["https://picsum.photos/400/300?random=201", "https://picsum.photos/400/300?random=291", "https://picsum.photos/400/300?random=292"],
        detail_content: "Seoraksan is the third-highest mountain in South Korea. The park is known for its views, clear streams, and vibrant flora.",
        info_attributes: [
            { label: "Operating Hours", value: "04:00 - 20:00" },
            { label: "Entrance Fee", value: "Adults: 4,500 KRW" },
            { label: "Parking", value: "Paid Parking Available" }
        ]
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
        images: ["https://picsum.photos/400/300?random=202", "https://picsum.photos/400/300?random=222", "https://picsum.photos/400/300?random=223"],
        detail_content: "A bustling traditional market offering a variety of local street foods, fresh seafood, and dried fish.",
        info_attributes: [
            { label: "Best Menu", value: "Sweet & Sour Chicken" },
            { label: "Opening Hours", value: "08:00 - 24:00" },
            { label: "Parking", value: "Public Parking Lot" }
        ]
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
    images: [
        "https://picsum.photos/600/400?random=20",
        "https://picsum.photos/600/400?random=21",
        "https://picsum.photos/600/400?random=22"
    ],
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
        amenities: ["Ocean View", "TV", "Mini Bar"],
        more_images: ["https://picsum.photos/400/300?random=12", "https://picsum.photos/400/300?random=122"]
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
        images: ["https://picsum.photos/400/300?random=203", "https://picsum.photos/400/300?random=233", "https://picsum.photos/400/300?random=234"],
        detail_content: "Haeundae Beach is an urban beach in Busan, South Korea. It is often dubbed one of the country's most famous and popular beaches.",
        info_attributes: [
            { label: "Best Time", value: "Summer (July - August)" },
            { label: "Facilities", value: "Shower Booths, Parasols" }
        ]
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
    images: [
        "https://picsum.photos/600/400?random=30",
        "https://picsum.photos/600/400?random=31"
    ],
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
        amenities: ["Terrace", "Bathtub", "Coffee Machine"],
        more_images: ["https://picsum.photos/400/300?random=13", "https://picsum.photos/400/300?random=131"]
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
        images: ["https://picsum.photos/400/300?random=204", "https://picsum.photos/400/300?random=244"],
        detail_content: "Seogwipo Olle Market is the largest market in Seogwipo. It is a traditional market that was formed in the early 1960s."
      },
    ],
  },
  {
    id: 4,
    name: "Lotte Resort Sokcho",
    brand: Brand.Lotte,
    region_depth1: Region.Gangwon,
    region_depth2: "Sokcho",
    latitude: 38.1903,
    longitude: 128.6033,
    address: "286, Daepo-hang-gil, Sokcho-si, Gangwon-do",
    check_in_out: "15:00 / 11:00",
    contact: "033-630-5500",
    thumbnail_url: "https://picsum.photos/800/600?random=4",
    facilities: ["Water Park", "Infinity Pool", "Buffet", "Pub"],
    application_type: ApplicationType.LOTTERY,
    images: ["https://picsum.photos/600/400?random=41", "https://picsum.photos/600/400?random=42"],
    reviews: [{ id: 4, author: "Family Choi", rating: 5, comment: "The water park was amazing for kids!", date: "2024-07-20" }],
    rooms: [{ id: 105, resort_id: 4, name: "Luxury Ocean", capacity: "4 Pax", features: "Ocean view, Spacious", image_path: "https://picsum.photos/400/300?random=105", more_images: ["https://picsum.photos/400/300?random=1051"] }],
    nearby_places: [
        { id: 205, resort_id: 4, name: "Abai Village", category: PlaceCategory.TOUR, distance_text: "Car 10 min", description: "Historic village.", latitude: 38.2017, longitude: 128.5915, image_url: "https://picsum.photos/400/300?random=205", images: ["https://picsum.photos/400/300?random=205", "https://picsum.photos/400/300?random=255"] }
    ]
  },
  {
    id: 5,
    name: "Sol Beach Samcheok",
    brand: Brand.SONO,
    region_depth1: Region.Gangwon,
    region_depth2: "Samcheok",
    latitude: 37.4526,
    longitude: 129.1729,
    address: "453, Surobuin-gil, Samcheok-si, Gangwon-do",
    check_in_out: "15:00 / 11:00",
    contact: "1588-4888",
    thumbnail_url: "https://picsum.photos/800/600?random=5",
    facilities: ["Private Beach", "Aqua World", "Santorini Garden"],
    application_type: ApplicationType.LOTTERY,
    images: ["https://picsum.photos/600/400?random=51", "https://picsum.photos/600/400?random=52"],
    reviews: [{ id: 5, author: "Couple Park", rating: 4, comment: "Feels like Greece. Very romantic.", date: "2024-09-10" }],
    rooms: [{ id: 106, resort_id: 5, name: "Suite Clean", capacity: "5 Pax", features: "Clean style, Ocean View", image_path: "https://picsum.photos/400/300?random=106", more_images: ["https://picsum.photos/400/300?random=1061"] }],
    nearby_places: [
        { id: 206, resort_id: 5, name: "Chuam Candlestick Rock", category: PlaceCategory.TOUR, distance_text: "Walk 15 min", description: "Iconic sunrise spot.", latitude: 37.4782, longitude: 129.1587, image_url: "https://picsum.photos/400/300?random=206", images: ["https://picsum.photos/400/300?random=206", "https://picsum.photos/400/300?random=266"] }
    ]
  },
  {
    id: 6,
    name: "Hanwha Resort Seorak Sorano",
    brand: Brand.HANWHA,
    region_depth1: Region.Gangwon,
    region_depth2: "Sokcho",
    latitude: 38.2115,
    longitude: 128.5285,
    address: "111, Misiryeong-ro 2983beon-gil, Sokcho-si, Gangwon-do",
    check_in_out: "15:00 / 11:00",
    contact: "033-630-5500",
    thumbnail_url: "https://picsum.photos/800/600?random=6",
    facilities: ["Waterpia", "Lake Park", "Golf"],
    application_type: ApplicationType.FIRST_COME,
    images: ["https://picsum.photos/600/400?random=61", "https://picsum.photos/600/400?random=62"],
    reviews: [{ id: 6, author: "User 123", rating: 3, comment: "Facility is a bit old, but Waterpia is great.", date: "2024-05-05" }],
    rooms: [{ id: 107, resort_id: 6, name: "Royal", capacity: "7 Pax", features: "Classic European Style", image_path: "https://picsum.photos/400/300?random=107" }],
    nearby_places: [
        { id: 211, resort_id: 6, name: "Seorak Waterpia", category: PlaceCategory.TOUR, distance_text: "On-site", description: "Natural hot spring water park.", latitude: 38.2105, longitude: 128.5275, image_url: "https://picsum.photos/400/300?random=211" }
    ]
  },
  {
    id: 7,
    name: "Sono Calm Geoje",
    brand: Brand.SONO,
    region_depth1: Region.Gyeongsang,
    region_depth2: "Geoje",
    latitude: 34.8436,
    longitude: 128.7077,
    address: "2660, Geojedae-ro, Irun-myeon, Geoje-si, Gyeongsangnam-do",
    check_in_out: "15:00 / 11:00",
    contact: "1588-4888",
    thumbnail_url: "https://picsum.photos/800/600?random=7",
    facilities: ["Marina", "Ocean Bay", "Buffet"],
    application_type: ApplicationType.LOTTERY,
    images: ["https://picsum.photos/600/400?random=71", "https://picsum.photos/600/400?random=72"],
    reviews: [],
    rooms: [{ id: 108, resort_id: 7, name: "Family", capacity: "4 Pax", features: "Ocean View", image_path: "https://picsum.photos/400/300?random=108" }],
    nearby_places: [
        { id: 207, resort_id: 7, name: "Windy Hill", category: PlaceCategory.TOUR, distance_text: "Car 30 min", description: "Scenic windmill.", latitude: 34.7570, longitude: 128.6720, image_url: "https://picsum.photos/400/300?random=207", images: ["https://picsum.photos/400/300?random=207", "https://picsum.photos/400/300?random=277"] }
    ]
  },
  {
    id: 8,
    name: "Kumho Asiana Resort Jeju",
    brand: Brand.Kumho,
    region_depth1: Region.Jeju,
    region_depth2: "Seogwipo",
    latitude: 33.2758,
    longitude: 126.7099,
    address: "2390, Namwon-eup, Seogwipo-si, Jeju-do",
    check_in_out: "14:00 / 11:00",
    contact: "064-766-8000",
    thumbnail_url: "https://picsum.photos/800/600?random=8",
    facilities: ["Olle Trail", "Outdoor Pool", "Convenience Store"],
    application_type: ApplicationType.APPROVE,
    images: ["https://picsum.photos/600/400?random=81"],
    reviews: [{ id: 7, author: "Hiker", rating: 5, comment: "Direct access to Olle trail #5.", date: "2024-04-12" }],
    rooms: [{ id: 109, resort_id: 8, name: "Suite Deluxe", capacity: "4 Pax", features: "Sea View", image_path: "https://picsum.photos/400/300?random=109" }],
    nearby_places: [
         { id: 208, resort_id: 8, name: "Namwon Keuneong", category: PlaceCategory.TOUR, distance_text: "Walk 1 min", description: "Coastal walking path.", latitude: 33.2750, longitude: 126.7110, image_url: "https://picsum.photos/400/300?random=208", images: ["https://picsum.photos/400/300?random=208", "https://picsum.photos/400/300?random=288"] }
    ]
  },
  {
    id: 9,
    name: "Lotte Hotel Jeju",
    brand: Brand.Lotte,
    region_depth1: Region.Jeju,
    region_depth2: "Seogwipo",
    latitude: 33.2483,
    longitude: 126.4104,
    address: "35, Jungmungwangwang-ro 72beon-gil, Seogwipo-si, Jeju-do",
    check_in_out: "15:00 / 11:00",
    contact: "064-731-1000",
    thumbnail_url: "https://picsum.photos/800/600?random=9",
    facilities: ["Volcano Show", "Heated Pool", "Casino"],
    application_type: ApplicationType.LOTTERY,
    images: ["https://picsum.photos/600/400?random=91", "https://picsum.photos/600/400?random=92"],
    reviews: [],
    rooms: [{ id: 110, resort_id: 9, name: "Deluxe Garden", capacity: "2 Pax", features: "Garden View", image_path: "https://picsum.photos/400/300?random=110" }],
    nearby_places: [
        { id: 212, resort_id: 9, name: "Jungmun Beach", category: PlaceCategory.TOUR, distance_text: "Walk 10 min", description: "Surfing spot.", latitude: 33.2440, longitude: 126.4120, image_url: "https://picsum.photos/400/300?random=212" }
    ]
  },
  {
    id: 10,
    name: "Resom Forest",
    brand: Brand.HANWHA, // Using Hanwha as proxy for other brands if needed, or add new enum
    region_depth1: Region.Chungcheong,
    region_depth2: "Jecheon",
    latitude: 37.1147,
    longitude: 128.0264,
    address: "365, Geumbong-ro, Baegun-myeon, Jecheon-si, Chungcheongbuk-do",
    check_in_out: "15:00 / 11:00",
    contact: "043-649-6000",
    thumbnail_url: "https://picsum.photos/800/600?random=100",
    facilities: ["Have9 Spa", "Trekking Course", "Star Gazing"],
    application_type: ApplicationType.LOTTERY,
    images: ["https://picsum.photos/600/400?random=101"],
    reviews: [{ id: 8, author: "Wellness Seeker", rating: 5, comment: "Best spa experience in the forest.", date: "2024-11-01" }],
    rooms: [{ id: 111, resort_id: 10, name: "Villa", capacity: "5 Pax", features: "Private Villa", image_path: "https://picsum.photos/400/300?random=111" }],
    nearby_places: [
        { id: 213, resort_id: 10, name: "Bakdaljae", category: PlaceCategory.TOUR, distance_text: "Car 15 min", description: "Historic mountain pass.", latitude: 37.1250, longitude: 128.0100, image_url: "https://picsum.photos/400/300?random=213" }
    ]
  },
  {
    id: 11,
    name: "Sono Belle Cheonan",
    brand: Brand.SONO,
    region_depth1: Region.Chungcheong,
    region_depth2: "Cheonan",
    latitude: 36.7601,
    longitude: 127.2289,
    address: "200, Seongnam-myeon, Dongnam-gu, Cheonan-si, Chungcheongnam-do",
    check_in_out: "15:00 / 11:00",
    contact: "1588-4888",
    thumbnail_url: "https://picsum.photos/800/600?random=110",
    facilities: ["Water Park", "Arts Center"],
    application_type: ApplicationType.FIRST_COME,
    images: ["https://picsum.photos/600/400?random=112"],
    reviews: [],
    rooms: [{ id: 112, resort_id: 11, name: "Tower Suite", capacity: "4 Pax", features: "City View", image_path: "https://picsum.photos/400/300?random=112" }],
    nearby_places: [
        { id: 214, resort_id: 11, name: "Independence Hall", category: PlaceCategory.TOUR, distance_text: "Car 5 min", description: "Korean history museum.", latitude: 36.7830, longitude: 127.2230, image_url: "https://picsum.photos/400/300?random=214" }
    ]
  },
  {
    id: 12,
    name: "Sono Calm Yeosu",
    brand: Brand.SONO,
    region_depth1: Region.Jeolla,
    region_depth2: "Yeosu",
    latitude: 34.7438,
    longitude: 127.7656,
    address: "1, Odongdo-ro, Yeosu-si, Jeollanam-do",
    check_in_out: "15:00 / 11:00",
    contact: "1588-4888",
    thumbnail_url: "https://picsum.photos/800/600?random=120",
    facilities: ["Lounge", "Fitness", "Sauna"],
    application_type: ApplicationType.APPROVE,
    images: ["https://picsum.photos/600/400?random=121"],
    reviews: [{ id: 9, author: "Gourmet", rating: 4, comment: "Food in Yeosu is amazing.", date: "2024-10-10" }],
    rooms: [{ id: 113, resort_id: 12, name: "Superior", capacity: "2 Pax", features: "Ocean View", image_path: "https://picsum.photos/400/300?random=113" }],
    nearby_places: [
         { id: 209, resort_id: 12, name: "Odongdo Island", category: PlaceCategory.TOUR, distance_text: "Walk 10 min", description: "Camellia flowers.", latitude: 34.7450, longitude: 127.7680, image_url: "https://picsum.photos/400/300?random=209", images: ["https://picsum.photos/400/300?random=209", "https://picsum.photos/400/300?random=299"] }
    ]
  },
  {
    id: 13,
    name: "Konjiam Resort",
    brand: Brand.Lotte, // Proxy brand
    region_depth1: Region.Gyeonggi,
    region_depth2: "Gwangju",
    latitude: 37.3364,
    longitude: 127.2941,
    address: "278, Docheogwit-ro, Docheok-myeon, Gwangju-si, Gyeonggi-do",
    check_in_out: "15:00 / 11:00",
    contact: "1661-8787",
    thumbnail_url: "https://picsum.photos/800/600?random=130",
    facilities: ["Ski Slope", "Hwadam Forest", "Spa"],
    application_type: ApplicationType.LOTTERY,
    images: ["https://picsum.photos/600/400?random=131", "https://picsum.photos/600/400?random=132"],
    reviews: [{ id: 10, author: "Skier", rating: 5, comment: "Best ski resort near Seoul.", date: "2024-01-15" }],
    rooms: [{ id: 114, resort_id: 13, name: "Prime", capacity: "4 Pax", features: "Forest View", image_path: "https://picsum.photos/400/300?random=114" }],
    nearby_places: [
        { id: 210, resort_id: 13, name: "Hwadam Botanic Garden", category: PlaceCategory.TOUR, distance_text: "On-site", description: "Beautiful arboretum.", latitude: 37.3370, longitude: 127.2950, image_url: "https://picsum.photos/400/300?random=210", images: ["https://picsum.photos/400/300?random=210", "https://picsum.photos/400/300?random=211"] }
    ]
  },
  {
    id: 14,
    name: "Kensington Seorak Beach",
    brand: Brand.KENSINGTON,
    region_depth1: Region.Gangwon,
    region_depth2: "Goseong",
    latitude: 38.2520,
    longitude: 128.5580,
    address: "40, Bondong-gil, Toseong-myeon, Goseong-gun, Gangwon-do",
    check_in_out: "15:00 / 11:00",
    contact: "1670-7464",
    thumbnail_url: "https://picsum.photos/800/600?random=140",
    facilities: ["Beach", "Cocomong Park"],
    application_type: ApplicationType.FIRST_COME,
    images: ["https://picsum.photos/600/400?random=141"],
    reviews: [],
    rooms: [{ id: 115, resort_id: 14, name: "Beach View", capacity: "4 Pax", features: "Private Beach View", image_path: "https://picsum.photos/400/300?random=115" }],
    nearby_places: [
        { id: 215, resort_id: 14, name: "Bongpo Beach", category: PlaceCategory.TOUR, distance_text: "Walk 1 min", description: "Clear water beach.", latitude: 38.2540, longitude: 128.5600, image_url: "https://picsum.photos/400/300?random=215" }
    ]
  },
  {
    id: 15,
    name: "Ocean to You Resort",
    brand: Brand.Kumho, // Proxy
    region_depth1: Region.Gangwon,
    region_depth2: "Goseong",
    latitude: 38.3188,
    longitude: 128.5248,
    address: "Sampo Beach, Goseong",
    check_in_out: "15:00 / 11:00",
    contact: "033-631-3811",
    thumbnail_url: "https://picsum.photos/800/600?random=150",
    facilities: ["BBQ", "Bike Rental"],
    application_type: ApplicationType.FIRST_COME,
    images: ["https://picsum.photos/600/400?random=151"],
    reviews: [],
    rooms: [{ id: 116, resort_id: 15, name: "Standard", capacity: "4 Pax", features: "Near Beach", image_path: "https://picsum.photos/400/300?random=116" }],
    nearby_places: [
        { id: 216, resort_id: 15, name: "Sampo Beach", category: PlaceCategory.TOUR, distance_text: "Walk 2 min", description: "Quiet beach.", latitude: 38.3195, longitude: 128.5260, image_url: "https://picsum.photos/400/300?random=216" }
    ]
  },
  {
    id: 16,
    name: "Pine Ridge Resort",
    brand: Brand.SONO, // Proxy
    region_depth1: Region.Gangwon,
    region_depth2: "Goseong",
    latitude: 38.2320,
    longitude: 128.4870,
    address: "Toseong-myeon, Goseong",
    check_in_out: "15:00 / 11:00",
    contact: "033-630-6700",
    thumbnail_url: "https://picsum.photos/800/600?random=160",
    facilities: ["Golf", "Spa"],
    application_type: ApplicationType.LOTTERY,
    images: ["https://picsum.photos/600/400?random=161"],
    reviews: [],
    rooms: [{ id: 117, resort_id: 16, name: "Villa", capacity: "6 Pax", features: "Golf View", image_path: "https://picsum.photos/400/300?random=117" }],
    nearby_places: [
        { id: 217, resort_id: 16, name: "Pine Ridge Golf Club", category: PlaceCategory.TOUR, distance_text: "On-site", description: "Famous golf course.", latitude: 38.2330, longitude: 128.4880, image_url: "https://picsum.photos/400/300?random=217" }
    ]
  },
  {
    id: 17,
    name: "Phoenix Jeju",
    brand: Brand.HANWHA, // Proxy
    region_depth1: Region.Jeju,
    region_depth2: "Seogwipo",
    latitude: 33.4320,
    longitude: 126.9280,
    address: "Seopjikoji-ro, Seogwipo",
    check_in_out: "14:00 / 11:00",
    contact: "064-731-7000",
    thumbnail_url: "https://picsum.photos/800/600?random=170",
    facilities: ["Glass House", "Pool"],
    application_type: ApplicationType.LOTTERY,
    images: ["https://picsum.photos/600/400?random=171"],
    reviews: [],
    rooms: [{ id: 118, resort_id: 17, name: "Royal", capacity: "5 Pax", features: "Ocean View", image_path: "https://picsum.photos/400/300?random=118" }],
    nearby_places: [
        { id: 218, resort_id: 17, name: "Seopjikoji", category: PlaceCategory.TOUR, distance_text: "Walk 5 min", description: "Scenic coast.", latitude: 33.4280, longitude: 126.9300, image_url: "https://picsum.photos/400/300?random=218" }
    ]
  },
  {
    id: 18,
    name: "Shilla Stay Haeundae",
    brand: Brand.Lotte, // Proxy
    region_depth1: Region.Gyeongsang,
    region_depth2: "Busan",
    latitude: 35.1590,
    longitude: 129.1580,
    address: "Haeundae-ro, Busan",
    check_in_out: "15:00 / 12:00",
    contact: "051-912-9000",
    thumbnail_url: "https://picsum.photos/800/600?random=180",
    facilities: ["Rooftop Pool", "Bar"],
    application_type: ApplicationType.FIRST_COME,
    images: ["https://picsum.photos/600/400?random=181"],
    reviews: [],
    rooms: [{ id: 119, resort_id: 18, name: "Standard", capacity: "2 Pax", features: "City View", image_path: "https://picsum.photos/400/300?random=119" }],
    nearby_places: [
        { id: 219, resort_id: 18, name: "Busan Aquarium", category: PlaceCategory.TOUR, distance_text: "Walk 2 min", description: "Sea life.", latitude: 35.1595, longitude: 129.1590, image_url: "https://picsum.photos/400/300?random=219" }
    ]
  },
  {
    id: 19,
    name: "Paradise Hotel Busan",
    brand: Brand.Kumho, // Proxy
    region_depth1: Region.Gyeongsang,
    region_depth2: "Busan",
    latitude: 35.1585,
    longitude: 129.1620,
    address: "Haeundae, Busan",
    check_in_out: "15:00 / 11:00",
    contact: "051-742-2121",
    thumbnail_url: "https://picsum.photos/800/600?random=190",
    facilities: ["Casino", "Cimer Spa"],
    application_type: ApplicationType.LOTTERY,
    images: ["https://picsum.photos/600/400?random=191"],
    reviews: [],
    rooms: [{ id: 120, resort_id: 19, name: "Deluxe", capacity: "3 Pax", features: "Ocean Terrace", image_path: "https://picsum.photos/400/300?random=120" }],
    nearby_places: [
        { id: 220, resort_id: 19, name: "Dalmaji Hill", category: PlaceCategory.TOUR, distance_text: "Car 10 min", description: "Moon watching spot.", latitude: 35.1550, longitude: 129.1750, image_url: "https://picsum.photos/400/300?random=220" }
    ]
  },
  {
    id: 20,
    name: "Ananti Hilton Busan",
    brand: Brand.HANWHA, // Proxy
    region_depth1: Region.Gyeongsang,
    region_depth2: "Busan",
    latitude: 35.1970,
    longitude: 129.2270,
    address: "Gijang-eup, Busan",
    check_in_out: "15:00 / 11:00",
    contact: "051-509-1111",
    thumbnail_url: "https://picsum.photos/800/600?random=200",
    facilities: ["Infinity Pool", "Bookstore"],
    application_type: ApplicationType.LOTTERY,
    images: ["https://picsum.photos/600/400?random=201"],
    reviews: [],
    rooms: [{ id: 121, resort_id: 20, name: "Premium", capacity: "4 Pax", features: "Ocean View", image_path: "https://picsum.photos/400/300?random=121" }],
    nearby_places: [
        { id: 221, resort_id: 20, name: "Haedong Yonggungsa", category: PlaceCategory.TOUR, distance_text: "Car 5 min", description: "Temple by the sea.", latitude: 35.1900, longitude: 129.2230, image_url: "https://picsum.photos/400/300?random=221" }
    ]
  },
  {
    id: 21,
    name: "Muju Deogyusan Resort",
    brand: Brand.Kumho, // Proxy
    region_depth1: Region.Jeolla,
    region_depth2: "Muju",
    latitude: 35.9920,
    longitude: 127.7650,
    address: "Seolcheon-myeon, Muju",
    check_in_out: "15:00 / 11:00",
    contact: "063-322-9000",
    thumbnail_url: "https://picsum.photos/800/600?random=210",
    facilities: ["Ski", "Golf"],
    application_type: ApplicationType.FIRST_COME,
    images: ["https://picsum.photos/600/400?random=211"],
    reviews: [],
    rooms: [{ id: 122, resort_id: 21, name: "Gold", capacity: "5 Pax", features: "Mountain View", image_path: "https://picsum.photos/400/300?random=122" }],
    nearby_places: [
        { id: 222, resort_id: 21, name: "Deogyusan National Park", category: PlaceCategory.TOUR, distance_text: "On-site", description: "Winter hiking.", latitude: 35.9800, longitude: 127.7600, image_url: "https://picsum.photos/400/300?random=222" }
    ]
  },
  {
    id: 22,
    name: "Jindo Sol Beach",
    brand: Brand.SONO,
    region_depth1: Region.Jeolla,
    region_depth2: "Jindo",
    latitude: 34.3980,
    longitude: 126.3150,
    address: "Uisin-myeon, Jindo",
    check_in_out: "15:00 / 11:00",
    contact: "1588-4888",
    thumbnail_url: "https://picsum.photos/800/600?random=220",
    facilities: ["Infinity Pool", "Night View"],
    application_type: ApplicationType.LOTTERY,
    images: ["https://picsum.photos/600/400?random=221"],
    reviews: [],
    rooms: [{ id: 123, resort_id: 22, name: "Suite", capacity: "5 Pax", features: "Ocean View", image_path: "https://picsum.photos/400/300?random=123" }],
    nearby_places: [
        { id: 223, resort_id: 22, name: "Miracle Sea Road", category: PlaceCategory.TOUR, distance_text: "Car 15 min", description: "Famous sea parting.", latitude: 34.4200, longitude: 126.3500, image_url: "https://picsum.photos/400/300?random=223" }
    ]
  },
  {
    id: 23,
    name: "Yeosu Venezia Hotel",
    brand: Brand.HANWHA, // Proxy
    region_depth1: Region.Jeolla,
    region_depth2: "Yeosu",
    latitude: 34.7430,
    longitude: 127.7710,
    address: "Sujeong-dong, Yeosu",
    check_in_out: "15:00 / 11:00",
    contact: "061-664-0001",
    thumbnail_url: "https://picsum.photos/800/600?random=230",
    facilities: ["Pool", "Cinema"],
    application_type: ApplicationType.FIRST_COME,
    images: ["https://picsum.photos/600/400?random=231"],
    reviews: [],
    rooms: [{ id: 124, resort_id: 23, name: "Standard", capacity: "2 Pax", features: "Harbor View", image_path: "https://picsum.photos/400/300?random=124" }],
    nearby_places: [
        { id: 224, resort_id: 23, name: "Yeosu Cable Car", category: PlaceCategory.TOUR, distance_text: "Walk 10 min", description: "Scenic ride.", latitude: 34.7460, longitude: 127.7730, image_url: "https://picsum.photos/400/300?random=224" }
    ]
  }
];

// Enrich the mock data to simulate the server response structure for 'booking_rule'
export const MOCK_RESORTS: Resort[] = RAW_RESORTS.map(resort => {
    // Extract application_type for generation, then return clean Resort object
    const { application_type, ...resortData } = resort;
    return {
        ...resortData,
        booking_rule: generateBookingRule(resort.brand, application_type)
    };
});
