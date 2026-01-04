"use client";

import { useActionState } from "react";
import { unsaveJob } from "./actions";

const UnsaveForm = ({ savedJobId }: { savedJobId: string }) => {
  const [state, unsaveJobAction, pending] = useActionState(unsaveJob, null);

  // console.log(jobPostId, "state", savedStatus);
  return (
    <form action={unsaveJobAction}>
      <input type="text" name="savedJobId" defaultValue={savedJobId} hidden />

      <button
        type="submit"
        disabled={pending}
        className="border-blue-500 text-blue-500 border px-4 py-2 rounded-md hover:bg-blue-50 transition-colors"
      >
        {pending ? "Processing..." : "Unsave Job"}
      </button>
    </form>
  );
};

export default UnsaveForm;
