"use client";
import { useActionState } from "react";
import { deleteEmployerProfile } from "./actions";
import { DeleteIcon, Trash2Icon } from "lucide-react";

const DeleteEmployerForm = ({ profile_id }: { profile_id: string }) => {
  // console.log(profile_id, "profile id to delete");
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
          className="border hover:border-red-500 p-2 m-1"
        >
          {/* <DeleteIcon /> */}
          <Trash2Icon />
        </button>
      </form>
    </div>
  );
};

export default DeleteEmployerForm;
