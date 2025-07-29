"use client"

import { ThreeDMarquee } from "@/components/ui/three-d-marquee"
import { dashboardImages } from "@/lib/data/dashboard-images"

export function DashboardBackground() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-background/70 via-background/50 to-background/70" />

      {/* 3D Marquee with ADmyBRAND logos */}
      <ThreeDMarquee images={dashboardImages} className="absolute inset-0 opacity-60 dark:opacity-40 scale-110" />

      {/* Light overlay to ensure content readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-background/30" />
    </div>
  )
}
