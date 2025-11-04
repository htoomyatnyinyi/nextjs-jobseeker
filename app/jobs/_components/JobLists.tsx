import Link from "next/link";

export const JobLists = async ({ jobs }: any) => {
  return (
    <div>
      {jobs?.map((job: any) => (
        // 2. Wrap the entire job summary in the Link component
        <Link
          key={job.id}
          href={`/jobs/${job.id}`} // <-- Use the dynamic route
          className="block p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-lg transition duration-300 cursor-pointer gap-8"
        >
          <h2 className="text-xl font-semibold text-blue-700">{job.title}</h2>
          <p className="text-sm text-gray-500 mb-2">
            {job.location} | {job.employmentType}
          </p>
          <p className="text-sm text-gray-500 mb-2"></p>

          {/* Display a summary (or none at all) */}
          <p className="text-gray-700 line-clamp-2">
            {job.description.substring(0, 50)}...
          </p>

          {/* Remove detailed lists from the list view */}
          {/* <div className="p-2 m-1">
              {job?.requirements.map((req) => (
                <div key={req.id}>{req.requirement}</div>
                ))}
                </div> */}

          <span className="text-blue-500 font-medium mt-2 block">
            View Details →
          </span>
        </Link>
      ))}
    </div>
  );
};
