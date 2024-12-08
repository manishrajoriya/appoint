"use server";

import { auth,  } from "@clerk/nextjs/server";
import { prisma } from "./prisma";
import { z } from "zod";



export async function updateAdmin({
  name,
  email,
  mobileNo,
  whatsapp_id,
  uniqueName
}: {
  name?: string;
  email?: string;
  mobileNo?: string[];
  whatsapp_id?: string;
  uniqueName?: string;
}) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return {
                success: false,
                message: "Unauthorized - Please sign in",
            }
        }

        const updatedAdmin = await prisma.admin.update({
            where: {
                id: userId
            },
            data: {
                name: name,
                email: email,
                mobileNo: mobileNo,
                whatsapp_id: whatsapp_id,
                uniqueName: uniqueName
            }
        });

        return {
            success: true,
            message: "Admin profile updated successfully",
            data: updatedAdmin
        }

    } catch (error) {
        console.error("Error updating admin:", error);
        return {
            success: false,
            message: "Failed to update admin profile",
            error: error instanceof Error ? error.message : "Unknown error occurred"
        }
    }
}


const AdminSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  mobileNo: z.array(z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number")).min(1, "At least one mobile number is required"),
  email: z.string().email("Invalid email address"),
  whatsapp_id: z.string().optional(),
  uniqueName: z.string().min(3, "Unique name must be at least 3 characters").optional(),
})






