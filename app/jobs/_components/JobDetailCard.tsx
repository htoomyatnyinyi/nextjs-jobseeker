"use client";

// Define the Job structure (match your Prisma include)
// type Job = {
//   id: string;
//   title: string;
//   description: string;
//   salaryMin: number; // Changed to number for correct handling
//   salaryMax: number | null; // Changed to number
//   location: string;
//   address: string;
//   employmentType: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP";
//   category: string;
//   imageUrl: string;
//   applicationDeadLine: string; // Keep as string for date input value
//   responsibilities: { responsibility: string; displayOrder: number }[];
//   requirements: { requirement: string; displayOrder: number }[];
// };

// type JobDetailCardProps = {
//   job: Job;
// };
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

type JobDetailCardProps = {
  job: Job;
};

const JobDetailCard = ({ job }: JobDetailCardProps) => {
  return (
    <div className="p-6 h-full overflow-y-auto backdrop-blur-3xl shadow-2xl  rounded-lg">
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
            <li key={res.displayOrder}>{res.responsibility}</li>
          ))}
        </ul>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2 border-b pb-1">
          Requirements
        </h3>
        <ul className="list-disc list-inside space-y-1">
          {job.requirements.map((req) => (
            <li key={req.displayOrder}>{req.requirement}</li>
          ))}
        </ul>
      </div>
      {/* ... other details ... */}
    </div>
  );
};

export default JobDetailCard;
