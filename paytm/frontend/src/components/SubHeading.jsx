import React from "react";

export function SubHeading({ label, text }) {
  const content = label || text || "";
  return (
    <p className="text-slate-500 text-sm pt-1 pb-4 leading-relaxed max-w-sm mx-auto">
      {content}
    </p>
  );
}