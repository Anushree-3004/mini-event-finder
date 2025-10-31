export interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string; // ISO string
  maxParticipants: number;
  currentParticipants: number;
  lat?: number;
  lng?: number;
}
