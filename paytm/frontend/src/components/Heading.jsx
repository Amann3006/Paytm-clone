import React from "react";

export function Heading({ text, label }) {
  const content = text || label || "";
  return (
    <h1 className="font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight pt-2">
      {content}
    </h1>
  );
}