"use server";

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
        phone: "+91" + phone,
      }
    });
  }

  return user;
}



const ADMIN_PHONE = process.env.ADMIN_WHATSAPP_NUMBER;

export async function notifyAdmin(appointment: any) {


  if (!ADMIN_PHONE) {
    console.error('Admin phone number not configured');
    return;
  }
  // Find connected admin for the appointment
  const admin = await prisma.admin.findFirst({
    where: {
      id: appointment.adminId
    }
  });

  if (!admin) {
    console.error('Admin not found for appointment');
    return;
  }

  // Use admin's mobile numbers for notifications
  for (const mobileNo of admin.mobileNo) {
    await twilioClient.messages.create({
      body: `New appointment ${appointment.status}!\n
      Time: ${appointment.time}
      Customer: ${appointment.user.name || 'Unknown'} 
      Phone: ${appointment.user.phone}
      Date: ${appointment.date.toLocaleDateString()}`,
      from: process.env.TWILIO_WHATSAPP_NUMBER,
      to: `whatsapp:+91${mobileNo}`
    });
  }

  return;

  await twilioClient.messages.create({
      body: `appointment ${appointment.status}!\n
      Time: ${appointment.time}
      Customer: ${appointment.user.name || 'Unknown'}
      Phone: ${appointment.user.phone}
      Date: ${appointment.date.toLocaleDateString()}`,
      from: process.env.TWILIO_WHATSAPP_NUMBER,
      to: "whatsapp:+918764296129"
  });
}






const AdminSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  mobileNo: z.array(z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number")).min(1, "At least one mobile number is required"),
  email: z.string().email("Invalid email address"),
  whatsapp_id: z.string().optional(),
  uniqueName: z.string().min(3, "Unique name must be at least 3 characters").optional(),
})

type AdminFormState = {
  error: {
    name?: string[]
    mobileNo?: string[]
    email?: string[]
    whatsapp_id?: string[]
    uniqueName?: string[]
  }
  success?: boolean
}

export async function createAdmin(prevState: AdminFormState, formData: FormData): Promise<AdminFormState> {
  try {
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const whatsapp_id = formData.get('whatsapp_id') as string
    const uniqueName = formData.get('uniqueName') as string
    
    // Get all mobile numbers from form data
    const mobileNumbers: string[] = []
    formData.forEach((value, key) => {
      if (key.startsWith('mobileNo[')) {
        mobileNumbers.push(value as string)
      }
    })

    // Validate inputs
    if (!name || !email || mobileNumbers.length === 0) {
      return {
        error: {
          name: !name ? ['Name is required'] : undefined,
          email: !email ? ['Email is required'] : undefined,
          mobileNo: mobileNumbers.length === 0 ? ['At least one mobile number is required'] : undefined
        }
      }
    }

    // Create admin in database
    const admin = await prisma.admin.create({
      data: {
        name,
        email,
        mobileNo: mobileNumbers,
        whatsapp_id: whatsapp_id || null,
        uniqueName: uniqueName || null,
      }
    })

    return {
      error: {},
      success: true
    }

  } catch (error) {
    console.error('Failed to create admin:', error)
    return {
      error: {
        name: ['Failed to create admin account']
      }
    }
  }
}



export async function checkAppointment(appointmentId: string) {
  try {
    const appointment = await prisma.appointment.findUnique({
      where: {
        id: appointmentId
      },
      include: {
        user: true,
        Admin: {
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
      admin: appointment.Admin?.id
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
        Admin: {
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
    const userName = appointment.user.name || 'Guest';

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
      to: `whatsapp:${appointment.user.phone}`
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
          phone: "+91" + phone
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
        message: "Successfully connected to admin. You can now book appointments by sending 'hi'"
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
      error: error instanceof Error ? error.message : 'Failed to process message'
    };
  }
}

