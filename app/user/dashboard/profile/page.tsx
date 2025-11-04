// import prisma from "@/lib/prisma";
// import { verifySession } from "@/lib/session";
// import EditForm from "./EditForm";
// import DeleteForm from "./DeleteForm";
// import Link from "next/link";
// import { DateFilter } from "@/lib/common/DateTime";

// const page = async () => {
//   const session = await verifySession();

//   const data = await prisma.user.findFirst({
//     where: { id: session?.userId },

//     // include: {
//     //   jobSeekerProfile: true,
//     // },

//     select: {
//       id: true,
//       username: true,
//       email: true,
//       role: true,
//       verified: true,
//       lastSignin: true,
//       jobSeekerProfile: true,
//       // jobSeekerProfile: {
//       // select: {
//       //   id: true,
//       //   userId: true,
//       //   fullName: true,
//       //   firstName: true,
//       //   lastName: true,
//       //   phone: true,
//       //   gender: true,
//       //   dateOfBirth: true,
//       //   address: true,
//       //   bio: true,
//       //   education: true,
//       //   profileImageUrl: true,
//       //   coverImageUrl: true,
//       // },
//       // },
//     },
//   });

//   // same as above using DateFilter component
//   const dateOnly = DateFilter({ date: data?.jobSeekerProfile?.dateOfBirth });
//   // // 1. Get the date value directly (it will be a Date object or null)
//   // const dateOfBirthPrisma = data?.jobSeekerProfile?.dateOfBirth;

//   // // 2. Conditionally process the date only if it exists
//   // const dateOnly = dateOfBirthPrisma
//   //   ? new Date(dateOfBirthPrisma).toISOString().split("T")[0] // If valid, format it
//   //   : ""; // If null, set it to an empty string

//   return (
//     <div className="felx flex-col p-2 m-1 ">
//       <p>{data?.username}</p>
//       <p>{data?.email}</p>
//       <p>{data?.role}</p>
//       <p>{data?.verified}</p>
//       {data?.jobSeekerProfile?.id && (
//         <div className="flex flex-col border p-2 m-1 text-sky-400">
//           <div className="flex justify-between">
//             <h1 className="text-3xl p-2 m-1 uppercase">Profile Data</h1>
//             <DeleteForm profile_id={data?.jobSeekerProfile?.id} />
//           </div>
//           <div>
//             <p>{data?.jobSeekerProfile?.id} jobSeekerProfile</p>
//             <p>{data?.jobSeekerProfile?.userId} userId</p>
//             <p>{data?.jobSeekerProfile?.fullName}</p>
//             <p>{data?.jobSeekerProfile?.firstName}</p>
//             <p>{data?.jobSeekerProfile?.lastName}</p>
//             <p>{data?.jobSeekerProfile?.phone}</p>

//             <p>{dateOnly}</p>
//             <p>{data?.jobSeekerProfile?.gender}</p>
//             <p>{data?.jobSeekerProfile?.address}</p>
//             <p>{data?.jobSeekerProfile?.bio}</p>
//             <p>{data?.jobSeekerProfile?.education}</p>
//           </div>
//         </div>
//       )}

//       <EditForm data={data} />
//       {/* <Link href={`/profile/${data?.id}/edit`} className="bg-red-500 p-2 m-1">
//         Edit
//       </Link>
//       <Link href={`/profile/${data?.id}`} className="bg-red-500 p-2 m-1">
//         View
//       </Link> */}
//     </div>
//   );
// };

// export default page;

// // import prisma from "@/lib/prisma";
// // import { verifySession } from "@/lib/session";
// // import EditForm from "./EditForm";
// // import DeleteForm from "./DeleteForm";
// // const page = async () => {
// //   const session = await verifySession();

// //   const data = await prisma.user.findFirst({
// //     where: { id: session?.userId },
// //     select: {
// //       id: true,
// //       username: true,
// //       email: true,
// //       role: true,
// //       verified: true,
// //       lastSignin: true,
// //       jobSeekerProfile: {
// //         select: {
// //           id: true,
// //           fullName: true,
// //           firstName: true,
// //           lastName: true,
// //           phone: true,
// //           gender: true,
// //           dateOfBirth: true,
// //           address: true,
// //           bio: true,
// //           education: true,
// //         },
// //       },
// //     },
// //   });

