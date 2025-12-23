const page = async (params: any) => {
  const { id } = await params;

  return <div>{id} job</div>;
};

export default page;
