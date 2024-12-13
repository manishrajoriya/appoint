"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "./prisma";
import { twilioClient } from "./twilio";
import { z } from 'zod'



export async function getOrCreateUser(formData: FormData) {
  const waId = formData.get('WaId')?.toString() || '';
  const profileName = formData.get('ProfileName')?.toString() || '';
  const from = formData.get('From')?.toString() || '';
  const phone = from.replace('whatsapp:', '');

  let user = await prisma.user.findUnique({
    where: { whatsappId: waId }
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        whatsappId: waId,
        name: profileName,
        phone: phone,
      }
    });
  }

  return user;
}


type AdminFormState = {
  error: {
    mobileNo?: string[]
    uniqueName?: string[]
  }
  success?: boolean
  message?: string
}

export async function createAdmin(prevState: AdminFormState, formData: FormData): Promise<AdminFormState> {
  try {

    const uniqueName = formData.get('uniqueName') as string
    // console.log(formData);
    
    // Get all mobile numbers from form data
    const mobileNumbers: string[] = []
    formData.forEach((value, key) => {
      if (key.startsWith('mobileNo[')) {
        mobileNumbers.push(value as string)
      }
    })

    // Validate inputs
    if (!uniqueName || mobileNumbers.length === 0) {
      return {
        error: {
          mobileNo: mobileNumbers.length === 0 ? ['At least one mobile number is required'] : undefined,
          uniqueName: !uniqueName ? ['Unique name is required'] : undefined
        }
      }
    }
    const {userId} = await auth()
// console.log(userId);

    if (!userId) {
      return {
        error: {},
        success: false,
        message: "Unauthorized - Please sign in"
      }
    }
    
 
    // Create admin in database
    const admin = await prisma.admin.update({
     where: {
        id: userId
      },
      data: {
        mobileNo: mobileNumbers,
        uniqueName: uniqueName || null,
        
      }
    })
    return {
      error: {},
      success: true,
      message: "Admin created successfully"
    }

  } catch (error) {
    console.error('Failed to create admin:', error)
    return {
      error: {
        uniqueName: ['Failed to create admin account']
      }
    }
  }
}


export async function notifyAdmin(appointment: any) {


  // Find connected admin for the appointment
  const admin = await prisma.admin.findFirst({
    where: {
      id: appointment.adminId
    }
  });


  if (!admin || !admin.mobileNo || admin.mobileNo.length === 0) {
    console.error('Admin not found for appointment');
    return;
  }

  // Use admin's mobile numbers for notifications
  for (const mobileNo of admin.mobileNo) {
    const phoneNumber = mobileNo.startsWith('91') ? mobileNo : `91${mobileNo}`;
    await twilioClient.messages.create({
      body: appointment.status === 'CONFIRMED' ? `New appointment ${appointment.status}!\n
      Time: ${appointment.time}
      Customer: ${appointment.user.name || 'Unknown'} 
      Phone: ${appointment.user.phone}
      Date: ${appointment.date.toLocaleDateString()}` : ` Appointment ${appointment.status}!\n
      Time: ${appointment.time}
      Customer: ${appointment.user.name || 'Unknown'} 
      Phone: ${appointment.user.phone}
      Date: ${appointment.date.toLocaleDateString()}`,
      from: process.env.TWILIO_WHATSAPP_NUMBER,
      to: `whatsapp:+${phoneNumber}`
    });
  }


  return;

  
}


export async function checkAppointment(appointmentId: string) {
  try {
    const appointment = await prisma.appointment.findUnique({
      where: {
        id: appointmentId
      },
      include: {
        user: true,
        admin: {
          select: {
            id: true,
            name: true,
            email: true,
            mobileNo: true,
            uniqueName: true
          }
        }
      }
    });

    if (!appointment) {
      return {
        error: 'Appointment not found',
        status: null
      };
    }

    return {
      error: null,
      status: appointment.status,
      appointment,
      admin: appointment.admin?.id
    };

  } catch (error) {
    console.error('Failed to check appointment:', error);
    return {
      error: 'Failed to check appointment status',
      status: null 
    };
  }
}


export async function updateAppointmentStatus(appointmentId: string, status: string) {
  try {
    const updatedAppointment = await prisma.appointment.update({
      where: {
        id: appointmentId
      },
      data: {
        status
      },
      include: {
        user: true,
        admin: {
          select: {
            id: true,
            name: true,
            email: true,
            mobileNo: true,
            uniqueName: true
          }
        }
      }
    });

    if (!updatedAppointment) {
      return {
        error: 'Failed to update appointment',
        appointment: null
      };
    }

    return {
      error: null,
      appointment: updatedAppointment
    };

  } catch (error) {
    console.error('Failed to update appointment status:', error);
    return {
      error: 'Failed to update appointment status',
      appointment: null
    };
  }}

