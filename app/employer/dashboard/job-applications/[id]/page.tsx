// const page = async (params: any) => {
//   const { id } = await params;

//   return <div>{id} job</div>;
// };

// export default page;

const page = async (params: any) => {
  // const applicationId = await params;
  // const id = await applicationId;

  const awaitParams = await params;
  const applicationId = awaitParams.id;
  console.log(awaitParams.id, "params application");
  return (
    <div>
      {applicationId}
      <div>hi</div>
    </div>
  );
};

export default page;
