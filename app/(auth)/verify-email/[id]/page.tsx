const page = async ({ params }: { params: { id: string } }) => {
  const { id } = await params;
  console.log(id, " ===> id from verify-email page");
  return <div>{id}ID for verify-email page</div>;
};

export default page;
