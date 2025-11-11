"use client";

import { useActionState } from "react";
import { savedJob } from "./actions";

const SaveForm = ({
  jobPostId,
  isSaved,
}: // savedJobsList,
{
  jobPostId: string;
  // savedJobsList: any[];
  isSaved: boolean;
}) => {
  const [state, savedJobAction, pending] = useActionState(savedJob, null);

  return (
    <div className="border border-blue-500 p-2 m-1">
      <form action={savedJobAction}>
        <input type="text" name="jobPostId" defaultValue={jobPostId} hidden />

        {isSaved ? (
          "Saved Job"
        ) : (
          <button type="submit" disabled={pending}>
            SaveJob
          </button>
        )}
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
