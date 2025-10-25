// app/actions.js
"use server";

import z from "zod";
import { ta } from "zod/v4/locales";

// /**
//  * Handles form submission and extracts array data.
//  * @param {object} prevState - The previous state returned by the action.
//  * @param {FormData} formData - The submitted form data.
//  */

const arrayInputSchema = z.object({
  tags: z.array(z.string()).min(1, { message: "Please add at least one tag." }),
  userIds: z.array(z.string().transform((val) => parseInt(val, 10))),
});

export async function processArrayData(prevState: any, formData: FormData) {
  console.log(formData, "formData");
  //   // 1. Use formData.getAll() to retrieve all values for a given name
  //   const tags = formData.getAll("tags");
  //   const userIds = formData.getAll("userIds[]"); // Use the full name including '[]'

  //   // Convert string array values to their intended types (e.g., numbers)
  //   const numericUserIds = userIds.map((id: any) => parseInt(id, 10));
  //   console.log("Received Tags:", tags); // e.g., ['react', 'nextjs', 'forms']
  //   console.log("Received User IDs:", numericUserIds); // e.g., [101, 102]

  const validatedData = arrayInputSchema.parse({
    tags: formData.getAll("tags[]"),
    userIds: formData.getAll("userIds[]"),
  });
  console.log("Received Tags:", validatedData.tags); // e.g., ['react', 'nextjs', 'forms']
  console.log("Received User IDs:", validatedData.userIds); // e.g., [101, 102]

  // 2. Perform server logic (e.g., validation, database write)
  //   if (tags.length === 0) {
  //     return { message: "Please add at least one tag." };
  //   }

  // 3. Return the new state
  return {
    message: `Success! Processed ${validatedData.tags.length} tags and ${validatedData.userIds.length} user IDs.`,
  };
}
