"use client"

import { CustomCursor } from "@/components/ui/custom-cursor"
import { useState } from "react"

type CursorType = "arrow-pointer" | "big-circle" | "ring-dot" | "circle-and-dot" | "glitch-effect" | "motion-blur"

export default function DemoCustomCursor() {
  const [currentCursor, setCurrentCursor] = useState<CursorType>("arrow-pointer")

  const cursorTypes: { type: CursorType; name: string; description: string }[] = [
    { type: "arrow-pointer", name: "Arrow Pointer", description: "Rotating arrow that follows movement direction" },
    { type: "big-circle", name: "Big Circle", description: "Large circle with backdrop filter effects" },
    { type: "ring-dot", name: "Ring Dot", description: "Ring with center dot that expands on hover" },
    { type: "circle-and-dot", name: "Circle & Dot", description: "Circle with rotating trailing dot" },
    { type: "glitch-effect", name: "Glitch Effect", description: "Cursor with colorful glitch shadows" },
    { type: "motion-blur", name: "Motion Blur", description: "Cursor with directional motion blur" },
  ]

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans">
      <CustomCursor cursorType={currentCursor} size={20} glitchColorB="#2563EB" glitchColorR="#F8FAFC" />
      
      <div className="max-w-4xl mx-auto py-20 px-6">
        <header className="mb-12 text-center">
            <h1 className="text-4xl font-bold font-display uppercase tracking-tighter mb-4">Interactive Custom Cursors</h1>
            <p className="text-[#64748B] font-mono text-sm tracking-widest uppercase">Select a variant to test the interaction</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cursorTypes.map((cursor) => (
            <button
              key={cursor.type}
              onClick={() => setCurrentCursor(cursor.type)}
              className={`cursor-hover text-start w-full border p-8 rounded-2xl transition-all duration-300 group hover:border-[#0F172A] ${
                currentCursor === cursor.type ? "border-[#0F172A] bg-white ring-2 ring-[#0F172A]/5" : "border-slate-200 bg-white"
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-2xl font-display group-hover:text-[#2563EB] transition-colors">
                    {cursor.name}
                </h3>
                {currentCursor === cursor.type && (
                  <div className="w-2 h-2 rounded-full bg-[#2563EB] animate-pulse" />
                )}
              </div>
              <p className="text-sm text-[#64748B] leading-relaxed">
                {cursor.description}
              </p>
            </button>
          ))}
        </div>

        <div className="mt-20 p-12 border-2 border-dashed border-slate-200 rounded-3xl text-center">
            <p className="text-slate-400 font-medium italic">Hover over this section or any button to see the interaction effect.</p>
            <div className="mt-6 flex justify-center gap-4">
                <button className="cursor-hover px-6 py-3 bg-[#0F172A] text-white rounded-full text-sm font-bold uppercase tracking-widest hover:scale-105 transition-transform">
                    Interactive Button
                </button>
                <a href="#" className="cursor-hover px-6 py-3 border border-[#0F172A] rounded-full text-sm font-bold uppercase tracking-widest hover:bg-[#0F172A] hover:text-white transition-all">
                    External Link
                </a>
            </div>
        </div>
      </div>
    </div>
  )
}
