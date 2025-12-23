"use client";

import { useActionState } from "react";
import { updateStatus } from "./actions";

const form = () => {
  const [state, action, pending] = useActionState(updateStatus, null);
  return <div></div>;
};

export default form;
