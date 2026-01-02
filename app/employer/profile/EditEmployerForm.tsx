"use client";

import { useActionState } from "react";
import { editProfile } from "./actions";
import {
  Loader2,
  Building2,
  Globe,
  MapPin,
  Mail,
  Phone,
  Calendar,
} from "lucide-react";

const EditEmployerForm = () => {
  const [state, actionsForm, pending] = useActionState(editProfile, {
    success: false,
    message: "",
  });

  // Tip: In production, pass existing user data as props instead of a mock
  const mockCompanyData = {
    companyName: "Innovatech Solutions Group",
    phone: "555-456-7890",
    establishedDate: "2015-08-15",
    postalcode: 90210,
    govRegisteredNumber: "RGS-001234567-TX",
    companyEmail: "contact@innovatech.com",
    address: "456 Corporate Drive, Suite 100",
    city: "Palo Alto",
    state: "CA",
    country: "United States",
    webAddress: "https://www.innovatech.com",
    industry: "Technology and Software Development",
    companyDescription:
      "Innovatech Solutions Group is a leading provider of enterprise-level AI and cloud infrastructure solutions.",
    logoUrl: "https://placehold.co/600x400/0F766E/white?text=Innovatech+Logo",
  };

  return (
    <div className=" border rounded-xl w-full mt-10 shadow-lg overflow-hidden">
      <div className=" border-b px-6 py-4">
        <h2 className="text-xl font-bold  flex items-center gap-2">
          <Building2 className="w-5 h-5 text-sky-600" />
          Edit Company Profile
        </h2>
      </div>

      <form action={actionsForm} className="p-6 space-y-8">
        {/* Section: Basic Info */}
        <section>
          <h3 className="text-sm font-semibold  uppercase tracking-wider mb-4">
            Basic Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Company Name"
              name="companyName"
              defaultValue={mockCompanyData.companyName}
              icon={<Building2 />}
              required
            />
            <FormInput
              label="Industry"
              name="industry"
              defaultValue={mockCompanyData.industry}
            />
            <FormInput
              label="Registration Number"
              name="govRegisteredNumber"
              defaultValue={mockCompanyData.govRegisteredNumber}
            />
            <FormInput
              label="Established Date"
              name="establishedDate"
              type="date"
              defaultValue={mockCompanyData.establishedDate}
              icon={<Calendar />}
            />
          </div>
        </section>

        {/* Section: Contact & Online */}
        <section>
          <h3 className="text-sm font-semibold  uppercase tracking-wider mb-4">
            Contact & Web
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Business Email"
              name="companyEmail"
              type="email"
              defaultValue={mockCompanyData.companyEmail}
              icon={<Mail />}
            />
            <FormInput
              label="Phone Number"
              name="phone"
              type="tel"
              defaultValue={mockCompanyData.phone}
              icon={<Phone />}
            />
            <FormInput
              label="Website URL"
              name="webAddress"
              defaultValue={mockCompanyData.webAddress}
              icon={<Globe />}
            />
            <FormInput
              label="Logo URL"
              name="logoUrl"
              defaultValue={mockCompanyData.logoUrl}
            />
          </div>
        </section>

        {/* Section: Location */}
        <section>
          <h3 className="text-sm font-semibold  uppercase tracking-wider mb-4">
            Location
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-3">
              <FormInput
                label="Street Address"
                name="address"
                defaultValue={mockCompanyData.address}
                icon={<MapPin />}
              />
            </div>
            <FormInput
              label="City"
              name="city"
              defaultValue={mockCompanyData.city}
            />
            <FormInput
              label="State"
              name="state"
              defaultValue={mockCompanyData.state}
            />
            <FormInput
              label="Postal Code"
              name="postalcode"
              type="number"
              defaultValue={mockCompanyData.postalcode}
            />
            <FormInput
              label="Country"
              name="country"
              defaultValue={mockCompanyData.country}
            />
          </div>
        </section>

        {/* Section: Description */}
        <section>
          <h3 className="text-sm font-semibold  uppercase tracking-wider mb-4">
            Company Bio
          </h3>
          <textarea
            name="companyDescription"
            rows={4}
            className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all "
            defaultValue={mockCompanyData.companyDescription}
          />
        </section>

        {/* Form Actions */}
        <div className="flex items-center justify-between pt-6 border-t">
          <p
            className={`text-sm ${
              state?.success ? "text-emerald-600" : "text-amber-600"
            }`}
          >
            {state?.message !== "blah" && state?.message}
          </p>
          <button
            type="submit"
            disabled={pending}
            className="bg-sky-600 hover:bg-sky-700 text-white px-8 py-2.5 rounded-lg font-semibold transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {pending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

// Reusable Sub-component for inputs
const FormInput = ({ label, icon, ...props }: any) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-bold text-slate-600 ml-1">{label}</label>
    <div className="relative">
      {icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4">
          {icon}
        </div>
      )}
      <input
        {...props}
        className={`w-full p-2.5 rounded-lg border border-slate-200 bg-white text-slate-700 text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all ${
          icon ? "pl-10" : "pl-3"
        }`}
      />
    </div>
  </div>
);

