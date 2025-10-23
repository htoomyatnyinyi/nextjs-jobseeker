import prisma from "@/lib/prisma";
import { verifySession } from "@/lib/session";

const page = async () => {
  const session = await verifySession();
  console.log(session, "session");
  const jobs = await prisma.jobPost.findMany();
  return (
    <div>
      <h1>Job List</h1>
      <p>
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Laboriosam
        aliquid voluptates voluptatem enim fuga dolorum ratione sunt debitis
        expedita quia est sapiente aperiam culpa, ducimus tenetur nam ullam,
        sequi earum?
      </p>
    </div>
  );
};

export default page;
