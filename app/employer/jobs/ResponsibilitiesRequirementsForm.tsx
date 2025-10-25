"use client";
import { startTransition, useActionState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { jobPostArr } from "./action";

// Define the form data type
type FormData = {
  responsibilities: { responsibility: string; displayOrder: number }[];
  requirements: { requirement: string; displayOrder: number }[];
};

const ResponsibilitiesRequirementsForm = () => {
  // Initialize react-hook-form
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      responsibilities: [{ responsibility: "", displayOrder: 1 }],
      requirements: [{ requirement: "", displayOrder: 1 }],
    },
  });

  // Initialize useFieldArray for dynamic lists
  const {
    fields: responsibilityFields,
    append: appendResponsibility,
    remove: removeResponsibility,
  } = useFieldArray({
    control,
    name: "responsibilities",
  });

  const {
    fields: requirementFields,
    append: appendRequirement,
    remove: removeRequirement,
  } = useFieldArray({
    control,
    name: "requirements",
  });

  // Initialize useActionState
  const [state, actionForm, pending] = useActionState(jobPostArr, {
    success: false,
    message: "",
    errors: {},
  });

  // // Handle form submission
  // const onSubmit = async (data: FormData) => {
  //   const formData = new FormData();
  //   formData.append("responsibilities", JSON.stringify(data.responsibilities));
  //   formData.append("requirements", JSON.stringify(data.requirements));
  //   // formData.append("employerId", "mock-employer-id"); // Hardcoded for simplicity
  //   actionForm(formData);
  //   // console.log(formData, "formdata");
  // };

  // ...

  // Handle form submission
  const onSubmit = (data: FormData) => {
    // NOTE: async is not strictly needed here unless you await other things
    const formData = new FormData();
    formData.append("responsibilities", JSON.stringify(data.responsibilities));
    formData.append("requirements", JSON.stringify(data.requirements));

    // 👇 FIX: Wrap the action call in startTransition
    startTransition(() => {
      actionForm(formData);
    });
  };

  // Styling classes
  const inputClass = "w-full p-2 border border-gray-300 rounded-md";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";
  const errorClass = "text-sm text-red-500 mt-1";
  const buttonClass = "p-2 bg-blue-500 text-white rounded hover:bg-blue-600";

  return (
    <div className="max-w-3xl mx-auto p-6  shadow-xl rounded-lg">
      <h2 className="text-2xl font-bold mb-6">
        Responsibilities & Requirements
      </h2>

      {/* Feedback Message */}
      {state.message && (
        <div
          className={`p-3 mb-4 rounded-md ${
            state.success
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {state.message}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Responsibilities */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Responsibilities</h3>
          {responsibilityFields.map((field, index) => (
            <div key={field.id} className="flex gap-2 mb-2">
              <div className="flex-1">
                <label
                  htmlFor={`responsibilities.${index}.responsibility`}
                  className={labelClass}
                >
                  Responsibility {index + 1}
                </label>
                <input
                  {...register(`responsibilities.${index}.responsibility`, {
                    required: "Responsibility is required",
                  })}
                  className={inputClass}
                  placeholder="Enter a responsibility"
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
                  {...register(`responsibilities.${index}.displayOrder`, {
                    required: "Display order is required",
                    valueAsNumber: true,
                  })}
                  className={`${inputClass} w-20`}
                  defaultValue={index + 1}
                />
                {errors.responsibilities?.[index]?.displayOrder && (
                  <p className={errorClass}>
                    {errors.responsibilities[index].displayOrder.message}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => removeResponsibility(index)}
                className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Remove
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
            className={buttonClass}
          >
            Add Responsibility
          </button>
        </div>

        {/* Requirements */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Requirements</h3>
          {requirementFields.map((field, index) => (
            <div key={field.id} className="flex gap-2 mb-2">
              <div className="flex-1">
                <label
                  htmlFor={`requirements.${index}.requirement`}
                  className={labelClass}
                >
                  Requirement {index + 1}
                </label>
                <input
                  {...register(`requirements.${index}.requirement`, {
                    required: "Requirement is required",
                  })}
                  className={inputClass}
                  placeholder="Enter a requirement"
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
                  {...register(`requirements.${index}.displayOrder`, {
                    required: "Display order is required",
                    valueAsNumber: true,
                  })}
                  className={`${inputClass} w-20`}
                  defaultValue={index + 1}
                />
                {errors.requirements?.[index]?.displayOrder && (
                  <p className={errorClass}>
                    {errors.requirements[index].displayOrder.message}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => removeRequirement(index)}
                className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Remove
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
            className={buttonClass}
          >
            Add Requirement
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={pending}
          className="w-full py-3 px-4 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 disabled:bg-green-400"
        >
          {pending ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default ResponsibilitiesRequirementsForm;
