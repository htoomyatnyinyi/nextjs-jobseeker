"use client";

import { useState } from "react";
import JobDetailCard from "./JobDetailCard";

// Define the Job structure (match your Prisma include)
type Job = {
  id: string;
  title: string;
  description: string;
  salaryMin: number; // Changed to number for correct handling
  salaryMax: number | null; // Changed to number
  location: string;
  address: string;
  employmentType: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP";
  category: string;
  imageUrl: string;
  applicationDeadLine: string; // Keep as string for date input value
  responsibilities: { responsibility: string; displayOrder: number }[];
  requirements: { requirement: string; displayOrder: number }[];
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
              className={`p-3 border rounded-lg cursor-pointer transition duration-150 ${
                selectedJobId === job.id
                  ? "bg-sky-500 border-blue-500 shadow-md"
                  : "backdrop-blur-3xl hover:bg-sky-300"
              }`}
            >
              <h3 className="text-lg font-semibold">{job.title}</h3>
              <p className="text-sm text-gray-600">
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
