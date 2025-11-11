import prisma from "@/lib/prisma";
import { verifySession } from "@/lib/session";
import Link from "next/link";
import EditEmployerForm from "./EditEmployerForm";
import DeleteEmployerForm from "./DeleteEmployerForm";
// import SignOutForm from "@/app/(auth)/signout/form";

const page = async () => {
  const session = await verifySession();

  const user = await prisma.user.findUnique({
    where: { id: session?.userId },
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
      verified: true,
      lastSignin: true,
      employerProfile: true,
    },
  });
  // console.log(user, "user ", session, "session");

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
      <div></div>
      {/* <SignOutForm userId={session?.userId} /> */}

      {user?.employerProfile?.id && (
        <div className="flex flex-col border p-2 m-1 text-sky-400">
          <div className="flex justify-between">
            <h1 className="text-3xl p-2 m-1 uppercase">Profile Data</h1>
            <DeleteEmployerForm profile_id={user?.employerProfile?.id} />
          </div>
          <div>
            <p>{user?.employerProfile?.id} employerProfile</p>
            <p>{user?.employerProfile?.userId} userId</p>
            <p>{user?.employerProfile?.companyName}</p>
            <p>{user?.employerProfile?.companyEmail}</p>
            <p>{user?.employerProfile?.companyDescription}</p>
            <p>{user?.employerProfile?.industry}</p>
            <p>{user?.employerProfile?.phone}</p>

            {/* <p>{dateOnly}</p> */}
            <p>{user?.employerProfile?.country}</p>
            <p>{user?.employerProfile?.address}</p>
            <p>{user?.employerProfile?.state}</p>
          </div>
          <EditEmployerForm />
        </div>
      )}

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
