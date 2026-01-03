"use client";

import { useActionState } from "react";
// import { toggleSaveJob } from "./actions";
import { toggleSaveJob } from "../_actions/actions";

type Props = {
  jobPostId: string;
  initialSaved: boolean;
};

export function SaveButton({ jobPostId, initialSaved }: Props) {
  const [state, formAction, pending] = useActionState(toggleSaveJob, {
    success: true,
    saved: initialSaved,
    message: "",
  });

  const isSaved = state?.saved ?? initialSaved;

  return (
    <form action={formAction} className="inline">
      <input type="hidden" name="jobPostId" value={jobPostId} />
      <input
        type="hidden"
        name="isSaved"
        value={initialSaved ? "true" : "false"}
      />

      <button
        type="submit"
        disabled={pending}
        className={`px-6 py-2 rounded border transition-colors ${
          isSaved
            ? "bg-amber-200 border-amber-400 hover:bg-amber-300"
            : "bg-gray-200 border-gray-300 hover:bg-gray-300"
        }`}
      >
        {pending ? "..." : isSaved ? "Unsave" : "Save Job"}
      </button>

      {state?.message && !state.success && (
        <p className="text-red-600 text-sm mt-1">{state.message}</p>
      )}
    </form>
  );
}
