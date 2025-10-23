import prisma from "@/lib/prisma";
import { verifySession } from "@/lib/session";
// import EditForm from "./EditForm";
// import DeleteForm from "./DeleteForm";
import Link from "next/link";

const page = async () => {
  const session = await verifySession();

  const user = await prisma.user.findFirst({
    where: { id: session?.userId },
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
      verified: true,
      lastSignin: true,
    },
    // include: {
    //   employerProfiles: true,
    // },

    // select: {
    //   id: true,
    //   username: true,
    //   email: true,
    //   role: true,
    //   verified: true,
    //   lastSignin: true,
    //   jobSeekerProfile: true,
    //   // jobSeekerProfile: {
    //   // select: {
    //   //   id: true,
    //   //   userId: true,
    //   //   fullName: true,
    //   //   firstName: true,
    //   //   lastName: true,
    //   //   phone: true,
    //   //   gender: true,
    //   //   dateOfBirth: true,
    //   //   address: true,
    //   //   bio: true,
    //   //   education: true,
    //   //   profileImageUrl: true,
    //   //   coverImageUrl: true,
    //   // },
    //   // },
    // },
  });
  console.log(user, "user ", session, "session");

  // // 1. Get the date value directly (it will be a Date object or null)
  // const dateOfBirthPrisma = data?.employerProfiles?.dateOfBirth;

  // // 2. Conditionally process the date only if it exists
  // const dateOnly = dateOfBirthPrisma
  //   ? new Date(dateOfBirthPrisma).toISOString().split("T")[0] // If valid, format it
  //   : ""; // If null, set it to an empty string

  return (
    <div className="felx flex-col p-2 m-1 ">
      <p>{user?.username}</p>
      <p>{user?.email}</p>
      <p>{user?.role}</p>
      <p>{user?.verified}</p>
      {/* {data?.jobSeekerProfile?.id && (
        <div className="flex flex-col border p-2 m-1 text-sky-400">
          <div className="flex justify-between">
            <h1 className="text-3xl p-2 m-1 uppercase">Profile Data</h1>
            <DeleteForm profile_id={data?.jobSeekerProfile?.id} />
          </div>
          <div>
            <p>{data?.jobSeekerProfile?.id} jobSeekerProfile</p>
            <p>{data?.jobSeekerProfile?.userId} userId</p>
            <p>{data?.jobSeekerProfile?.fullName}</p>
            <p>{data?.jobSeekerProfile?.firstName}</p>
            <p>{data?.jobSeekerProfile?.lastName}</p>
            <p>{data?.jobSeekerProfile?.phone}</p>

            <p>{dateOnly}</p>
            <p>{data?.jobSeekerProfile?.gender}</p>
            <p>{data?.jobSeekerProfile?.address}</p>
            <p>{data?.jobSeekerProfile?.bio}</p>
            <p>{data?.jobSeekerProfile?.education}</p>
          </div>
        </div>
      )} */}

      {/* <EditForm data={data} /> */}
      {/* <Link href={`/profile/${data?.id}/edit`} className="bg-red-500 p-2 m-1">
        Edit
      </Link>
      <Link href={`/profile/${data?.id}`} className="bg-red-500 p-2 m-1">
        View
      </Link> */}
    </div>
  );
};

export default page;
