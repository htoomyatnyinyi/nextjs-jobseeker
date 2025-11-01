"use client";

import { useActionState } from "react";
import { applicationJob } from "./actions";

const ApplicationForm = ({
  jobPostId,
  resumeId,
  // savedJobsList,
  resumes,
}: {
  jobPostId: string;
  resumeId: string;
  resumes: any[];
  // savedJobsList: any[];
}) => {
  const [state, applicationAction, pending] = useActionState(applicationJob, {
    jobPostIdInState: jobPostId,
    resumeIdInState: resumeId,
    jobSeekerProfileIdInState: resumes[0]?.jobSeekerId,
  });

  return (
    <div className="text-sky-500 p-2 m-1">
      <h1>ApplicationForm</h1>
      <form action={applicationAction}>
        {/* <input type="text" name="resumeId" defaultValue={resumeId} /> */}
        <input type="text" name="jobPostId" defaultValue={jobPostId} hidden />
        <input
          type="text"
          name="jobSeekerId"
          defaultValue={resumes[0].jobSeekerId}
          hidden
        />
        {/* <select name="resumeId" defaultValue={resumeId}> */}
        {/* <select className="text-pink-500"> */}
        <br />
        <p>Please Select Your Resume</p>
        <select
          name="resumeId"
          // defaultValue={resumeId}
          className="text-pink-500"
        >
          {resumes.map((resume) => (
            <option key={resume.id} value={resume.id}>
              {resume.fileName}
            </option>
          ))}
        </select>
        <button type="submit">Apply Now</button>
      </form>
    </div>
  );
};

export default ApplicationForm;
