import React from "react";

export function DetailLineItem({ title, description }: { title: string, description: string }) {
  return (
    <div className="mb-4">
      <h3 className="text-xs font-medium text-gray-500">{title}</h3>
      <p className="text-sm font-black text-gray-900">{description}</p>
    </div>
  );
}