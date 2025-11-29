# Resort Moa - API Interface Documentation (v1.1)

This document defines the RESTful API contract for the **Resort Moa** application.
It serves as a standard for communication between the React Frontend and the Python FastAPI Backend.

**Base URL:** `/api/v1`
**Content-Type:** `application/json`

---

## 1. Resources: Resorts

### 1.1. List Resorts
Retrieve a list of all resorts. Supports filtering via query parameters.

- **Endpoint:** `GET /resorts`
- **Query Parameters:**
  - `brand` (Optional): Filter by brand (e.g., `SONO`, `HANWHA`).
  - `region` (Optional): Filter by region (e.g., `Gangwon`, `Jeju`).
  - `keyword` (Optional): Search query for name or address.

- **Response (200 OK):**
  ```json
  [
    {
      "id": 1,
      "name": "Sono Felice Delpino",
      "brand": "SONO",
      "region_depth1": "Gangwon",
      "region_depth2": "Goseong",
      "latitude": 38.2039,
      "longitude": 128.5133,
      "address": "1153 Misiryeong-yetgil...",
      "check_in_out": "15:00 / 11:00",
      "contact": "1588-4888",
      "thumbnail_url": "/static/images/resort_1.jpg",
      "facilities": ["Infinity Pool", "Sauna"],
      "application_type": "LOTTERY"
    },
    ...
  ]
  ```

### 1.2. Get Resort Detail
Retrieve detailed information for a specific resort, including rooms, nearby places, and reviews.

- **Endpoint:** `GET /resorts/{id}`
- **Path Parameters:**
  - `id`: Unique ID of the resort (Integer).

- **Response (200 OK):**
  ```json
  {
    "id": 1,
    "name": "Sono Felice Delpino",
    "brand": "SONO",
    "region_depth1": "Gangwon",
    "region_depth2": "Goseong",
    "latitude": 38.2039,
    "longitude": 128.5133,
    "address": "1153 Misiryeong-yetgil...",
    "check_in_out": "15:00 / 11:00",
    "contact": "1588-4888",
    "thumbnail_url": "/static/images/resort_1.jpg",
    "images": [
       "/static/images/gallery_1.jpg",
       "/static/images/gallery_2.jpg"
    ],
    "facilities": ["Infinity Pool", "Sauna"],
    "application_type": "LOTTERY",
    "rooms": [
      {
        "id": 101,
        "name": "Gold Suite",
        "capacity": "5 Pax",
        "features": "2 Bedrooms, Mountain View",
        "image_path": "/static/images/room_101.jpg",
        "description_long": "Luxurious stay...",
        "amenities": ["TV", "WiFi"],
        "more_images": ["/static/images/room_101_1.jpg"]
      }
    ],
    "nearby_places": [
      {
        "id": 201,
        "name": "Seoraksan National Park",
        "category": "TOUR",
        "distance_text": "Car 10 min",
        "description": "Famous for hiking.",
        "latitude": 38.1190,
        "longitude": 128.4650,
        "image_url": "/static/images/place_201.jpg",
        "images": [
            "/static/images/place_201_1.jpg",
            "/static/images/place_201_2.jpg"
        ],
        "detail_content": "Full detail text...",
        "info_attributes": [
            { "label": "Operating Hours", "value": "09:00 - 18:00" },
            { "label": "Parking", "value": "Available" }
        ]
      }
    ],
    "reviews": [
      {
        "id": 1,
        "author": "Employee A",
        "rating": 5,
        "comment": "Great view!",
        "date": "2024-10-15"
      }
    ]
  }
  ```

- **Response (404 Not Found):**
  ```json
  {
    "detail": "Resort not found"
  }
  ```

---

## 2. Resources: Reviews

### 2.1. Create Review
Submit a new review for a resort.

- **Endpoint:** `POST /resorts/{id}/reviews`
- **Path Parameters:**
  - `id`: Resort ID.
- **Request Body:**
  ```json
  {
    "author": "John Doe",
    "rating": 5,
    "comment": "The facility was clean and staff was friendly."
  }
  ```

- **Response (201 Created):**
  ```json
  {
    "id": 123,
    "author": "John Doe",
    "rating": 5,
    "comment": "The facility was clean and staff was friendly.",
    "date": "2024-11-27"
  }
  ```

---

## 3. Data Enumerations (Enums)

### 3.1. Brand
- `SONO`
- `HANWHA`
- `KENSINGTON`
- `LOTTE`
- `KUMHO`

### 3.2. Region (region_depth1)
- `Gangwon`
- `Jeju`
- `Gyeongsang`
- `Jeolla`
- `Chungcheong`
- `Gyeonggi`

### 3.3. Place Category
- `TOUR` (Tourist Attraction)
- `FOOD` (Restaurant/Cafe)
- `STORE` (Convenience/Market)

### 3.4. Application Type
- `LOTTERY` (Random Draw)
- `FIRST_COME` (First come, first served)
- `APPROVE` (Manager Approval)

---

## 4. Static Files
Images are served directly from the backend's static directory.
- **Path:** `/static/images/{filename}`
- **Example:** `http://api-server.com/static/images/resort_thumbnail_01.jpg`