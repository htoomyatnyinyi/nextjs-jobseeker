import EditProfile from "./form";

const page = async ({ params }: any) => {
  const { id } = await params;

  console.log(id);
  return (
    <div>
      <EditProfile />
    </div>
  );
};

export default page;
