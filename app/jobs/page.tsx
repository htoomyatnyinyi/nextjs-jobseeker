import prisma from "@/lib/prisma";
import { verifySession } from "@/lib/session";

const page = async () => {
  const session = await verifySession();
  // console.log(session, "session");
  const jobs = await prisma.jobPost.findMany({
    include: {
      requirements: true,
      responsibilities: true,
    },
  });

  console.log(jobs, "jobs at jobs path");

  return (
    <div>
      <h1>Job List</h1>
      <p>
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Laboriosam
        aliquid voluptates voluptatem enim fuga dolorum ratione sunt debitis
        expedita quia est sapiente aperiam culpa, ducimus tenetur nam ullam,
        sequi earum?
      </p>

      {jobs?.map((job) => (
        <div key={job.id} className="flex flex-col p-2 m-1 border">
          <p>{job.title}</p>
          <p>{job.description}</p>
          {/* <p>{job.salaryMin}</p> */}
          {/* <p>{job.salaryMax}</p> */}
          <p>{job.location}</p>
          <p>{job.address}</p>
          <p>{job.employmentType}</p>
          <p>{job.category}</p>
          <div className="p-2 m-1">
            {job?.requirements.map((req) => (
              <div key={req.id}>{req.requirement}</div>
            ))}
          </div>
          <div className="p-2 m-1 ">
            {job?.responsibilities.map((res) => (
              <div key={res.id}>{res.responsibility}</div>
            ))}
          </div>
          {/* <p>{job.applicationDeadLine}</p> */}
          {/* <p>{job.postedAt}</p> */}
        </div>
      ))}
    </div>
  );
};

export default page;
