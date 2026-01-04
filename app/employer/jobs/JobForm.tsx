"use client";

import { startTransition, useActionState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { jobPost } from "./actions"; // Assuming this is your Server Action

// Define the shape of your form data that React Hook Form provides
type FormData = {
  title: string;
  description: string;
  salaryMin: number; // Changed to number for correct handling
  salaryMax: number; // Changed to number
  //   salaryMax: number | null; // Changed to number
  location: string;
  address: string;
  employmentType: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP";
  category: string;
  imageUrl: string;
  applicationDeadLine: string; // Keep as string for date input value
  responsibilities: { responsibility: string; displayOrder: number }[];
  requirements: { requirement: string; displayOrder: number }[];
};

const mockFrontendJob = {
  title: "Senior Frontend Developer",
  description: "Lead the frontend development of our core SaaS product...",
  salaryMin: 120000, // Use number here
  salaryMax: 160000, // Use number here
  location: "Remote (EST Timezone Preferred)",
  address: "No.209, Main Road",
  employmentType: "FULL_TIME",
  category: "Software Engineering",
  imageUrl: "https://example.com/images/dev_banner.jpg",
  applicationDeadLine: "2025-12-31", // Date in YYYY-MM-DD format
} as const;

const JobForm = () => {
  // const {
  //   register,
  //   control,
  //   handleSubmit,
  //   reset,
  //   formState: { errors },
  // } = useForm<FormData>({
  //   // Use the defined type
  //   defaultValues: {
  //     title: mockFrontendJob.title,
  //     description: mockFrontendJob.description,
  //     salaryMin: mockFrontendJob.salaryMin,
  //     salaryMax: mockFrontendJob.salaryMax,
  //     location: mockFrontendJob.location,
  //     address: mockFrontendJob.address,
  //     employmentType: mockFrontendJob.employmentType,
  //     category: mockFrontendJob.category,
  //     imageUrl: mockFrontendJob.imageUrl,
  //     applicationDeadLine: mockFrontendJob.applicationDeadLine,
  //     // title: mockFrontendJob.title,
  //     // description: mockFrontendJob.description,
  //     // salaryMin: mockFrontendJob.salaryMin,
  //     // salaryMax: mockFrontendJob.salaryMax,
  //     // location: mockFrontendJob.location,
  //     // address: mockFrontendJob.address,
  //     // employmentType: mockFrontendJob.employmentType,
  //     // category: mockFrontendJob.category,
  //     // imageUrl: mockFrontendJob.imageUrl,
  //     // applicationDeadLine: mockFrontendJob.applicationDeadLine,
  //     // Initialize dynamic fields with some data for demo or just empty
  //     responsibilities: [
  //       { responsibility: "Develop new user-facing features", displayOrder: 1 },
  //       {
  //         responsibility: "Optimize application for maximum speed",
  //         displayOrder: 2,
  //       },
  //     ],
  //     requirements: [
  //       { requirement: "5+ years of professional experience", displayOrder: 1 },
  //       { requirement: "Expertise in React and TypeScript", displayOrder: 2 },
  //     ],
  //   },
  // });

  // Initialize useFieldArray for dynamic lists

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    // Use the defined type
    defaultValues: {
      title: "",
      description: "",
      salaryMin: 0,
      salaryMax: 0,
      location: "",
      address: "",
      employmentType: "FULL_TIME",
      category: "",
      imageUrl: "",
      applicationDeadLine: "",
      responsibilities: [],
      requirements: [],
    },
  });
  const {
    fields: responsibilityFields,
    append: appendResponsibility,
    remove: removeResponsibility,
  } = useFieldArray({ control, name: "responsibilities" });

  const {
    fields: requirementFields,
    append: appendRequirement,
    remove: removeRequirement,
  } = useFieldArray({ control, name: "requirements" });

  // Initialize useActionState
  const [state, actionForm, pending] = useActionState(jobPost, {
    success: false,
    message: "",
    errors: {}, // For Server Action validation errors
  });

  // Optional: Reset form on successful submission
  useEffect(() => {
    if (state.success) {
      // If you want to reset the form data to default values after success
      // reset();
    }
  }, [state.success, reset]);

  // Handle form submission and manually create FormData
  const onSubmit = (data: FormData) => {
    console.log(data, "dataForm");
    // 1. Create a new FormData object
    const formData = new FormData();

    // 2. Append all simple fields
    // Use String() to ensure all data is correctly converted to a string before appending
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("salaryMin", String(data.salaryMin));
    formData.append("salaryMax", String(data.salaryMax));
    formData.append("location", data.location);
    formData.append("address", data.address);
    formData.append("employmentType", data.employmentType);
    formData.append("category", data.category);
    formData.append("imageUrl", data.imageUrl);
    formData.append("applicationDeadLine", data.applicationDeadLine);

    // 3. Append complex array fields as JSON strings
    formData.append("responsibilities", JSON.stringify(data.responsibilities));
    formData.append("requirements", JSON.stringify(data.requirements));

    // console.log(formData, "formdata");

    // 4. Call the Server Action with the FormData object, wrapped in startTransition
    startTransition(() => {
      actionForm(formData);
    });
  };

  // Styling classes
  const inputClass =
    "w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500";
  const labelClass = "block text-sm font-medium mb-1";
  const errorClass = "text-sm text-red-500 mt-1";
  const buttonClass =
    "p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-150";

  return (
    <div className="w-full  mx-auto p-8  shadow-2xl rounded-xl">
      <h2 className="text-3xl font-extrabold  mb-8 border-b pb-2">
        Create New Job Post
      </h2>

      {/* Feedback Message */}
      {state.message && (
        <div
          className={`p-4 mb-6 rounded-lg font-medium ${
            state.success
              ? "bg-green-100 text-green-700 border border-green-300"
              : "bg-red-100 text-red-700 border border-red-300"
          }`}
        >
          {state.message}
        </div>
      )}

      {/* --- The Form --- */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="title" className={labelClass}>
              Job Title
            </label>
            <input
              id="title"
              type="text"
              placeholder="e.g., Senior Full Stack Developer"
              className={inputClass}
              {...register("title", { required: "Job Title is required" })}
            />
            {errors.title && (
              <p className={errorClass}>{errors.title.message}</p>
            )}
            {/* {state.errors?.title && (
              <p className={errorClass}>{state.errors.title}</p>
            )} */}
          </div>

          <div>
            <label htmlFor="category" className={labelClass}>
              Category
            </label>
            <input
              id="category"
              type="text"
              placeholder="e.g., Software Engineering"
              className={inputClass}
              {...register("category", { required: "Category is required" })}
            />
            {errors.category && (
              <p className={errorClass}>{errors.category.message}</p>
            )}
            {/* {state.errors?.category && (
              <p className={errorClass}>{state.errors.category}</p>
            )} */}
          </div>
        </div>

        {/* Salary and Type */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Salary Minimum */}
          <div>
            <label htmlFor="salaryMin" className={labelClass}>
              Minimum Salary (USD)
            </label>
            <input
              id="salaryMin"
              type="number"
              min="0"
              placeholder="e.g., 80000"
              className={inputClass}
              {...register("salaryMin", {
                required: "Minimum Salary is required",
                valueAsNumber: true,
                min: { value: 0, message: "Salary must be non-negative" },
              })}
            />
            {errors.salaryMin && (
              <p className={errorClass}>{errors.salaryMin.message}</p>
            )}
            {/* {state.errors?.salaryMin && (
              <p className={errorClass}>{state.errors.salaryMin}</p>
            )} */}
          </div>

          {/* Salary Maximum */}
          <div>
            <label htmlFor="salaryMax" className={labelClass}>
              Maximum Salary (Optional)
            </label>
            <input
              id="salaryMax"
              type="number"
              min="0"
              placeholder="e.g., 120000"
              className={inputClass}
              {...register("salaryMax", {
                valueAsNumber: true,
                min: { value: 0, message: "Salary must be non-negative" },
              })}
            />
            {errors.salaryMax && (
              <p className={errorClass}>{errors.salaryMax.message}</p>
            )}
            {/* {state.errors?.salaryMax && (
              <p className={errorClass}>{state.errors.salaryMax}</p>
            )} */}
          </div>

          {/* Employment Type */}
          <div>
            <label htmlFor="employmentType" className={labelClass}>
              Employment Type
            </label>
            <select
              id="employmentType"
              className={inputClass}
              {...register("employmentType", {
                required: "Employment Type is required",
              })}
            >
              <option value="FULL_TIME">Full-Time</option>
              <option value="PART_TIME">Part-Time</option>
              <option value="CONTRACT">Contract</option>
              <option value="TEMPORARY">Temporary</option>
              <option value="INTERNSHIP">Internship</option>
            </select>
            {errors.employmentType && (
              <p className={errorClass}>{errors.employmentType.message}</p>
            )}
            {/* {state.errors?.employmentType && (
              <p className={errorClass}>{state.errors.employmentType}</p>
            )} */}
          </div>
        </div>

        {/* Location and Deadline */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Location */}
          <div>
            <label htmlFor="location" className={labelClass}>
              Location
            </label>
            <input
              id="location"
              type="text"
              placeholder="e.g., Remote or New York, NY"
              className={inputClass}
              {...register("location", { required: "Location is required" })}
            />
            {errors.location && (
              <p className={errorClass}>{errors.location.message}</p>
            )}
            {/* {state.errors?.location && (
              <p className={errorClass}>{state.errors.location}</p>
            )} */}
          </div>

          {/* Application Deadline */}
          <div>
            <label htmlFor="applicationDeadLine" className={labelClass}>
              Application Deadline
            </label>
            <input
              id="applicationDeadLine"
              type="date"
              className={inputClass}
              {...register("applicationDeadLine", {
                required: "Deadline is required",
              })}
            />
            {errors.applicationDeadLine && (
              <p className={errorClass}>{errors.applicationDeadLine.message}</p>
            )}
            {/* {state.errors?.applicationDeadLine && (
              <p className={errorClass}>{state.errors.applicationDeadLine}</p>
            )} */}
          </div>
        </div>

        {/* Address & Image URL */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Address (Optional) */}
          <div>
            <label htmlFor="address" className={labelClass}>
              Full Address (Optional)
            </label>
            <input
              id="address"
              type="text"
              placeholder="Full Street Address"
              className={inputClass}
              {...register("address")}
            />
            {/* {state.errors?.address && (
              <p className={errorClass}>{state.errors.address}</p>
            )} */}
          </div>
          {/* Image URL (Optional) */}
          <div>
            <label htmlFor="imageUrl" className={labelClass}>
              Image/Banner URL (Optional)
            </label>
            <input
              id="imageUrl"
              type="url"
              placeholder="e.g., https://yourcompany.com/job-banner.png"
              className={inputClass}
              {...register("imageUrl")}
            />
            {/* {state.errors?.imageUrl && (
              <p className={errorClass}>{state.errors.imageUrl}</p>
            )} */}
          </div>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className={labelClass}>
            Job Description
          </label>
          <textarea
            id="description"
            rows={5}
            placeholder="Provide a detailed description of the role and its context..."
            className={inputClass}
            {...register("description", {
              required: "Description is required",
            })}
          ></textarea>
          {errors.description && (
            <p className={errorClass}>{errors.description.message}</p>
          )}
          {/* {state.errors?.description && (
            <p className={errorClass}>{state.errors.description}</p>
          )} */}
        </div>

        {/* --- Responsibilities Section --- */}
        <div className="p-4 border rounded-lg ">
          <h3 className="text-xl font-bold mb-4 ">Responsibilities</h3>
          {responsibilityFields.map((field, index) => (
            <div
              key={field.id}
              className="flex gap-4 mb-3 items-end p-2 border-b border-gray-200"
            >
              <div className="flex-1">
                <label
                  htmlFor={`responsibilities.${index}.responsibility`}
                  className={labelClass}
                >
                  Responsibility {index + 1}
                </label>
                <input
                  {...register(
                    `responsibilities.${index}.responsibility` as const,
                    {
                      required: "Responsibility detail is required",
                    }
                  )}
                  className={inputClass}
                  placeholder="Enter a responsibility point"
                />
                {errors.responsibilities?.[index]?.responsibility && (
                  <p className={errorClass}>
                    {errors.responsibilities[index].responsibility.message}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor={`responsibilities.${index}.displayOrder`}
                  className={labelClass}
                >
                  Order
                </label>
                <input
                  type="number"
                  {...register(
                    `responsibilities.${index}.displayOrder` as const,
                    {
                      required: "Order is required",
                      valueAsNumber: true,
                    }
                  )}
                  className={`${inputClass} w-20 text-center`}
                  min="1"
                />
              </div>
              <button
                type="button"
                onClick={() => removeResponsibility(index)}
                className="h-10 w-10 bg-red-500  rounded-full flex items-center justify-center hover:bg-red-600 transition duration-150"
                aria-label="Remove Responsibility"
              >
                &times;
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              appendResponsibility({
                responsibility: "",
                displayOrder: responsibilityFields.length + 1,
              })
            }
            className={`${buttonClass} mt-3 flex items-center gap-2`}
          >
            + Add Responsibility
          </button>
        </div>

        {/* --- Requirements Section --- */}
        <div className="p-4 border rounded-lg ">
          <h3 className="text-xl font-bold mb-4 ">Requirements</h3>
          {requirementFields.map((field, index) => (
            <div
              key={field.id}
              className="flex gap-4 mb-3 items-end p-2 border-b border-gray-200"
            >
              <div className="flex-1">
                <label
                  htmlFor={`requirements.${index}.requirement`}
                  className={labelClass}
                >
                  Requirement {index + 1}
                </label>
                <input
                  {...register(`requirements.${index}.requirement` as const, {
                    required: "Requirement detail is required",
                  })}
                  className={inputClass}
                  placeholder="Enter a requirement point"
                />
                {errors.requirements?.[index]?.requirement && (
                  <p className={errorClass}>
                    {errors.requirements[index].requirement.message}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor={`requirements.${index}.displayOrder`}
                  className={labelClass}
                >
                  Order
                </label>
                <input
                  type="number"
                  {...register(`requirements.${index}.displayOrder` as const, {
                    required: "Order is required",
                    valueAsNumber: true,
                  })}
                  className={`${inputClass} w-20 text-center`}
                  min="1"
                />
              </div>
              <button
                type="button"
                onClick={() => removeRequirement(index)}
                className="h-10 w-10 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition duration-150"
                aria-label="Remove Requirement"
              >
                &times;
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              appendRequirement({
                requirement: "",
                displayOrder: requirementFields.length + 1,
              })
            }
            className={`${buttonClass} mt-3 flex items-center gap-2`}
          >
            + Add Requirement
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={pending}
          className="w-full py-3 px-4 bg-sky-600  font-semibold rounded-md hover:bg-sky-700 disabled:bg-sky-400 transition duration-150 mt-8"
        >
          {pending ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 "
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Posting Job...
            </span>
          ) : (
            "Post Job"
          )}
        </button>
      </form>
    </div>
  );
};

export default JobForm;
