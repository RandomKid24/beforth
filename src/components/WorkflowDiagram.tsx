import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useActiveInView } from '../lib/useActiveInView';

const NODES = [
  { id: 'sales', label: 'Sales', sub: 'Orders · Quotes', angle: -90 },
  { id: 'inventory', label: 'Inventory', sub: 'Stock · Stores', angle: -18 },
  { id: 'finance', label: 'Finance', sub: 'Invoices · MIS', angle: 54 },
  { id: 'people', label: 'People', sub: 'HR · Attendance', angle: 126 },
  { id: 'service', label: 'Service', sub: 'AMC · Tickets', angle: 198 },
];

const RADIUS = 205;
const CENTER = 280;

function pointAt(angle: number, radius: number) {
  const rad = (angle * Math.PI) / 180;
  return { x: CENTER + radius * Math.cos(rad), y: CENTER + radius * Math.sin(rad) };
}

export default function WorkflowDiagram() {
  const rootRef = useRef<SVGSVGElement>(null);
  const { ref: viewRef, active } = useActiveInView<HTMLDivElement>();
  const [hovered, setHovered] = useState<string | null>(null);
  const [hoverActive, setHoverActive] = useState<string | null>(null);

  useEffect(() => {
    if (!rootRef.current) return;
    const ctx = gsap.context(() => {
      const paths = gsap.utils.toArray<SVGPathElement>('.wf-link');
      gsap.set(paths, { strokeDasharray: 400, strokeDashoffset: 400 });
      gsap.to(paths, {
        strokeDashoffset: 0,
        duration: 1.1,
        ease: 'power2.inOut',
        stagger: 0.12,
        delay: 0.25,
      });

      gsap.fromTo(
        '.wf-node',
        { scale: 0, transformOrigin: 'center center', opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.7, ease: 'back.out(1.7)', stagger: 0.1, delay: 0.55 }
      );

      gsap.fromTo(
        '.wf-core',
        { scale: 0.6, opacity: 0, transformOrigin: 'center center' },
        { scale: 1, opacity: 1, duration: 0.9, ease: 'back.out(1.5)', delay: 0.15 }
      );
    }, rootRef);

    return () => ctx.revert();
  }, []);

  // The travelling particles are SMIL, not CSS, so they are paused through
  // the SVG's own API rather than animation-play-state.
  useEffect(() => {
    const svg = rootRef.current;
    if (!svg) return;
    if (active) svg.unpauseAnimations();
    else svg.pauseAnimations();
  }, [active]);

  return (
    <div ref={viewRef} className="relative w-full">
      <svg
        ref={rootRef}
        viewBox="0 0 560 560"
        className="w-full h-auto overflow-visible"
        role="img"
        aria-label="Diagram showing business modules — sales, inventory, finance, people and service — connected into one integrated system by BeForth"
      >
        <g className="wf-ring">
          <circle
            cx={CENTER}
            cy={CENTER}
            r="92"
            fill="none"
            stroke="rgba(35,31,32,0.10)"
            strokeWidth="1"
            strokeDasharray="3 7"
            className="spin-slow"
            style={{ transformOrigin: `${CENTER}px ${CENTER}px` }}
          />
        </g>

        {NODES.map((node, i) => {
          const p = pointAt(node.angle, RADIUS);
          const isActive = hovered === node.id;
          const isDimmed = hovered !== null && !isActive;
          const pathId = `wf-path-${node.id}`;

          return (
            <g key={node.id}>
              <path
                id={pathId}
                d={`M ${p.x} ${p.y} L ${CENTER} ${CENTER}`}
                className="wf-link"
                fill="none"
                stroke={isActive ? '#1C75BC' : 'rgba(35,31,32,0.18)'}
                strokeWidth={isActive ? 1.75 : 1}
                style={{ transition: 'stroke 300ms ease, stroke-width 300ms ease' }}
              />

              <circle className="wf-particle" r="3" fill="#1C75BC" opacity={isDimmed ? 0.12 : 0.85}>
                <animateMotion dur={`${2.6 + i * 0.28}s`} repeatCount="indefinite" begin={`${i * 0.5}s`} rotate="auto">
                  <mpath href={`#${pathId}`} />
                </animateMotion>
              </circle>

              <g
                className="wf-node"
                onMouseEnter={() => setHovered(node.id)}
                onMouseLeave={() => setHovered(null)}
                style={{ cursor: 'pointer' }}
              >
                <circle
                  cx={p.x}
                  cy={p.y}
                  r="42"
                  fill="#F2F7F9"
                  stroke={isActive ? '#1C75BC' : 'rgba(35,31,32,0.20)'}
                  strokeWidth={isActive ? 1.75 : 1}
                  style={{ transition: 'stroke 300ms ease, stroke-width 300ms ease' }}
                />
                <circle
                  cx={p.x}
                  cy={p.y}
                  r="3.5"
                  fill={isActive ? '#1C75BC' : 'rgba(35,31,32,0.45)'}
                  style={{ transition: 'fill 300ms ease' }}
                />
                <text
                  x={p.x}
                  y={p.y + 62}
                  textAnchor="middle"
                  fontFamily="JetBrains Mono, monospace"
                  fontSize="12"
                  letterSpacing="1.4"
                  fill={isActive ? '#231F20' : '#6D737F'}
                  style={{ transition: 'fill 300ms ease', textTransform: 'uppercase' }}
                >
                  {node.label.toUpperCase()}
                </text>
                <text
                  x={p.x}
                  y={p.y + 78}
                  textAnchor="middle"
                  fontFamily="JetBrains Mono, monospace"
                  fontSize="9.5"
                  letterSpacing="0.6"
                  fill="#6D737F"
                  opacity="0.65"
                >
                  {node.sub}
                </text>
              </g>
            </g>
          );
        })}

        <g className="wf-core">
          <circle cx={CENTER} cy={CENTER} r="62" fill="#231F20" />
          <circle cx={CENTER} cy={CENTER} r="62" fill="none" stroke="#1C75BC" strokeWidth="1" opacity="0.6" />
          <text
            x={CENTER}
            y={CENTER - 2}
            textAnchor="middle"
            fontFamily="Familjen Grotesk, sans-serif"
            fontWeight="700"
            fontSize="27"
            fill="#F2F7F9"
          >
            Beforth
          </text>
          <text
            x={CENTER}
            y={CENTER + 22}
            textAnchor="middle"
            fontFamily="JetBrains Mono, monospace"
            fontSize="8.5"
            letterSpacing="2.4"
            fill="#1C75BC"
          >
            ONE SYSTEM
          </text>
        </g>
      </svg>
    </div>
  );
}
