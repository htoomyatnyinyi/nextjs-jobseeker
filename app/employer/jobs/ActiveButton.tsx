"use client";

import { useActionState } from "react";
import { jobPostActive } from "./actions";

const ActiveButton = ({
  jobId,
  isActive,
}: {
  jobId: string;
  isActive: boolean;
}) => {
  const [state, postActiveAction, pending] = useActionState(jobPostActive, {
    success: false,
    message: "",
  });
  return (
    <div>
      <form action={postActiveAction}>
        <input type="hidden" name="jobId" value={jobId} />
        <button
          type="submit"
          disabled={pending}
          className={`p-2 rounded-md text-xs font-bold ${
            isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {pending ? "Processing..." : isActive ? "Published" : "Not-Published"}
        </button>
      </form>
    </div>
  );
};

export default ActiveButton;
