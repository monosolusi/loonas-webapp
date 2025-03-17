import React from "react";

export function Label({ title, description, htmlFor }: { title: string, description?: string, htmlFor?: string }) {
  return (
    <>
      <label htmlFor={htmlFor} className="text-sm/6 font-semibold text-gray-900">
        {title}
      </label>
      {description && (
        <p className="mt-1 text-sm/6 text-gray-500">
          {description}
        </p>
      )}
    </>
  );
}