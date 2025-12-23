"use server";

import { verifySession } from "@/lib/session";

export const updateStatus = async () => {
  const session = await verifySession();
  if (!session?.userId) {
    return {
      success: false,
      message: "Authentication failed. Please log in again.",
    };
  }
};
