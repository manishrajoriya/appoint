// import { NextRequest, NextResponse } from "next/server";
// import twilio from 'twilio';
// import { prisma } from '@/lib/prisma';
// import { type MessageInstance } from 'twilio/lib/rest/api/v2010/account/message';
// import { connectToAdmin, notifyAdmin } from "@/lib/action";
// import { getAllSlots } from "@/lib/actions/user.action";
// const { MessagingResponse } = twilio.twiml;

// const availableSlots = [
//   '10:00 AM',
//   '12:00 PM',
//   '2:00 PM',
//   '4:00 PM',
// ] as const;

// export async function POST(req: NextRequest) {
//   try {
//     const formData = await req.formData();
//     const body = formData.get('Body')?.toString().trim() || '';
//     const waId = formData.get('WaId')?.toString() || '';
    
//     const twiml = new MessagingResponse();
//     let messageText = '';

//     // First, check if user exists and is connected to an admin
//     const user = await prisma.user.findUnique({
//       where: { whatsappId: waId },
//       include: {
//         admin: true,
//         appointments: {
//           where: {
//             OR: [
//               {
//                 AND: [
//                   { status: 'CONFIRMED' },
//                   {
//                     date: {
//                       gte: new Date(new Date().setHours(0, 0, 0, 0)) // Start of today
//                     }
//                   }
//                 ]
//               },
//               { status: 'PENDING' }
//             ]
//           },
//           orderBy: { date: 'desc' },
//           take: 1
//         }
//       }
//     });

//     console.log('User appointments:', user?.appointments); // Debug log

//     // If user doesn't exist or isn't connected to an admin
//     if (!user || user.adminId === null) {
//       const result = await connectToAdmin(formData);
//       messageText = result.message || '';
//     } 
//     // User exists and is connected to admin
//     else {
//       // Get the most recent confirmed appointment for today
//       const existingAppointment = user.appointments[0];
//       console.log('Existing appointment:', existingAppointment); // Debug log

//       if (body.toLowerCase() === 'hi' || body.toLowerCase() === 'hello' || body.toLowerCase() === 'hey' || body.toLowerCase() === 'hii') {
//         if (existingAppointment && existingAppointment.status === 'CONFIRMED') {
//           messageText = `Welcome back ${user.name || ''}! You have an existing appointment for ${existingAppointment.time} today.\n\n`;
//           messageText += 'Type CANCEL to Cancel this appointment';
//         } else {
//           // Send available slots with interactive options
//           // const res = await getAllSlots();
//           messageText = `Hello ${user.name || ''}! Choose a time for your appointment:\n\n`;
//           availableSlots.forEach((slot, index) => {
//             messageText += `${index + 1}️⃣ ${slot}\n`;
//           });
//         }
//       } else if (body.toLowerCase() === 'cancel') {
//         // Check if there's an appointment to cancel
//         if (existingAppointment) {
//           try {
//             // Cancel appointment
//             await prisma.appointment.update({
//               where: { id: existingAppointment.id },
//               data: { status: 'CANCELLED' }
//             });
//             messageText = '❌ Appointment cancelled.\n\nSend "hi" to book a new appointment.';
            
//             // Notify admin about cancellation
//             await notifyAdmin({
//               ...existingAppointment,
//               status: 'CANCELLED',
//               user: user
//             });
//           } catch (error) {
//             console.error('Error cancelling appointment:', error);
//             messageText = '⚠️ Failed to cancel appointment. Please try again.';
//           }
//         } else {
//           messageText = '⚠️ No active appointment found to cancel.\nSend "hi" to book an appointment.';
//         }
//       } else if (['1', '2', '3', '4'].includes(body)) {
//         if (existingAppointment && existingAppointment.status === 'CONFIRMED') {
//           messageText = 'You already have an appointment. Please cancel it first by typing "CANCEL".';
//         } else {
//           const selectedTime = availableSlots[parseInt(body) - 1];
          
//           // Create new appointment
//           const appointment = await prisma.appointment.create({
//             data: {
//               time: selectedTime,
//               date: new Date(),
//               userId: user.id,
//               adminId: user.admin?.id,
//               status: 'CONFIRMED'
//             },
//             include: {
//               user: true,
//               admin: true
//             }
//           });

//           messageText = `✅ Appointment confirmed!\n\n`;
//           messageText += `📅 Date: ${new Date().toLocaleDateString()}\n`;
//           messageText += `⏰ Time: ${selectedTime}\n\n`;
//           messageText += `Reply with:\n`;
//           messageText += `❌ Send "CANCEL" To cancel this appointment\n`;
//           messageText += `❓ Send "hi" for more options`;
          
//           // Notify admin
//           await notifyAdmin(appointment);
//         }
//       } else if (body === '2' && existingAppointment && existingAppointment.status === 'CONFIRMED') {
//         messageText = '⚠️ Please cancel your existing appointment first by typing "CANCEL".';
//       } else {
//         messageText = 'Please send "hi" to see available options.';
//       }
//     }

//     twiml.message(messageText);

//     return new NextResponse(twiml.toString(), {
//       status: 200,
//       headers: {
//         'Content-Type': 'text/xml',
//       },
//     });

//   } catch (error) {
//     console.error('Error processing message:', error);
//     const twiml = new MessagingResponse();
//     twiml.message('❌ Sorry, something went wrong. Please try again later.');

//     return new NextResponse(twiml.toString(), {
//       status: 500,
//       headers: {
//         'Content-Type': 'text/xml',
//       },
//     });
//   }
// }