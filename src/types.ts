/**
 * Shared types for L'Éclat fine dining application
 */

export interface MenuItem {
  id: string;
  category: 'starters' | 'mains' | 'desserts';
  name: string;
  frenchName?: string;
  price: number;
  description: string;
  tags?: string[]; // e.g. ["Vegetarian", "Gluten Free", "Signature"]
  imageUrl?: string;
}

export interface Reservation {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  guests: number;
  time: string;
  specialRequests?: string;
  dietaryNotes?: string[];
  tableType?: 'standard' | 'window' | 'chef-table' | 'private-alcove';
  status: 'confirmed' | 'pending' | 'cancelled';
}

export interface GalleryItem {
  id: string;
  category: 'plated' | 'interior' | 'crafted' | 'kitchen' | 'maritime';
  title: string;
  imageUrl: string;
  description: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  source: string;
}