export async function getAppointmentStatusAndNotify(appointmentId: string) {
  try {
    const appointment = await prisma.appointment.findUnique({
      where: {
        id: appointmentId
      },
      include: {
        user: true
      }
    });

    if (!appointment) {
      return {
        error: 'Appointment not found',
        status: null
      };
    }

    // Format appointment details
    const appointmentDate = appointment.date.toLocaleDateString();
    const appointmentTime = appointment.time;
    const userName = appointment.user?.name || 'Guest';

    // Construct message based on status
    let messageText = `Hello ${userName}!\n\n`;
    
    if (appointment.status === 'CONFIRMED') {
      messageText += `Your appointment has been confirmed for ${appointmentTime} on ${appointmentDate}. We look forward to seeing you!`;
    } else if (appointment.status === 'CANCELLED') {
      messageText += `Your appointment scheduled for ${appointmentTime} on ${appointmentDate} has been cancelled.`;
    } else {
      messageText += `Your appointment for ${appointmentTime} on ${appointmentDate} is currently pending confirmation.`;
    }

    // Send WhatsApp message via Twilio
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const client = require('twilio')(accountSid, authToken);

    await client.messages.create({
      body: messageText,
      from: `whatsapp:${process.env.TWILIO_PHONE_NUMBER}`,
      to: `whatsapp:${appointment.user?.phone}`
    });

    return {
      error: null,
      status: appointment.status,
      message: 'Status notification sent successfully'
    };

  } catch (error) {
    console.error('Failed to get status and notify:', error);
    return {
      error: 'Failed to get status and send notification',
      status: null
    };
  }
}

export async function connectToAdmin(data: FormData) {

  try {
    // Extract WhatsApp user data
    const waId = data.get('WaId')?.toString();
    const profileName = data.get('ProfileName')?.toString();
    const from = data.get('From')?.toString() || '';
    const phone = from.replace('whatsapp:', '');
    const message = data.get('Body')?.toString().trim() || '';

    // Find user by WhatsApp ID
    const user = await prisma.user.findUnique({
      where: {
        whatsappId: waId
      },
      include: {
        appointments: {
          where: {
            date: {
              gte: new Date()
            }
          },
          orderBy: {
            date: 'asc'
          },
          take: 1
        }
      }
    });

    if (!user) {
      // Create new user if not found
      await prisma.user.create({
        data: {
          whatsappId: waId!,
          name: profileName,
          phone:  phone
        }
      });
      return {
        success: false,
        message: "Please send your unique name to connect with your admin"
      };
    }

    if (!user.appointments || user.appointments.length === 0) {
      // Try to find admin by unique name
      const admin = await prisma.admin.findFirst({
        where: {
          uniqueName: message
        }
      });

      if (!admin) {
        return {
          success: false,
          message: "No admin found with this unique name. Please check and try again."
        };
      }

      // Connect user to admin
      await prisma.user.update({
        where: {
          id: user.id
        },
        data: {
          admin: {
            connect: {
              id: admin.id
            }
          }
        }
      });

      return {
        success: true,
        message: `Now you can book an appointment with ${admin.name}.\nSend:\n Type 'hi' To book an appointment.`,
      };
    }

    // User exists and is connected to admin
    if (user.appointments && user.appointments.length > 0) {
      const appointment = user.appointments[0];
      return {
        success: true,
        message: `Your next appointment is scheduled for ${appointment.time} on ${appointment.date.toLocaleDateString()}.\nSend:\n1️⃣ To cancel this appointment\n2️⃣ To book a new appointment`
      };
    }

    return {
      success: true,
      message: "Send 'hi' to book an appointment"
    };

  } catch (error) {
    console.error('Failed to process message:', error);
    return {
      success: false,
      error: 'An error occurred while processing your request. Please try again later'
    };
  }
}

export async function upcomingAppointments() {
  try {
    const {userId} = await auth()

    if (!userId) {
      return {
        error: {},
         success: false,
         message: "Unauthorized - Please sign in"
      }
    }

    
    const appointments = await prisma.appointment.findMany({
      where: {
        adminId: userId,
        date: {
          gte: new Date()
        }
      },
     include: {
      user: {
        select: {
          phone: true,
          name: true
        }
      }
    },
      orderBy: {
        date: 'asc'
      }
  })
 
    return {
      success: true,
      message: "Upcoming appointments fetched successfully",
      data: appointments
    }
  } catch (error) {
    return {
      success: false,
      error: error,
      message: "Failed to fetch upcoming appointments"
    }
  }
}


export async function saveAvailability( availability: { dayOfWeek: number; startTime: string; endTime: string }[]) {
  try {
    const {userId} = await auth()
console.log(userId);

    if (!userId) {
      throw new Error("Unauthorized - Please sign in");
    }

    const admin = await prisma.admin.findUnique({ where: { id: userId } });
    if (!admin) {
      throw new Error("Admin not found");
    }
    const promises = availability.map((slot) =>
      prisma.adminAvailability.upsert({
        where: {
          adminId_dayOfWeek: { adminId: userId, dayOfWeek: slot.dayOfWeek }, // Compound unique field
        },
        update: {
          startTime: slot.startTime,
          endTime: slot.endTime,
        },
        create: {
          adminId: userId,
          dayOfWeek: slot.dayOfWeek,
          startTime: slot.startTime,
          endTime: slot.endTime,
        },
      })
    );
    await Promise.all(promises);
    return { success: true };
  } catch (error) {
    console.error("Error saving availability:", error);
    const { message } = error as Error;
    throw new Error(message);
  }
}


export async function fetchAvailability() {
  try {
    const { userId } = await auth();


    if (!userId) {
      throw new Error("Unauthorized - Please sign in");
    }
    return await prisma.adminAvailability.findMany({
      where: { adminId: userId },
      orderBy: { dayOfWeek: "asc" },
    });
  } catch (error) {
    console.error("Error fetching availability:", error);
    throw new Error("Failed to fetch availability");
  }
}