// //   // const [user, jobseekerprofile] = await Promise.all([
// //   //   prisma.user.findFirst({
// //   //     where: { id: session?.userId },
// //   //     select: {
// //   //       id: true,
// //   //       username: true,
// //   //       email: true,
// //   //       role: true,
// //   //       verified: true,
// //   //     },
// //   //     include: {
// //   //       jobSeekerProfiles: {
// //   //         select: {
// //   //           fullName: true,
// //   //           firstName: true,
// //   //           lastName: true,
// //   //           phone: true,
// //   //           gender: true,
// //   //           dateOfBirth: true,
// //   //           address: true,
// //   //         },
// //   //       },
// //   //     },
// //   //   }),
// //   //   prisma.jobSeekerProfile.findFirst({
// //   //     where: { id: session?.userId },
// //   //   }),
// //   // ]);

// //   // console.log("jobseekerprofile", jobseekerprofile, user, "user");

// //   // // check if jobseekerprofile exists to avoid errors
// //   // const data = {
// //   //   id: auth?.id,
// //   //   username: auth?.username,
// //   //   email: auth?.email,
// //   //   role: auth?.role,
// //   //   verified: auth?.verified,
// //   //   fullName: jobseekerprofile?.fullName,
// //   //   firstName: jobseekerprofile?.firstName,
// //   //   lastName: jobseekerprofile?.lastName,
// //   //   phone: jobseekerprofile?.phone,
// //   //   gender: jobseekerprofile?.gender,
// //   //   dateOfBirth: jobseekerprofile?.dateOfBirth
// //   //     ? jobseekerprofile.dateOfBirth.toISOString().split("T")[0]
// //   //     : "",
// //   //   address: jobseekerprofile?.address,
// //   // };

// //   // console.log("profile data", data);

// //   // //  Logic for Standard Time to Date
// //   // const dateOfBirthIST = data?.jobSeekerProfile?.dateOfBirth || ""; // const dateOfBirth = "Fri Apr 20 2020 00:00:00 GMT+0530 (India Standard Time)"
// //   // const dateOnly = new Date(dateOfBirthIST).toISOString().split("T")[0];

// //   return (
// //     <div className="felx flex-col p-2 m-1 ">
// //       <p>{data?.username}</p>
// //       <p>{data?.email}</p>
// //       <p>{data?.role}</p>
// //       <p>{data?.verified}</p>
// //       {data?.jobSeekerProfile?.id && (
// //         <div className="flex flex-col border p-2 m-1 text-sky-400">
// //           <h1 className="text-3xl p-2 m-1 uppercase">Profile Data</h1>
// //           {/* <DeleteForm data={data} /> */}
// //           {/* <p>{data?.jobSeekerProfile?.id} jobSeekerProfile</p>
// //         <p>{data?.id} userId</p> */}
// //           <p>{data?.jobSeekerProfile?.fullName}</p>
// //           <p>{data?.jobSeekerProfile?.firstName}</p>
// //           <p>{data?.jobSeekerProfile?.lastName}</p>
// //           <p>{data?.jobSeekerProfile?.phone}</p>
// //           {/* <p>{data?.jobSeekerProfile?.dateOfBirth}</p> */}
// //           {/* <p>{dateOnly}</p> */}
// //           <p>{data?.jobSeekerProfile?.gender}</p>
// //           <p>{data?.jobSeekerProfile?.address}</p>
// //           <p>{data?.jobSeekerProfile?.bio}</p>
// //           <p>{data?.jobSeekerProfile?.education}</p>
// //         </div>
// //       )}
// //       {/* <Link href={`/profile/${data?.id}/edit`} className="bg-red-500 p-2 m-1">
// //         Edit
// //       </Link>
// //       <br /> */}
// //       {/* <Link href={`/profile/${data?.id}`} className="bg-red-500 p-2 m-1">
// //         View
// //       </Link> */}

// //       {/* <Edit data={data} /> */}

// //       <EditForm data={data} />
// //     </div>
// //   );
// // };

// // export default page;
