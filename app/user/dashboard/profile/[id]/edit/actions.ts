"use server";

import z from "zod";

const EditFormSchema = z.object({
  fullName: z.string().min(1, "fullName required"),
  firstName: z.string().min(1, "firstName required"),
  lastName: z.string().min(1, "lastName required"),
  pone: z.int().min(8, "Phone required"),
  gender: z.string().min(1, "Gender Required"),
});
export const editProfile = async (_: void, formData: FormData) => {};
