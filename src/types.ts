export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  category: string;
  image: string;
}

export interface Booking {
  id: string;
  serviceId: string;
  userId: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  userName: string;
  userEmail: string;
  userPhone: string;
}

export interface Analytics {
  totalBookings: number;
  activeUsers: number;
  totalServices: number;
  revenue: number;
}
