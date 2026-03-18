"use client"

import { CustomCursor } from "./ui/custom-cursor";
import { useState } from "react" 

type CursorType = "arrow-pointer" | "big-circle" | "ring-dot" | "circle-and-dot" | "glitch-effect" | "motion-blur"

export default function DemoOne() {
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
    <div >
      <CustomCursor
        cursorType={currentCursor} 
        size={20}
        glitchColorB="#00feff"
        glitchColorR="#ff4f71"
      /> 
      <div> 
        <div className="flex flex-wrap m-6 justify-center gap-3">
          {cursorTypes.map((cursor) => (
            <button
              key={cursor.type}
              onClick={() => setCurrentCursor(cursor.type)}
              className="cursor-hover text-start w-full max-w-80 border p-6 rounded-xl" >
              <h3 className="font-bold text-xl">
                {cursor.name}
              </h3>
              <p className="text-sm text-primary/60">
                {cursor.description}
              </p>
            </button>
          ))}
        </div> 
      </div>
    </div>
  )
}
