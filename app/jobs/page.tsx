// app/jobs/page.tsx
import prisma from "@/lib/prisma";
// import JobLists from "./_components/JobLists";
import { Metadata } from "next";
import { Suspense } from "react";
// import JobListSkeleton from "./_components/JobListSkeleton";
import JobListSkeleton from "./_components/JobListSkeleton";
import SearchFilterBar from "./_components/SearchFilterBar";
import { JobLists } from "./_components/JobLists";

export const metadata: Metadata = {
  title: "Latest Jobs 2025 | Remote & On-site | YourJobSite",
  description:
    "Find 10,000+ tech, design, and marketing jobs. Remote, hybrid, full-time. Updated daily.",
  openGraph: {
    title: "Latest Jobs 2025",
    description: "Never miss a job opportunity again.",
    type: "website",
    images: ["/og-jobs.png"],
  },
};

export const revalidate = 300; // Refresh every 5 minutes (ISR)

// Optional: Generate static params for popular filters
// export async function generateStaticParams() {
//   return [{ filter: "remote" }, { filter: "full-time" }];
// }

const JobsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; type?: string; location?: string }>;
}) => {
  const { q, type, location } = await searchParams;

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Header */}
        <header className="text-center mb-12">
          <h1 className="text-5xl sm:text-6xl font-extrabold bg-linear-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
            Find Your Dream Job
          </h1>
          <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
            {q
              ? `Search results for "${q}"`
              : "10,000+ jobs from top companies • Updated every hour"}
          </p>
        </header>

        {/* Search & Filters */}
        <SearchFilterBar initialQuery={q} />

        {/* Streaming + Skeleton */}
        <Suspense fallback={<JobListSkeleton count={12} />}>
          <JobListContent q={q} type={type} location={location} />
        </Suspense>
      </div>
    </div>
  );
};

// Extracted to enable streaming
async function JobListContent({
  q,
  type,
  location,
}: {
  q?: string;
  type?: string;
  location?: string;
}) {
  const jobs = await prisma.jobPost.findMany({
    where: {
      AND: [
        q
          ? {
              OR: [
                { title: { contains: q } },
                { description: { contains: q } },
                { employer: { companyName: { contains: q } } },
              ],
            }
          : {},
        // type ? { employmentType: type } : {},
        // location
        //   ? { location: { contains: location, mode: "insensitive" } }
        //   : {},
      ],
    },
    orderBy: { createdAt: "desc" },
    take: 48,
    include: {
      // company: { select: { name: true, logo: true } },
      employer: { select: { companyName: true, logoUrl: true } },
      _count: { select: { jobApplications: true } },
    },
  });

  if (jobs.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">No jobs found</h2>
        <p className="text-gray-600">
          Try adjusting your filters or search term.
        </p>
      </div>
    );
  }

  return <JobLists jobs={jobs} />;
}

export default JobsPage;
// import prisma from "@/lib/prisma";
// import { JobLists } from "./_components/JobLists";
// // import JobsMasterDetail from "./_components/JobMasterDetail";

// const page = async () => {
//   const jobs = await prisma.jobPost.findMany({
//     include: {
//       requirements: true,
//       responsibilities: true,
//     },
//   });

//   // console.log(jobs, "jobs");

//   return (
//     <div className="p-6 h-screen">
//       <h1 className="text-3xl font-bold mb-4">Job List</h1>
//       <p className="mb-8 text-gray-600">
//         Lorem ipsum, dolor sit amet consectetur adipisicing elit. Laboriosam...
//       </p>

//       {/* <JobsMasterDetail jobs={jobs} /> */}
//       <JobLists jobs={jobs} />
//     </div>
//   );
// };

// export default page;
