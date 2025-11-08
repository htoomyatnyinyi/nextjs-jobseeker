// app/jobs/_components/SearchFilterBar.tsx
"use client";
import { useRouter } from "next/navigation";
import { useCallback, useRef } from "react";

function useDebouncedCallback<T extends (...args: any[]) => void>(
  callback: T,
  delay: number
) {
  const timer = useRef<number | null>(null);
  return useCallback(
    (...args: Parameters<T>) => {
      if (timer.current) {
        window.clearTimeout(timer.current);
      }
      timer.current = window.setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );
}

export default function SearchFilterBar({
  initialQuery,
}: {
  initialQuery?: string;
}) {
  const router = useRouter();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams();
    if (term) params.set("q", term);
    router.push(`/jobs?${params}`);
  }, 400);

  return (
    <div className="mb-10">
      <input
        type="text"
        defaultValue={initialQuery}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search jobs by title, company, skill..."
        className="w-full p-2 m-1 border rounded-lg border-gray-300 focus:border-sky-500 focus:ring-4 focus:ring-sky-100 outline-none text-lg"
        // className="w-full px-6 py-4 rounded-xl border border-gray-300 focus:border-sky-500 focus:ring-4 focus:ring-sky-100 outline-none text-lg"
      />
    </div>
  );
}
