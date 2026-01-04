import prisma from "@/lib/prisma";
import { verifySession } from "@/lib/session";
import JobLists from "../_components/JobLists"; // Using the design we just made
import ApplicationForm from "./ApplicationForm";
import SaveForm from "./SaveForm";
import UnsaveForm from "./UnsaveForm";

type JobDetailsPageProps = {
  params: Promise<{ id: string }>;
};

const JobDetailsPage = async ({ params }: JobDetailsPageProps) => {
  const session = await verifySession();
  const { id } = await params;

  // Optimized parallel data fetching
  const [job, allJobs, resumes, savedStatus] = await Promise.all([
    prisma.jobPost.findUnique({
      where: { id },
      include: { requirements: true, responsibilities: true },
    }),
    prisma.jobPost.findMany({
      orderBy: { createdAt: "desc" },
    }),
    prisma.resume.findMany({
      where: { jobSeekerProfile: { userId: session?.userId } },
    }),
    prisma.savedJob.findFirst({
      where: {
        jobPostId: id,
        jobSeekerProfile: { userId: session?.userId },
      },
      select: {
        id: true,
      },
    }),
  ]);

  if (!job) return <div className="p-10 text-center">Job not found</div>;

  // console.log(savedStatus, "savedStatus");

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden ">
      {/* LEFT SIDEBAR: Job List */}
      <aside className="w-full max-w-sm border-r overflow-y-auto hidden md:block">
        <div className="p-4 border-b  sticky top-0 z-10">
          <h2 className="text-xl font-bold ">Available Positions</h2>
          <p className="text-xs ">{allJobs.length} jobs found</p>
        </div>
        <div className="p-2">
          {/* Reuse the JobLists component we designed in the previous step */}
          <JobLists jobs={allJobs} selectedId={id} />
        </div>
      </aside>

      {/* RIGHT CONTENT: Job Details */}
      <main className="flex-1 overflow-y-auto ">
        <div className="max-w-7xl mx-auto p-8">
          {/* Top Header Section */}
          <div className="flex justify-between items-start mb-8 pb-8 border-b">
            <div>
              <h1 className="text-4xl font-extrabold mb-2">{job.title}</h1>
              <div className="flex flex-wrap gap-3 0 font-medium">
                <span className="flex items-center"> {job.location}</span>
                <span className="">|</span>
                <span className="flex items-center">{job.employmentType}</span>
                <span className="">|</span>
                <span className="text-green-600">
                  ${job.salaryMin.toLocaleString()} - $
                  {job.salaryMax?.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2 min-w-50">
              {!savedStatus?.id && (
                <div>
                  <SaveForm jobPostId={id} />
                </div>
              )}

              {savedStatus?.id && (
                <div>
                  <UnsaveForm savedJobId={savedStatus.id} />
                </div>
              )}

              {savedStatus?.id ? (
                <div className="flex bg-red-400">
                  <p>Save</p>
                  <SaveForm jobPostId={id} />
                </div>
              ) : (
                <div className="flex bg-green-400">
                  <p>UnSave</p>
                  <SaveForm jobPostId={id} />
                </div>
              )}
              {/* <SaveForm jobPostId={id} savedStatus={savedStatus} /> */}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Main Column */}
            <div className="lg:col-span-2 space-y-8">
              <section>
                <h2 className="text-2xl font-bold mb-4 0">Job Description</h2>
                <p className="0 leading-relaxed whitespace-pre-line">
                  {job.description}
                </p>
              </section>

              <section className=" p-6 rounded-2xl border border-blue-100">
                <h2 className="text-2xl font-bold mb-4 0">Responsibilities</h2>
                <ul className="grid gap-3">
                  {job.responsibilities.map((res) => (
                    <li key={res.id} className="flex gap-3 ">
                      <span className="text-blue-500 font-bold">•</span>
                      {res.responsibility}
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4 0">Requirements</h2>
                <ul className="grid gap-3">
                  {job.requirements.map((req) => (
                    <li
                      key={req.id}
                      className="flex gap-3  border-l-4 border-gray-200 pl-4"
                    >
                      {req.requirement}
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            {/* Sidebar Column: Action Box */}
            <div className="lg:col-span-1">
              <div className="sticky top-0 p-6 border rounded-2xl shadow-sm ">
                <h3 className="text-lg font-bold mb-4">Ready to Apply?</h3>
                <ApplicationForm
                  jobPostId={id}
                  resumes={resumes}
                  // resumeId={resumes[0]?.id}
                />
                <p className="text-[10px] text-gray-400 mt-4 text-center">
                  By clicking Apply, you agree to share your profile and resume
                  with the employer.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default JobDetailsPage;
