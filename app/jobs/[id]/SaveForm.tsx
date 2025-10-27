"use client";

import { useActionState } from "react";
import { savedJob } from "./actions";

const SaveForm = ({ jobPostId }: { jobPostId: string }) => {
  const [state, savedJobAction, pending] = useActionState(savedJob, null);
  console.log(state, "state at savedjob");
  return (
    <div className="bg-blue-500 p-2 m-1">
      <form action={savedJobAction}>
        <input type="text" name="jobPostId" defaultValue={jobPostId} />

        <button type="submit" disabled={pending}>
          SaveJob
        </button>
      </form>
    </div>
  );
};

export default SaveForm;
