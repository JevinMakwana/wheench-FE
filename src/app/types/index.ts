
export interface User {
  id: string;
  email: string;
  phone: string;
  full_name: string;
  username: string;
  gender: 'male' | 'female' | 'other';
  created_at: string;
}
export interface Trip {
    _id: string;
    source: string;
    destination: string;
    car: string;
  
    takofftime: string;
    available_seats: number;
    price: number;
    host: {
      full_name: string;
      avatar_url?: string;
    };
  }

  export interface Booking {
    id: string;
    trip_id: string;
    guest_id: string;
    status: 'confirmed' | 'cancelled';
    trip_completed: boolean;
    created_at: string;
    guest?: User;
    trip?: Trip;
  }