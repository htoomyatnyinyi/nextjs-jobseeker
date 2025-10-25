"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription, // Optional, but good for context
  SheetTrigger,
} from "@/components/ui/sheet";

import { useActionState } from "react";
import { editProfile } from "./actions";

const EditForm = ({ data }: any) => {
  const [state, action, pending] = useActionState(editProfile, {
    success: false,
    message: "",
  });

  // 1. Get the date value directly (it will be a Date object or null)
  const dateOfBirthPrisma = data?.jobSeekerProfile?.dateOfBirth;

  // 2. Conditionally process the date only if it exists
  const dateOnly = dateOfBirthPrisma
    ? new Date(dateOfBirthPrisma).toISOString().split("T")[0] // If valid, format it
    : ""; // If null, set it to an empty string

  return (
    <div className="border p-2 m-1">
      <Sheet>
        <SheetTrigger>Touch Me Edit Form</SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Edit your profile</SheetTitle>
            <SheetDescription>
              Make changes to your profile here. Click save when you're done.
            </SheetDescription>
          </SheetHeader>
          <div className="flex flex-col">
            <p>{data?.jobSeekerProfile?.id} jobSeekerProfile</p>
            <p>{data?.id} userId</p>
            <p>{data?.jobSeekerProfile?.fullName}</p>
            <p>{data?.jobSeekerProfile?.firstName}</p>
            <p>{data?.jobSeekerProfile?.lastName}</p>
            <p>{data?.jobSeekerProfile?.phone}</p>
            {/* <p>{data?.jobSeekerProfile?.dateOfBirth}</p> */}
            <p>{dateOnly}</p>
            <p>{data?.jobSeekerProfile?.gender}</p>
            <p>{data?.jobSeekerProfile?.address}</p>
            <p>{data?.jobSeekerProfile?.bio}</p>
            <p>{data?.jobSeekerProfile?.education}</p>
          </div>
          {/* Your form and other content go here */}
          <form className="mt-4 space-y-4" action={action}>
            {/* userId */}
            <input
              type="text"
              hidden
              name="id"
              defaultValue={data?.id}
              // defaultValue={data?.jobSeekerProfile?.id}
            />
            <input
              type="text"
              name="fullName"
              className="p-2 m-1 text-sky-400 border-sky-500 border"
              // placeholder={data?.jobSeekerProfile?.fullName || "fullName"}
              placeholder="fullName"
              defaultValue={data?.jobSeekerProfile?.fullName}
            />
            <input
              type="text"
              name="firstName"
              className="p-2 m-1 text-sky-400 border-sky-500 border"
              placeholder="firstName"
              defaultValue={data?.jobSeekerProfile?.firstName}
            />
            <input
              type="text"
              name="lastName"
              className="p-2 m-1 text-sky-400 border-sky-500 border"
              placeholder="lastName"
              defaultValue={data?.jobSeekerProfile?.lastName}
            />
            <input
              type="tel"
              name="phone"
              className="p-2 m-1 text-sky-400 border-sky-500 border"
              placeholder="phone"
              defaultValue={data?.jobSeekerProfile?.phone}
            />
            <select
              name="gender"
              className="p-2 m-1 text-sky-400 border-sky-500 border"
              defaultValue={data?.jobSeekerProfile?.gender}
            >
              <option
                value="MALE"
                className="p-2 m-1 text-sky-400 border-sky-500 border"
              >
                Male
              </option>
              <option
                value="FEMALE"
                className="p-2 m-1 text-sky-400 border-sky-500 border"
              >
                Female
              </option>
              <option
                value="OTHER"
                className="p-2 m-1 text-sky-400 border-sky-500 border"
              >
                Other
              </option>
              <option
                value="PREFER_NOT_TO_SAY"
                className="p-2 m-1 text-sky-400 border-sky-500 border"
              >
                Prefer not to say
              </option>
            </select>
            <input
              type="date"
              name="dateOfBirth"
              className="p-2 m-1 text-sky-400 border-sky-500 border"
              placeholder="date of birth"
              defaultValue={dateOnly}
              // defaultValue={data?.jobSeekerProfile?.dateOfBirth}
            />
            <input
              type="text"
              name="address"
              className="p-2 m-1 text-sky-400 border-sky-500 border"
              placeholder="address"
              defaultValue={data?.jobSeekerProfile?.address}
            />
            <input
              type="text"
              name="bio"
              className="p-2 m-1 text-sky-400 border-sky-500 border"
              placeholder="bio"
              defaultValue={data?.jobSeekerProfile?.bio}
            />
            <input
              type="text"
              name="education"
              className="p-2 m-1 text-sky-400 border-sky-500 border"
              placeholder="education"
              defaultValue={data?.jobSeekerProfile?.education}
            />
            <button
              type="submit"
              disabled={pending}
              className="p-2 m-1 text-sky-400 border-sky-500 border"
            >
              Save
            </button>
          </form>{" "}
        </SheetContent>
      </Sheet>
      {/* This form seems to be outside the sheet, I'm leaving it as is. */}
      <form className="mt-4 space-y-4" action={action}>
        {/* userId */}
        <input
          type="text"
          hidden
          name="id"
          defaultValue={data?.id}
          // defaultValue={data?.jobSeekerProfile?.id}
        />
        <input
          type="text"
          name="fullName"
          className="p-2 m-1 text-sky-400 border-sky-500 border"
          // placeholder={data?.jobSeekerProfile?.fullName || "fullName"}
          placeholder="fullName"
          defaultValue={data?.jobSeekerProfile?.fullName}
        />
        <input
          type="text"
          name="firstName"
          className="p-2 m-1 text-sky-400 border-sky-500 border"
          placeholder="firstName"
          defaultValue={data?.jobSeekerProfile?.firstName}
        />
        <input
          type="text"
          name="lastName"
          className="p-2 m-1 text-sky-400 border-sky-500 border"
          placeholder="lastName"
          defaultValue={data?.jobSeekerProfile?.lastName}
        />
        <input
          type="tel"
          name="phone"
          className="p-2 m-1 text-sky-400 border-sky-500 border"
          placeholder="phone"
          defaultValue={data?.jobSeekerProfile?.phone}
        />
        <select
          name="gender"
          className="p-2 m-1 text-sky-400 border-sky-500 border"
          defaultValue={data?.jobSeekerProfile?.gender}
        >
          <option
            value="MALE"
            className="p-2 m-1 text-sky-400 border-sky-500 border"
          >
            Male
          </option>
          <option
            value="FEMALE"
            className="p-2 m-1 text-sky-400 border-sky-500 border"
          >
            Female
          </option>
          <option
            value="OTHER"
            className="p-2 m-1 text-sky-400 border-sky-500 border"
          >
            Other
          </option>
          <option
            value="PREFER_NOT_TO_SAY"
            className="p-2 m-1 text-sky-400 border-sky-500 border"
          >
            Prefer not to say
          </option>
        </select>
        <input
          type="date"
          name="dateOfBirth"
          className="p-2 m-1 text-sky-400 border-sky-500 border"
          placeholder="date of birth"
          defaultValue={dateOnly}
          // defaultValue={data?.jobSeekerProfile?.dateOfBirth}
        />
        <input
          type="text"
          name="address"
          className="p-2 m-1 text-sky-400 border-sky-500 border"
          placeholder="address"
          defaultValue={data?.jobSeekerProfile?.address}
        />
        <input
          type="text"
          name="bio"
          className="p-2 m-1 text-sky-400 border-sky-500 border"
          placeholder="bio"
          defaultValue={data?.jobSeekerProfile?.bio}
        />
        <input
          type="text"
          name="education"
          className="p-2 m-1 text-sky-400 border-sky-500 border"
          placeholder="education"
          defaultValue={data?.jobSeekerProfile?.education}
        />
        <button
          type="submit"
          disabled={pending}
          className="p-2 m-1 text-sky-400 border-sky-500 border"
        >
          Save
        </button>
      </form>
    </div>
  );
};

export default EditForm;
