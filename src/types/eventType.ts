export interface eventTypes {
  title: string;
  description: string;
  location: string;
  date: string;
  image_url?: string;
  latitude: number;
  longitude: number;
  status: "upcoming" | "completed" | "cancelled" | "pending";
  category_id: number;
  creator_id: number;
  slots: number;
}

export interface registerEventTypes {
  eventId: number;
}
export interface eventQueryVerify {
  slots: number | undefined;
  status: string | undefined;
  latitude: number | undefined;
  longitude: number | undefined;
}
