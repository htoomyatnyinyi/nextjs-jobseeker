const page = async ({ params }: { params: { id: string } }) => {
  const jobId = await params.id;

  return <div>{jobId}</div>;
};

export default page;
