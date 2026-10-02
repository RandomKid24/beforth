import React from 'react';

/** The label / headline / note block that opens each section. */
export default function SectionHead({ label, title, note }: { label: string; title: React.ReactNode; note?: string }) {
  return (
    <div className="mb-10 md:mb-14">
      <div className="rule mb-6" />
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
        <div>
          <span className="label block mb-4">{label}</span>
          <h2 className="display-lg text-[clamp(1.8rem,4.2vw,3.2rem)] max-w-[20ch]">{title}</h2>
        </div>
        {note && <p className="body max-w-sm lg:text-right">{note}</p>}
      </div>
    </div>
  );
}
