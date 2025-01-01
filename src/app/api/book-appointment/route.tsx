import { NextRequest, NextResponse } from 'next/server';
import { bookAppointment } from '@/utils/googleCalender';

export async function POST(req: NextRequest) {
  const { startTime, endTime, summary } = await req.json();

  if (!startTime || !endTime || !summary) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    const appointment = await bookAppointment(startTime, endTime, summary);
    return NextResponse.json({ appointment });
  } catch (error) {
    console.error('Error booking appointment:', error);
    return NextResponse.json({ error: 'Failed to book appointment' }, { status: 500 });
  }
}

