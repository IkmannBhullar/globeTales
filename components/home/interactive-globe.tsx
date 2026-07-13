"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Globe2, MapPin, Plane } from "lucide-react";
import { useRef, useState } from "react";

import { floatingDestinations } from "@/lib/content/site";

export function InteractiveGlobe() {
  const [rotation, setRotation] = useState({ x: -10, y: 18 });
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const reducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const shiftX = useTransform(scrollYProgress, [0, 0.5, 1], [0, -120, -220]);
  const shiftY = useTransform(scrollYProgress, [0, 0.5, 1], [0, 20, 80]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.92, 0.82]);

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    setDragStart({ x: event.clientX, y: event.clientY });
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!dragStart || reducedMotion) {
      return;
    }

    const deltaX = event.clientX - dragStart.x;
    const deltaY = event.clientY - dragStart.y;
    setDragStart({ x: event.clientX, y: event.clientY });
    setRotation((current) => ({
      x: Math.max(-30, Math.min(18, current.x - deltaY * 0.12)),
      y: current.y + deltaX * 0.2
    }));
  }

  function stopDragging() {
    setDragStart(null);
  }

  return (
    <motion.div
      ref={containerRef}
      style={reducedMotion ? undefined : { x: shiftX, y: shiftY, scale }}
      className="relative mx-auto aspect-square w-full max-w-[34rem]"
    >
      <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,0.68),rgba(255,255,255,0.04)_34%,transparent_62%)] blur-2xl" />
      <div className="absolute left-[-5%] top-[10%] h-20 w-28 rounded-full bg-white/45 blur-2xl dark:bg-sky-200/10" />
      <div className="absolute right-[4%] top-[12%] h-16 w-24 rounded-full bg-white/35 blur-2xl dark:bg-slate-200/10" />
      <motion.div
        className="relative h-full cursor-grab select-none active:cursor-grabbing"
        animate={reducedMotion ? undefined : { rotate: [0, 0.4, -0.4, 0] }}
        transition={{ duration: 16, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={stopDragging}
        onPointerLeave={stopDragging}
      >
        <div className="absolute inset-[8%] rounded-full border border-white/25 bg-[radial-gradient(circle_at_35%_30%,rgba(182,232,255,0.95),rgba(54,113,154,0.95)_46%,rgba(10,30,64,0.98)_78%)] shadow-[0_35px_80px_rgba(7,20,39,0.35)]" />
        <div
          className="absolute inset-[11%] rounded-full border border-white/20"
          style={{
            transform: `perspective(1200px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
            transformStyle: "preserve-3d"
          }}
        >
          <div className="map-line absolute inset-[6%] rounded-full opacity-45" />
          <div className="absolute inset-[11%] rounded-full border border-white/10 bg-[radial-gradient(circle_at_30%_30%,rgba(123,205,138,0.95),rgba(58,135,94,0.92)_28%,transparent_30%),radial-gradient(circle_at_68%_44%,rgba(131,216,160,0.95),rgba(40,125,92,0.92)_18%,transparent_22%),radial-gradient(circle_at_45%_74%,rgba(116,190,133,0.9),rgba(42,113,92,0.9)_18%,transparent_24%)] opacity-90" />
          <div className="absolute left-[14%] top-[26%] h-4 w-4 rounded-full bg-[color:var(--accent)] shadow-[0_0_0_8px_rgba(255,127,80,0.12)]" />
          <div className="absolute right-[20%] top-[38%] h-3.5 w-3.5 rounded-full bg-[#ffd36d] shadow-[0_0_0_7px_rgba(255,211,109,0.12)]" />
          <div className="absolute bottom-[24%] left-[30%] h-4 w-4 rounded-full bg-[#77d1ff] shadow-[0_0_0_8px_rgba(119,209,255,0.14)]" />
        </div>
        <div className="absolute inset-x-[12%] bottom-[6%] h-10 rounded-full bg-slate-950/20 blur-2xl" />
        <div className="absolute left-[3%] top-[18%] hidden rounded-3xl glass-panel p-4 sm:block">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <MapPin className="h-4 w-4 text-[color:var(--accent-strong)]" />
            Kyoto
          </div>
          <p className="mt-2 text-xs text-[color:var(--muted)]">Tea houses, quiet alleys, and late lantern walks.</p>
        </div>
        <div className="absolute right-[0%] top-[54%] hidden rounded-3xl glass-panel p-4 sm:block">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Plane className="h-4 w-4 text-[color:var(--accent-secondary)]" />
            Iceland
          </div>
          <p className="mt-2 text-xs text-[color:var(--muted)]">Waterfall loops with room for blue-hour stops.</p>
        </div>
      </motion.div>
      <div className="absolute inset-x-4 bottom-0 grid gap-3 sm:grid-cols-2">
        {floatingDestinations.map((destination) => (
          <div key={destination.label} className="glass-panel rounded-3xl px-4 py-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold">{destination.label}</p>
                <p className="text-xs text-[color:var(--muted)]">Suggested route</p>
              </div>
              <span className="rounded-full bg-white/40 px-3 py-1 text-xs font-medium dark:bg-white/10">
                {destination.stat}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="absolute right-[22%] top-[6%] hidden items-center gap-2 rounded-full bg-white/35 px-3 py-2 text-xs font-semibold shadow-lg dark:bg-white/10 md:flex">
        <Globe2 className="h-4 w-4 text-[color:var(--accent-strong)]" />
        Drag the globe
      </div>
    </motion.div>
  );
}
