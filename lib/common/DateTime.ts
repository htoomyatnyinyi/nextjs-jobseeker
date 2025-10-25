// // 1. Get the date value directly (it will be a Date object or null)
// const dateOfBirthPrisma = data?.jobSeekerProfile?.dateOfBirth;

// // 2. Conditionally process the date only if it exists
// const dateOnly = dateOfBirthPrisma
//   ? new Date(dateOfBirthPrisma).toISOString().split("T")[0] // If valid, format it
//   : ""; // If null, set it to an empty string

export const DateFilter = ({ date }: any) => {
  // 1. Get the date value directly (it will be a Date object or null)
  //   const dateOfBirthPrisma = date;

  // 2. Conditionally process the date only if it exists
  const dateOnly = date
    ? new Date(date).toISOString().split("T")[0] // If valid, format it
    : ""; // If null, set it to an empty string
  return dateOnly;
};
