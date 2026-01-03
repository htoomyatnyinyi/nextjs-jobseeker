"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateUserRole(userId: string, role: string) {
  await prisma.user.update({
    where: { id: userId },
    data: { role: role as any },
  });
  revalidatePath("/dashboard/admin");
}

export async function updateEmployerStatus(
  id: string,
  status: "ACTIVE" | "REJECTED"
) {
  await prisma.employerProfile.update({
    where: { id },
    data: { stats: status as any }, // as any is used to bypass the type error
  });
  revalidatePath("/dashboard/admin");
}
