import AsyncStorage from "@react-native-async-storage/async-storage";
import { TimelineEvent } from "./types";

const STORAGE_KEY = "TIMELINE_EVENTS";

export const saveEvent = async (event: TimelineEvent) => {
  try {
    const existing = await AsyncStorage.getItem(STORAGE_KEY);
    const events: TimelineEvent[] = existing ? JSON.parse(existing) : [];

    events.push(event);

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(events));
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

  const end = new Date(date);
  end.setHours(23, 59, 59, 999);

  return events.filter(
    (event) =>
      event.timestamp >= start.getTime() &&
      event.timestamp <= end.getTime()
  );
};