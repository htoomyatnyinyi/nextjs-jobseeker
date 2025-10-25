// This is your Client Component form using a standard <form> and Server Action
"use client";

import { useActionState } from "react";
// import { from "./actions"; // Your Server Action

import { processArrayData } from "./processArrayData";

const initialState = { message: "" };

function ArrayForm() {
  const [state, formAction, isPending] = useActionState(
    processArrayData,
    initialState
  );

  return (
    <form action={formAction}>
      <h2>Tags Input</h2>

      {/* Example 1: Standard input fields with the same name */}
      <input
        type="text"
        name="tags[]"
        placeholder="Tag 1"
        className="p-2 m-1 text-pink-400"
        defaultValue="react"
      />
      <input
        type="text"
        name="tags[]"
        placeholder="Tag 2"
        className="p-2 m-1 text-pink-400"
        defaultValue="nextjs"
      />
      <input
        type="text"
        name="tags[]"
        placeholder="Tag 3"
        className="p-2 m-1 text-pink-400"
        defaultValue="forms"
      />

      <h2>User IDs</h2>

      {/* Example 2: Array-like notation (though not strictly required for FormData) */}
      <input
        type="number"
        name="userIds[]"
        placeholder="User ID 1"
        className="p-2 m-1 text-green-400"
        defaultValue="101"
      />
      <input
        type="number"
        name="userIds[]"
        placeholder="User ID 2"
        className="p-2 m-1 text-green-400"
        defaultValue="102"
      />

      <p style={{ color: "red" }}>{state.message}</p>
      <button type="submit" disabled={isPending}>
        {isPending ? "Processing..." : "Submit Data"}
      </button>
    </form>
  );
}

export default ArrayForm;
