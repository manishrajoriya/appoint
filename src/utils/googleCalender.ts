import { google } from 'googleapis';

const calendar = google.calendar({
  version: 'v3',
  auth: new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  )
});

export async function getAvailableSlots(date: string) {
  const auth = await google.auth.getClient({
    credentials: {
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
    },
    scopes: ['https://www.googleapis.com/auth/calendar'],
  });

  google.options({ auth });

  const startTime = new Date(date);
  startTime.setHours(9, 0, 0, 0); // Start at 9 AM
  const endTime = new Date(date);
  endTime.setHours(17, 0, 0, 0); // End at 5 PM

  const response = await calendar.freebusy.query({
    requestBody: {
      timeMin: startTime.toISOString(),
      timeMax: endTime.toISOString(),
      items: [{ id: 'primary' }],
    },
  });

  const busySlots = response.data.calendars?.primary?.busy || [];
  const availableSlots = [];

  let currentSlot = new Date(startTime);
  while (currentSlot < endTime) {
    const slotEnd = new Date(currentSlot.getTime() + 30 * 60000); // 30-minute slots
    const isBusy = busySlots.some(
      (busySlot) =>
        new Date(busySlot.start as string) < slotEnd &&
        new Date(busySlot.end as string) > currentSlot
    );

    if (!isBusy) {
      availableSlots.push(currentSlot.toISOString());
    }

    currentSlot = slotEnd;
  }

  return availableSlots;
}

export async function bookAppointment(startTime: string, endTime: string, summary: string) {
  const auth = await google.auth.getClient({
    credentials: {
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
    },
    scopes: ['https://www.googleapis.com/auth/calendar'],
  });

  google.options({ auth });

  const event = {
    summary,
    start: { dateTime: startTime },
    end: { dateTime: endTime },
  };

  const response = await calendar.events.insert({
    calendarId: 'primary',
    requestBody: event,
  });

  return response.data;
}

