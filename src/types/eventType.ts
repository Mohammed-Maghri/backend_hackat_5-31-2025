export interface eventTypes {
  title: string;
  description: string;
  location: string;
  date: string;
  image_url?: string;
  latitude?: number; // remove the optional to make it required
  longitude?: number;
  status?: "upcoming" | "completed" | "cancelled" | "pending";
  category_id?: number;
}
