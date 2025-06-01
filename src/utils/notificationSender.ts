import { eventTypes } from "../types/eventType";

export async function sendPushNotification(
  expoPushToken: string,
  eventInfos: eventTypes
) {
  const message = {
    to: expoPushToken,
    sound: "default",
    title: `New Event: ${eventInfos.title}`,
    body: `📍 ${eventInfos.location} | 🗓️ ${eventInfos.date} | 🏷️ ${eventInfos.status}`,
    data: {
      description: eventInfos.description,
      category_id: eventInfos.category_id,
      creator_id: eventInfos.creator_id,
      latitude: eventInfos.latitude,
      longitude: eventInfos.longitude,
      slots: eventInfos.slots,
      image_url: eventInfos.image_url || null,
    },
  };

  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });
}
