"use client";

import { useActionState } from "react";
import { editProfile } from "./actions";

const EditProfile = () => {
  const [state, action, pending] = useActionState(editProfile, undefined);
  console.log({ state, pending });

  return (
    <div>
      <form action={action} className="flex flex-col">
        <input
          type="text"
          name="fullName"
          placeholder="text"
          className="p-2 m-1 text-sky-400"
        />
        <input
          type="text"
          name="firstName"
          placeholder="text"
          className="p-2 m-1 text-sky-400"
        />
        <input
          type="text"
          name="lastName"
          placeholder="text"
          className="p-2 m-1 text-sky-400"
        />
        <input
          type="tel"
          name="phone"
          placeholder="text"
          className="p-2 m-1 text-sky-400"
        />
        <select name="gender">
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        <input
          type="date"
          name="dateOfBirth"
          placeholder="text"
          className="p-2 m-1 text-sky-400"
        />
        <input
          type="text"
          name="address"
          placeholder="text"
          className="p-2 m-1 text-sky-400"
        />
        <input
          type="text"
          name="bio"
          placeholder="text"
          className="p-2 m-1 text-sky-400"
        />
        <button type="submit" disabled={pending}>
          {pending ? "Saving..." : "Save"}
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
