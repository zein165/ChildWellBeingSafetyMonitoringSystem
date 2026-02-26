import AsyncStorage from "@react-native-async-storage/async-storage";
// PERBAIKAN: Path disesuaikan dengan domain.ts
import { TimelineEvent } from "../../types/domain"; 

const STORAGE_KEY = "@TIMELINE_EVENTS";

export const saveEvent = async (event: TimelineEvent) => {
  try {
    const existing = await AsyncStorage.getItem(STORAGE_KEY);
    const events: TimelineEvent[] = existing ? JSON.parse(existing) : [];

    // PERBAIKAN: unshift agar data terbaru ada di urutan paling atas array
    events.unshift(event);

    // Batasi 1000 history agar storage HP tidak cepat penuh
    const limitedEvents = events.slice(0, 1000);

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(limitedEvents));
  } catch (error) {
    console.error("Error saving event:", error);
  }
};

export const getEvents = async (): Promise<TimelineEvent[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error getting events:", error);
    return [];
  }
};

export const getEventsByDate = async (date: Date): Promise<TimelineEvent[]> => {
  const events = await getEvents();

  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const startMs = start.getTime();

  const end = new Date(date);
  end.setHours(23, 59, 59, 999);
  const endMs = end.getTime();

  return events.filter((event) => {
    // PERBAIKAN: Di domain.ts namanya occurredAt (string), bukan timestamp
    const eventTimeMs = new Date(event.occurredAt).getTime();
    return eventTimeMs >= startMs && eventTimeMs <= endMs;
  });
};