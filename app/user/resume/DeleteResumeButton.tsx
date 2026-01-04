"use client";

import { useTransition } from "react";
import { deleteResumeAction } from "./action";

const DeleteResumeButton = ({ id }: { id: string }) => {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this resume?")) {
      startTransition(async () => {
        const result = await deleteResumeAction(id);
        if (!result.success) {
          alert(result.message);
        }
      });
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className={`text-xs p-2 rounded-lg transition-colors ${
        isPending
          ? "bg-gray-100 text-gray-400"
          : "bg-red-50 text-red-600 hover:bg-red-600 hover:text-white"
      }`}
    >
      {isPending ? "Deleting..." : "🗑️ Delete"}
    </button>
  );
};

export default DeleteResumeButton;
