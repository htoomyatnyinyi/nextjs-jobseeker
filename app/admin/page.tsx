import Link from "next/link";

const page = () => {
  return (
    <div>
      <div>
        <h1>User Manage Link</h1>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Est ducimus,
          voluptatum laborum nobis sapiente doloremque, nisi nemo inventore
          nihil minus tenetur! Tempore voluptate, at voluptatem accusamus
          dolorem illum quasi earum?
        </p>
        <Link href="/admin/user">User Manage</Link>
      </div>
      <div>
        <h1>Job Manage Link</h1>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Est ducimus,
          voluptatum laborum nobis sapiente doloremque, nisi nemo inventore
          nihil minus tenetur! Tempore voluptate, at voluptatem accusamus
          dolorem illum quasi earum?
        </p>
        <Link href="/admin/job">Job Manage</Link>
      </div>
    </div>
  );
};

export default page;
