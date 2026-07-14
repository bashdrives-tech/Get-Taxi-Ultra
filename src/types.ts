export type TripType = 'local' | 'one_way' | 'round_trip' | 'hourly';

export interface VehicleOption {
  id: string;
  name: string;
  type: string;
  seats: number;
  description: string;
  multiplier: number;
  image: string;
}

export interface Destination {
  id: string;
  name: string;
  title: string;
  slogan: string;
  distanceKm: number; // approx distance from Coimbatore
  travelTime: string;
  description: string;
  highlights: string[];
  sightseeing: {
    name: string;
    description: string;
  }[];
  bestTimeToVisit: string;
  bgColor: string;
  bannerImage: string;
}

export interface Inquiry {
  id: string;
  customerName: string;
  customerPhone: string;
  tripType: TripType;
  pickupLocation: string;
  dropLocation: string;
  distanceKm: number;
  daysNeeded: number;
  vehicleType: string;
  travelDate: string;
  estimatedFare: number;
  specialRequests?: string;
  status: 'Pending' | 'Confirmed' | 'Cancelled';
  createdAt: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface BlogPost {
  id: string;
  title: string;
  date: string;
  category: string;
  summary: string;
  content: string[];
  image: string;
  readTime: string;
}
