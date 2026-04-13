"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { useLocation } from "react-router-dom"

type CursorType = "arrow-pointer" | "big-circle" | "ring-dot" | "circle-and-dot" | "glitch-effect" | "motion-blur"

interface CustomCursorProps {
  cursorType?: CursorType
  color?: string
  size?: number
  glitchColorB?: string
  glitchColorR?: string
}

export function CustomCursor({
  cursorType = "arrow-pointer",
  color = "#0F172A",
  size = 20,
  glitchColorB = "#2563EB",
  glitchColorR = "#F8FAFC",
}: CustomCursorProps) {
  const cursorRef = useRef<HTMLDivElement>(null)
  const secondaryCursorRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)
  const location = useLocation()
  
  const [isVisible, setIsVisible] = useState(false)
  const [isHovering, setIsHovering] = useState(false)

  const posState = useRef({
    x: 0,
    y: 0,
    lastX: 0,
    lastY: 0,
    distanceX: 0,
    distanceY: 0,
    distance: 0,
    angle: 0,
    angleDisplace: 0,
    degrees: 57.296,
    scale: 1,
    targetScale: 1
  })

  // Reset hover state when changing pages
  useEffect(() => {
    setIsHovering(false)
  }, [location.pathname])

  const calculateRotation = useCallback(() => {
    const state = posState.current
    if (state.distance <= 1) return state.angleDisplace

    const unsortedAngle = Math.atan(Math.abs(state.distanceY) / Math.abs(state.distanceX)) * state.degrees
    const previousAngle = state.angle

    if (state.distanceX <= 0 && state.distanceY >= 0) {
      state.angle = 90 - unsortedAngle + 0
    } else if (state.distanceX < 0 && state.distanceY < 0) {
      state.angle = unsortedAngle + 90
    } else if (state.distanceX >= 0 && state.distanceY <= 0) {
      state.angle = 90 - unsortedAngle + 180
    } else if (state.distanceX > 0 && state.distanceY > 0) {
      state.angle = unsortedAngle + 270
    }

    if (isNaN(state.angle)) {
      state.angle = previousAngle
    } else {
      if (state.angle - previousAngle <= -270) {
        state.angleDisplace += 360 + state.angle - previousAngle
      } else if (state.angle - previousAngle >= 270) {
        state.angleDisplace += state.angle - previousAngle - 360
      } else {
        state.angleDisplace += state.angle - previousAngle
      }
    }

    return state.angleDisplace
  }, [])

  useEffect(() => {
    let rafId: number

    const updateCursor = () => {
      const state = posState.current
      
      // Smoothly interpolate scale for click effect
      state.scale += (state.targetScale - state.scale) * 0.2

      if (cursorRef.current) {
        const rotation = calculateRotation()
        const offset = cursorType === "arrow-pointer" ? size / 2 : 0
        
        if (cursorType === "arrow-pointer" || cursorType === "circle-and-dot") {
          const offsetX = cursorType === "arrow-pointer" ? offset : size / 2
          const offsetY = cursorType === "arrow-pointer" ? 0 : size / 2
          cursorRef.current.style.transform = `translate3d(${state.x - offsetX}px, ${state.y - offsetY}px, 0) rotate(${rotation}deg) scale(${state.scale})`
        } else {
          const currentSize = isHovering ? (cursorType === "glitch-effect" ? 30 : size * 2.5) : (cursorType === "glitch-effect" ? 15 : size)
          const finalSize = cursorType === "ring-dot" ? (isHovering ? 40 : size) : currentSize
          cursorRef.current.style.transform = `translate3d(${state.x - finalSize / 2}px, ${state.y - finalSize / 2}px, 0) scale(${state.scale})`
        }

        // Apply special effects
        if (cursorType === "glitch-effect") {
          const dx = Math.min(Math.max(state.distanceX, -10), 10)
          const dy = Math.min(Math.max(state.distanceY, -10), 10)
          cursorRef.current.style.boxShadow = `${dx}px ${dy}px 0 ${glitchColorB}, ${-dx}px ${-dy}px 0 ${glitchColorR}`
        }

        if (cursorType === "circle-and-dot") {
          cursorRef.current.style.boxShadow = `0 ${-15 - state.distance}px 0 -8px ${color}`
        }
      }

      if (secondaryCursorRef.current) {
        const sSize = size * 2.5
        secondaryCursorRef.current.style.transform = `translate3d(${state.x - sSize / 2}px, ${state.y - sSize / 2}px, 0) scale(${isHovering ? 2.5 * state.scale : 1 * state.scale})`
      }

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${state.x - 3}px, ${state.y - 3}px, 0) scale(${state.scale})`
      }

      rafId = requestAnimationFrame(updateCursor)
    }

    const handleMouseMove = (event: MouseEvent) => {
      const state = posState.current
      state.distanceX = state.lastX - event.clientX
      state.distanceY = state.lastY - event.clientY
      state.distance = Math.sqrt(state.distanceY ** 2 + state.distanceX ** 2)
      
      state.x = event.clientX
      state.y = event.clientY
      state.lastX = event.clientX
      state.lastY = event.clientY

      if (!isVisible) setIsVisible(true)

      const target = event.target as HTMLElement
      const isInteractive =
        target.closest("a, button") ||
        target.onclick !== null ||
        target.classList.contains("cursor-hover") ||
        target.closest(".hover-target")
      
      if (!!isInteractive !== isHovering) {
        setIsHovering(!!isInteractive)
      }
    }

    const handleMouseDown = () => { posState.current.targetScale = 0.75 }
    const handleMouseUp = () => { posState.current.targetScale = 1 }
    const handleMouseLeave = () => setIsVisible(false)
    const handleMouseEnter = () => setIsVisible(true)

    window.addEventListener("mousemove", handleMouseMove, { passive: true })
    window.addEventListener("mousedown", handleMouseDown)
    window.addEventListener("mouseup", handleMouseUp)
    document.addEventListener("mouseleave", handleMouseLeave)
    document.addEventListener("mouseenter", handleMouseEnter)

    rafId = requestAnimationFrame(updateCursor)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mousedown", handleMouseDown)
      window.removeEventListener("mouseup", handleMouseUp)
      document.removeEventListener("mouseleave", handleMouseLeave)
      document.removeEventListener("mouseenter", handleMouseEnter)
      cancelAnimationFrame(rafId)
    }
  }, [cursorType, isVisible, size, color, glitchColorB, glitchColorR, isHovering, calculateRotation])

  const getBaseStyle = (customSize = size): React.CSSProperties => ({
    position: "fixed",
    top: 0,
    left: 0,
    zIndex: 999999,
    pointerEvents: "none",
    userSelect: "none",
    opacity: isVisible ? 1 : 0,
    width: `${customSize}px`,
    height: `${customSize}px`,
    transition: "opacity 0.2s ease", // Removed transform transition to stop rubberbanding
    willChange: "transform",
  })

  if (cursorType === "big-circle") {
    return (
      <>
        <div
          ref={secondaryCursorRef}
          style={{
            ...getBaseStyle(size * 2.5),
            backgroundColor: "transparent",
            borderRadius: "50%",
            backdropFilter: "invert(0.85) grayscale(1)",
          }}
        />
        <div
          ref={dotRef}
          style={{
            ...getBaseStyle(6),
            backgroundColor: "transparent",
            borderRadius: "50%",
            backdropFilter: "invert(1)",
          }}
        />
      </>
    )
  }

  if (cursorType === "ring-dot") {
    return (
      <div
        ref={cursorRef}
        style={{
          ...getBaseStyle(isHovering ? 40 : size),
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "transparent",
          boxShadow: `0 0 0 1.25px ${color}, 0 0 0 2.25px #2563EB`,
          borderRadius: "50%",
        }}
      >
        <div
          style={{
            width: "4px",
            height: "4px",
            backgroundColor: color,
            boxShadow: "0 0 0 1px #2563EB",
            borderRadius: "50%",
          }}
        />
      </div>
    )
  }

  if (cursorType === "circle-and-dot") {
    return (
      <div
        ref={cursorRef}
        style={{
          ...getBaseStyle(),
          backgroundColor: "transparent",
          border: isHovering ? `10px solid ${color}` : `1.25px solid ${color}`,
          borderRadius: "50%",
        }}
      />
    )
  }

  if (cursorType === "glitch-effect") {
    return (
      <div
        ref={cursorRef}
        style={{
          ...getBaseStyle(isHovering ? 30 : 15),
          backgroundColor: "#222",
          borderRadius: "50%",
          backdropFilter: "invert(1)",
        }}
      />
    )
  }

  return (
    <div
      ref={cursorRef}
      style={{
        ...getBaseStyle(),
      }}
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" style={{ width: "100%", height: "100%" }}>
        <path
          d="M25,30a5.82,5.82,0,0,1-1.09-.17l-.2-.07-7.36-3.48a.72.72,0,0,0-.35-.08.78.78,0,0,0-.33.07L8.24,29.54a.66.66,0,0,1-.2.06,5.17,5.17,0,0,1-1,.15,3.6,3.6,0,0,1-3.29-5L12.68,4.2a3.59,3.59,0,0,1,6.58,0l9,20.74A3.6,3.6,0,0,1,25,30Z"
          fill="#F2F5F8"
        />
        <path
          d="M16,3A2.59,2.59,0,0,1,18.34,4.6l9,20.74A2.59,2.59,0,0,1,25,29a5.42,5.42,0,0,1-.86-.15l-7.37-3.48a1.84,1.84,0,0,0-.77-.17,1.69,1.69,0,0,0-.73.16l-7.4,3.31a5.89,5.89,0,0,1-.79.12,2.59,2.59,0,0,1-2.37-3.62L13.6,4.6A2.58,2.58,0,0,1,16,3m0-2h0A4.58,4.58,0,0,0,11.76,3.8L2.84,24.33A4.58,4.58,0,0,0,7,30.75a6.08,6.08,0,0,0,1.21-.17,1.87,1.87,0,0,0,.4-.13L16,27.18l7.29,3.44a1.64,1.64,0,0,0,.39.14A6.37,6.37,0,0,0,25,31a4.59,4.59,0,0,0,4.21-6.41l-9-20.75A4.62,4.62,0,0,0,16,1Z"
          fill={color}
        />
      </svg>
    </div>
  )
}
