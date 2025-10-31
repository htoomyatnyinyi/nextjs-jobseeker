"use client";

import { useActionState } from "react";
import { savedJob } from "./actions";

const SaveForm = ({
  jobPostId,
}: // savedJobsList,
{
  jobPostId: string;
  // savedJobsList: any[];
}) => {
  const [state, savedJobAction, pending] = useActionState(savedJob, null);

  return (
    <div className="bg-blue-500 p-2 m-1">
      <form action={savedJobAction}>
        <input type="text" name="jobPostId" defaultValue={jobPostId} hidden />

        <button type="submit" disabled={pending}>
          SaveJob
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
