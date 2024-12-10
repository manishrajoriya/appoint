import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";
import { prisma } from "@/lib/prisma";
import { connectToAdmin, notifyAdmin } from "@/lib/action";

const { MessagingResponse } = twilio.twiml;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const body = formData.get("Body")?.toString().trim() || "";
    const waId = formData.get("WaId")?.toString() || "";

    const twiml = new MessagingResponse();
    let messageText = "";

    // Fetch user details, including admin and upcoming appointments
    const user = await prisma.user.findUnique({
      where: { whatsappId: waId },
      include: {
        admin: {
          include: {
            slots: {
              where: {
                isBooked: false, // Fetch only unbooked slots
               
              },
              orderBy: {
                startTime: "asc",
              },
            },
          },
        },
        appointments: {
          where: {
            OR: [
              {
                AND: [
                  { status: "CONFIRMED" },
                  {
                    date: {
                      gte: new Date(new Date().setHours(0, 0, 0, 0)), // Start of today
                    },
                  },
                ],
              },
              { status: "PENDING" },
            ],
          },
          orderBy: { date: "desc" },
          take: 1,
        },
      },
    });

    if (!user || !user.admin) {
      // Connect the user to an admin if not already connected
      const result = await connectToAdmin(formData);
      messageText = result.message || "";
    } else {
      const existingAppointment = user.appointments[0];

      if (["hi", "hello", "hey", "hii"].includes(body.toLowerCase())) {
        // Greet the user and show available slots if no confirmed appointment exists
        if (existingAppointment && existingAppointment.status === "CONFIRMED") {
          messageText = `Welcome back, ${user.name || ""}! You have an existing appointment for ${existingAppointment.time} on ${existingAppointment.date.toLocaleDateString()}.\n\nType CANCEL to cancel this appointment.`;
        } else if (user.admin.slots.length > 0) {
          // Show available slots
          messageText = `Hello ${user.name || ""}! Here are the available slots for your admin:\n\n`;
          user.admin.slots.forEach((slot, index) => {
            messageText += `${index + 1}️⃣ ${slot.startTime.toLocaleString()} \n`;
          });
          messageText += "\nReply with the slot number to book.";
        } else {
          messageText = `Hello ${user.name || ""}! No available slots at the moment. Please try again later.`;
        }
      } else if (body.toLowerCase() === "cancel") {
        // Handle appointment cancellation
        if (existingAppointment) {
          await prisma.appointment.update({
            where: { id: existingAppointment.id },
            data: { status: "CANCELLED" },
          });
          messageText = `❌ Appointment cancelled. Send "hi" to book a new appointment.`;

          // Notify the admin
          await notifyAdmin({
            ...existingAppointment,
            status: "CANCELLED",
            user,
          });
          await prisma.slot.update({
            where: { id: existingAppointment.slotId! },
            data: { isBooked: false },
          });
        } else {
          messageText = `⚠️ No active appointment found to cancel. Send "hi" to book an appointment.`;
        }
      } else if (!isNaN(parseInt(body))) {
        // Book an appointment based on slot number
        const slotIndex = parseInt(body) - 1;
        const selectedSlot = user.admin.slots[slotIndex];

        if (!selectedSlot) {
          messageText = `⚠️ Invalid slot selection. Please reply with a valid number.`;
        } else if (existingAppointment && existingAppointment.status === "CONFIRMED") {
          messageText = `⚠️ You already have a confirmed appointment. Please cancel it first by typing "CANCEL".`;
        } else {
          const appointment = await prisma.appointment.create({
            data: {
              time: selectedSlot.startTime.toLocaleTimeString(),
              date: selectedSlot.startTime,
              userId: user.id,
              adminId: user.admin.id,
              status: "CONFIRMED",
              slotId: selectedSlot.id
            },
          });

          await prisma.slot.update({
            where: { id: selectedSlot.id },
            data: { isBooked: true },
          });

          messageText = `✅ Appointment confirmed!\n\n📅 Date: ${selectedSlot.endTime.toLocaleDateString()}\n⏰ Time: ${selectedSlot.startTime.toLocaleTimeString()}\n\nReply with:\n❌ "CANCEL" to cancel this appointment\n❓ "hi" for more options.`;

          // Notify the admin
          await notifyAdmin({
            ...appointment,
            status: "CONFIRMED",
            user,
          });
        }
      } else {
        messageText = `Please send "Hi" to see available options.`;
      }
    }

    twiml.message(messageText);

    return new NextResponse(twiml.toString(), {
      status: 200,
      headers: { "Content-Type": "text/xml" },
    });
  } catch (error) {
    console.error("Error processing message:", error);
    const twiml = new MessagingResponse();
    twiml.message("❌ Sorry, something went wrong. Please try again later.");

    return new NextResponse(twiml.toString(), {
      status: 500,
      headers: { "Content-Type": "text/xml" },
    });
  }
}
