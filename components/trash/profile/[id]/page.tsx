import prisma from "@/lib/prisma";
// import Link from "next/link";
// import Edit from "./_components/Edit";

const page = async ({ params }: any) => {
  const { id } = await params;

  // console.log(id);
  const data = await prisma.user.findFirst({
    where: { id },
  });
  // console.log(data, "profile id data");
  return (
    <div>
      <div>
        <p>{id}</p>
        <p>{data?.username}</p>
        <p>{data?.email}</p>
        <p>{data?.verified}</p>
      </div>
      {/* <Link href={`/profile/${data?.id}/edit`}>Edit</Link>
      <Edit data={data} /> */}
    </div>
  );
};

export default page;
