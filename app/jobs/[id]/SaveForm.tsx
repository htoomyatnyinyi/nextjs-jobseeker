"use client";

import { useActionState } from "react";
import { savedJob } from "./actions";

const SaveForm = ({ jobPostId }: { jobPostId: string }) => {
  const [state, savedJobAction, pending] = useActionState(savedJob, null);

  return (
    <div className="">
      <form action={savedJobAction}>
        <input type="text" name="jobPostId" defaultValue={jobPostId} hidden />

        <button
          type="submit"
          disabled={pending}
          className="border-blue-500 text-blue-500 border px-4 py-2 rounded-md hover:bg-blue-50 transition-colors"
        >
          {pending ? "Processing..." : "Save Job"}
        </button>
      </form>
      {/* {savedJobsList.map((s) => s.id)} */}
      {/* {savedJobsList.map((savedJobList) => (
        <div key={savedJobList.id}>
          {savedJobList.jobPostId === jobPostId ? "Saved Job" : "Not Saved"}
        </div>
      ))} */}
    </div>
  );
};

export default SaveForm;
