"use client";

import { useActionState } from "react";
import { editProfile } from "./actions";

const EditEmployerForm = () => {
  const [state, actionsForm, pending] = useActionState(editProfile, {
    success: false,
    message: "blah",
  });
  console.log(state, "state");

  const mockCompanyData = {
    // Required fields
    companyName: "Innovatech Solutions Group",
    phone: "555-456-7890",

    // Dates and Numbers
    establishedDate: "2015-08-15",
    // establishedDate: new Date("2015-08-15"),
    postalcode: 90210,

    // Optional/Nullable strings
    govRegisteredNumber: "RGS-001234567-TX",
    companyEmail: "contact@innovatech.com",
    address: "456 Corporate Drive, Suite 100",
    city: "Palo Alto",
    state: "CA",
    country: "United States",
    webAddress: "https://www.innovatech.com",
    industry: "Technology and Software Development",
    companyDescription:
      "Innovatech Solutions Group is a leading provider of enterprise-level AI and cloud infrastructure solutions, specializing in scalable data analysis and automation tools.",
    logoUrl: "https://placehold.co/600x400/0F766E/white?text=Innovatech+Logo",
  };
  return (
    <div>
      <h1>EditEmployerForm</h1>
      <form action={actionsForm}>
        <input
          type="text"
          name="companyName"
          placeholder="companyName"
          className="p-2 m-1 border border-sky-400 text-sky-400"
          defaultValue={mockCompanyData.companyName}
        />
        <input
          type="text"
          name="govRegisteredNumber"
          placeholder="govRegisteredNumber"
          className="p-2 m-1 border border-sky-400 text-sky-400"
          defaultValue={mockCompanyData.govRegisteredNumber}
        />
        <input
          type="tel"
          name="phone"
          placeholder="phone"
          className="p-2 m-1 border border-sky-400 text-sky-400"
          defaultValue={mockCompanyData.phone}
        />
        <input
          type="date"
          name="establishedDate"
          placeholder="establishedDate"
          className="p-2 m-1 border border-sky-400 text-sky-400"
          defaultValue={mockCompanyData.establishedDate}
        />
        <input
          type="email"
          name="companyEmail"
          placeholder="companyEmail"
          className="p-2 m-1 border border-sky-400 text-sky-400"
          defaultValue={mockCompanyData.companyEmail}
        />
        <input
          type="text"
          name="address"
          placeholder="address"
          className="p-2 m-1 border border-sky-400 text-sky-400"
          defaultValue={mockCompanyData.address}
        />
        <input
          type="text"
          name="city"
          placeholder="city"
          className="p-2 m-1 border border-sky-400 text-sky-400"
          defaultValue={mockCompanyData.city}
        />
        <input
          type="text"
          name="state"
          placeholder="state"
          className="p-2 m-1 border border-sky-400 text-sky-400"
          defaultValue={mockCompanyData.state}
        />
        <input
          type="number"
          name="postalcode"
          placeholder="postalcode"
          className="p-2 m-1 border border-sky-400 text-sky-400"
          defaultValue={mockCompanyData.postalcode}
        />
        <input
          type="text"
          name="country"
          placeholder="country"
          className="p-2 m-1 border border-sky-400 text-sky-400"
          defaultValue={mockCompanyData.country}
        />
        <input
          type="text"
          name="webAddress"
          placeholder="webAddress"
          className="p-2 m-1 border border-sky-400 text-sky-400"
          defaultValue={mockCompanyData.webAddress}
        />
        <input
          type="text"
          name="industry"
          placeholder="industry"
          className="p-2 m-1 border border-sky-400 text-sky-400"
          defaultValue={mockCompanyData.industry}
        />
        <input
          type="text"
          name="companyDescription"
          placeholder="companyDescription"
          className="p-2 m-1 border border-sky-400 text-sky-400"
          defaultValue={mockCompanyData.companyDescription}
        />
        <input
          type="text"
          name="logoUrl"
          placeholder="logoUrl"
          className="p-2 m-1 border border-sky-400 text-sky-400"
          defaultValue={mockCompanyData.logoUrl}
        />
        <button
          // type="submit"
          className="p-2 m-1 text-sky text-xl"
          disabled={pending}
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default EditEmployerForm;
