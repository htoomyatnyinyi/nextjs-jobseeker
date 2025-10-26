"use client";
import { useActionState } from "react";
import { deleteEmployerProfile } from "./actions";

const DeleteEmployerForm = ({ profile_id }: any) => {
  console.log(profile_id, "profile id to delete");
  const [state, action, pending] = useActionState(deleteEmployerProfile, {
    success: false,
    message: "",
  });

  return (
    <div>
      <form action={action}>
        <input type="text" name="profileId" hidden defaultValue={profile_id} />
        <button
          type="submit"
          disabled={pending}
          className="border border-red-500 p-2 m-1"
        >
          Delete Employer Profile
        </button>
      </form>
    </div>
  );
};

export default DeleteEmployerForm;
