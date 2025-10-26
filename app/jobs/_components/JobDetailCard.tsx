// components/JobDetailCard.tsx  (A new file in your project)
"use client";

// Define the Job structure (match your Prisma include)
type Job = {
  id: string;
  title: string;
  description: string;
  location: string;
  employmentType: string;
  requirements: { id: string; requirement: string }[];
  responsibilities: { id: string; responsibility: string }[];
  // Add other fields you need to display
};

type JobDetailCardProps = {
  job: Job;
};

const JobDetailCard = ({ job }: JobDetailCardProps) => {
  return (
    <div className="p-6 h-full overflow-y-auto backdrop-blur-3xl shadow-2xl shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold mb-2 text-blue-800">{job.title}</h2>
      <p className="text-md text-gray-500 mb-6">
        {job.location} | {job.employmentType}
      </p>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2 border-b pb-1">
          Description
        </h3>
        <p className="text-gray-700">{job.description}</p>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2 border-b pb-1">
          Responsibilities
        </h3>
        <ul className="list-disc list-inside space-y-1">
          {job.responsibilities.map((res) => (
            <li key={res.id}>{res.responsibility}</li>
          ))}
        </ul>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2 border-b pb-1">
          Requirements
        </h3>
        <ul className="list-disc list-inside space-y-1">
          {job.requirements.map((req) => (
            <li key={req.id}>{req.requirement}</li>
          ))}
        </ul>
      </div>
      {/* ... other details ... */}
    </div>
  );
};

export default JobDetailCard;
