"use client";

import { useState } from "react";
import JobDetailCard from "./JobDetailCard";

type Job = {
  id: string;
  title: string;
  description: string;
  salaryMin: number;
  salaryMax: number | null;
  location: string | null;
  address: string | null;
  // Use the actual Prisma Enum names if possible, or string as a fallback
  employmentType:
    | "FULL_TIME"
    | "PART_TIME"
    | "CONTRACT"
    | "INTERNSHIP"
    | "APPRENTICESHIP";
  category: string | null;
  imageUrl: string | null;
  applicationDeadLine: Date | string | null; // Matches Date from Prisma or String from serialization
  responsibilities: {
    id: string;
    responsibility: string;
    displayOrder: number;
  }[];
  requirements: { id: string; requirement: string; displayOrder: number }[];
  // Include metadata if you're passing it
  createdAt: Date | string;
};

type JobsMasterDetailProps = {
  jobs: Job[];
};
const JobsMasterDetail = ({ jobs }: JobsMasterDetailProps) => {
  // 1. Manage the ID of the selected job in client state
  const [selectedJobId, setSelectedJobId] = useState<string | null>(
    jobs.length > 0 ? jobs[0].id : null // Select the first job by default
  );

  // Find the selected job object
  const selectedJob = jobs.find((job) => job.id === selectedJobId) || null;

  return (
    <div className="flex h-screen overflow-hidden">
      {/* LEFT PANEL: Job List (Master) */}
      <div className="w-1/3 border-r overflow-y-auto  p-4">
        <h2 className="text-2xl font-bold mb-4">Job Listings</h2>
        <div className="space-y-3">
          {jobs.map((job) => (
            <div
              key={job.id}
              onClick={() => setSelectedJobId(job.id)} // 2. Update state on click
              className={`p-3 h-50 border rounded-lg cursor-pointer transition duration-150 ${
                selectedJobId === job.id
                  ? "backdrop-blur-3xl shadow-2xl "
                  : "backdrop-blur-3xl hover:border-2"
              }`}
            >
              <h3 className="text-lg font-semibold">{job.title}</h3>
              <p className="text-sm">
                {job.location} | {job.employmentType}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT PANEL: Job Details (Detail) */}
      <div className="w-2/3 overflow-y-auto p-4">
        {selectedJob ? (
          <JobDetailCard job={selectedJob} /> // 3. Render details for selected job
        ) : (
          <div className="p-10 text-center text-gray-500">
            Select a job from the list to view its details.
          </div>
        )}
      </div>
    </div>
  );
};

export default JobsMasterDetail;