export default EditEmployerForm;
// "use client";

// import { useActionState } from "react";
// import { editProfile } from "./actions";

// const EditEmployerForm = () => {
//   const [state, actionsForm, pending] = useActionState(editProfile, {
//     success: false,
//     message: "blah",
//   });

//   const mockCompanyData = {
//     // Required fields
//     companyName: "Innovatech Solutions Group",
//     phone: "555-456-7890",

//     // Dates and Numbers
//     establishedDate: "2015-08-15",
//     // establishedDate: new Date("2015-08-15"),
//     postalcode: 90210,

//     // Optional/Nullable strings
//     govRegisteredNumber: "RGS-001234567-TX",
//     companyEmail: "contact@innovatech.com",
//     address: "456 Corporate Drive, Suite 100",
//     city: "Palo Alto",
//     state: "CA",
//     country: "United States",
//     webAddress: "https://www.innovatech.com",
//     industry: "Technology and Software Development",
//     companyDescription:
//       "Innovatech Solutions Group is a leading provider of enterprise-level AI and cloud infrastructure solutions, specializing in scalable data analysis and automation tools.",
//     logoUrl: "https://placehold.co/600x400/0F766E/white?text=Innovatech+Logo",
//   };
//   return (
//     <div>
//       <h1>EditEmployerForm</h1>
//       <form action={actionsForm}>
//         <input
//           type="text"
//           name="companyName"
//           placeholder="companyName"
//           className="p-2 m-1 border border-sky-400 text-sky-400"
//           defaultValue={mockCompanyData.companyName}
//         />
//         <input
//           type="text"
//           name="govRegisteredNumber"
//           placeholder="govRegisteredNumber"
//           className="p-2 m-1 border border-sky-400 text-sky-400"
//           defaultValue={mockCompanyData.govRegisteredNumber}
//         />
//         <input
//           type="tel"
//           name="phone"
//           placeholder="phone"
//           className="p-2 m-1 border border-sky-400 text-sky-400"
//           defaultValue={mockCompanyData.phone}
//         />
//         <input
//           type="date"
//           name="establishedDate"
//           placeholder="establishedDate"
//           className="p-2 m-1 border border-sky-400 text-sky-400"
//           defaultValue={mockCompanyData.establishedDate}
//         />
//         <input
//           type="email"
//           name="companyEmail"
//           placeholder="companyEmail"
//           className="p-2 m-1 border border-sky-400 text-sky-400"
//           defaultValue={mockCompanyData.companyEmail}
//         />
//         <input
//           type="text"
//           name="address"
//           placeholder="address"
//           className="p-2 m-1 border border-sky-400 text-sky-400"
//           defaultValue={mockCompanyData.address}
//         />
//         <input
//           type="text"
//           name="city"
//           placeholder="city"
//           className="p-2 m-1 border border-sky-400 text-sky-400"
//           defaultValue={mockCompanyData.city}
//         />
//         <input
//           type="text"
//           name="state"
//           placeholder="state"
//           className="p-2 m-1 border border-sky-400 text-sky-400"
//           defaultValue={mockCompanyData.state}
//         />
//         <input
//           type="number"
//           name="postalcode"
//           placeholder="postalcode"
//           className="p-2 m-1 border border-sky-400 text-sky-400"
//           defaultValue={mockCompanyData.postalcode}
//         />
//         <input
//           type="text"
//           name="country"
//           placeholder="country"
//           className="p-2 m-1 border border-sky-400 text-sky-400"
//           defaultValue={mockCompanyData.country}
//         />
//         <input
//           type="text"
//           name="webAddress"
//           placeholder="webAddress"
//           className="p-2 m-1 border border-sky-400 text-sky-400"
//           defaultValue={mockCompanyData.webAddress}
//         />
//         <input
//           type="text"
//           name="industry"
//           placeholder="industry"
//           className="p-2 m-1 border border-sky-400 text-sky-400"
//           defaultValue={mockCompanyData.industry}
//         />
//         <input
//           type="text"
//           name="companyDescription"
//           placeholder="companyDescription"
//           className="p-2 m-1 border border-sky-400 text-sky-400"
//           defaultValue={mockCompanyData.companyDescription}
//         />
//         <input
//           type="text"
//           name="logoUrl"
//           placeholder="logoUrl"
//           className="p-2 m-1 border border-sky-400 text-sky-400"
//           defaultValue={mockCompanyData.logoUrl}
//         />
//         <button
//           // type="submit"
//           className="p-2 m-1 text-sky text-xl"
//           disabled={pending}
//         >
//           Submit
//         </button>
//       </form>
//     </div>
//   );
// };

// export default EditEmployerForm;
