"use client";

import { useActionState } from "react";
import { savedJob } from "./actions";
import { Heart } from "lucide-react";

const SaveForm = ({
  jobPostId,
  savedStatus,
}: {
  jobPostId: string;
  savedStatus: any;
}) => {
  const [state, savedJobAction, pending] = useActionState(savedJob, null);

  // console.log(jobPostId, "state", savedStatus);
  return (
    <div className="">
      <form action={savedJobAction}>
        <input type="text" name="jobPostId" defaultValue={jobPostId} hidden />

        <button
          type="submit"
          disabled={pending}
          className="border-pink-500 text-pink-500 border px-4 py-2 rounded-md hover:bg-pink-50 transition-colors"
        >
          {pending ? (
            <Heart fill="white" />
          ) : savedStatus ? (
            <Heart fill="red" />
          ) : (
            <Heart fill="none" />
          )}
        </button>
      </form>
    </div>
  );
};

export default SaveForm;
