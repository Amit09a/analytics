"use client"

import type React from "react"

import { cn } from "@/lib/utils"

interface LoadingSkeletonProps {
  className?: string
  variant?: "default" | "shimmer" | "wave" | "pulse"
  children?: React.ReactNode
}

export function LoadingSkeleton({ className, variant = "shimmer", children, ...props }: LoadingSkeletonProps) {
  const variants = {
    default: "animate-pulse bg-muted",
    shimmer: "animate-shimmer bg-gradient-to-r from-muted via-muted/50 to-muted bg-[length:200%_100%]",
    wave: "animate-wave bg-gradient-to-r from-muted via-primary/10 to-muted bg-[length:200%_100%]",
    pulse: "animate-pulse-glow bg-muted shadow-lg",
  }

  return (
    <div className={cn("rounded-lg", variants[variant], className)} {...props}>
      {children}
    </div>
  )
}

// Specialized skeleton components
export function MetricCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-3 p-6 rounded-xl border bg-card/50 backdrop-blur-sm", className)}>
      <div className="flex items-center justify-between">
        <LoadingSkeleton variant="shimmer" className="h-4 w-24" />
        <LoadingSkeleton variant="shimmer" className="h-8 w-8 rounded-lg" />
      </div>
      <LoadingSkeleton variant="shimmer" className="h-8 w-32" />
      <div className="flex items-center space-x-2">
        <LoadingSkeleton variant="shimmer" className="h-3 w-3 rounded-full" />
        <LoadingSkeleton variant="shimmer" className="h-3 w-16" />
        <LoadingSkeleton variant="shimmer" className="h-3 w-20" />
      </div>
    </div>
  )
}

export function ChartSkeleton({ className, height = "h-[350px]" }: { className?: string; height?: string }) {
  return (
    <div className={cn("space-y-4 p-6 rounded-xl border bg-card/50 backdrop-blur-sm", className)}>
      <div className="space-y-2">
        <LoadingSkeleton variant="shimmer" className="h-6 w-48" />
        <LoadingSkeleton variant="shimmer" className="h-4 w-64" />
      </div>
      <div className="flex items-center space-x-2 mb-4">
        <LoadingSkeleton variant="shimmer" className="h-8 w-20 rounded-lg" />
        <LoadingSkeleton variant="shimmer" className="h-8 w-20 rounded-lg" />
        <LoadingSkeleton variant="shimmer" className="h-8 w-20 rounded-lg" />
      </div>
      <LoadingSkeleton variant="wave" className={cn(height, "w-full rounded-lg")} />
    </div>
  )
}

export function TableSkeleton({
  className,
  rows = 5,
  columns = 8,
}: {
  className?: string
  rows?: number
  columns?: number
}) {
  return (
    <div className={cn("space-y-4 p-6 rounded-xl border bg-card/50 backdrop-blur-sm", className)}>
      <div className="space-y-2">
        <LoadingSkeleton variant="shimmer" className="h-6 w-48" />
        <LoadingSkeleton variant="shimmer" className="h-4 w-64" />
      </div>

      {/* Search and filters */}
      <div className="flex items-center justify-between space-x-4 py-4">
        <div className="flex items-center space-x-3">
          <LoadingSkeleton variant="shimmer" className="h-10 w-64 rounded-lg" />
          <LoadingSkeleton variant="shimmer" className="h-10 w-32 rounded-lg" />
        </div>
        <LoadingSkeleton variant="shimmer" className="h-4 w-32" />
      </div>

      {/* Table */}
      <div className="rounded-lg border overflow-hidden">
        {/* Header */}
        <div className="bg-muted/30 p-4">
          <div className="grid grid-cols-8 gap-4">
            {Array.from({ length: columns }).map((_, i) => (
              <LoadingSkeleton key={i} variant="shimmer" className="h-4 w-full" />
            ))}
          </div>
        </div>

        {/* Rows */}
        <div className="divide-y">
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <div key={rowIndex} className="p-4">
              <div className="grid grid-cols-8 gap-4 items-center">
                {Array.from({ length: columns }).map((_, colIndex) => (
                  <LoadingSkeleton
                    key={colIndex}
                    variant="shimmer"
                    className={cn("h-4", colIndex === 0 ? "w-full" : "w-16")}
                    style={{ animationDelay: `${(rowIndex * columns + colIndex) * 0.05}s` }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function RealTimeMetricsSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-4 p-6 rounded-xl border bg-card/50 backdrop-blur-sm", className)}>
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <LoadingSkeleton variant="pulse" className="h-4 w-4 rounded-full" />
            <LoadingSkeleton variant="shimmer" className="h-5 w-32" />
          </div>
          <LoadingSkeleton variant="shimmer" className="h-4 w-24" />
        </div>
        <div className="flex items-center gap-2">
          <LoadingSkeleton variant="shimmer" className="h-6 w-12 rounded-full" />
          <LoadingSkeleton variant="shimmer" className="h-8 w-8 rounded" />
          <LoadingSkeleton variant="shimmer" className="h-8 w-8 rounded" />
        </div>
      </div>

      {/* Metrics grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="text-center p-3 rounded-lg bg-muted/30">
            <LoadingSkeleton variant="shimmer" className="h-6 w-12 mx-auto mb-1" />
            <LoadingSkeleton variant="shimmer" className="h-3 w-16 mx-auto" />
          </div>
        ))}
      </div>

      {/* Activity feed */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <LoadingSkeleton variant="shimmer" className="h-4 w-24" />
          <LoadingSkeleton variant="shimmer" className="h-5 w-16 rounded-full" />
        </div>

        <div className="h-64 w-full rounded-md border p-2">
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-start gap-3 p-2 rounded-lg">
                <LoadingSkeleton variant="pulse" className="h-4 w-4 rounded-full mt-0.5" />
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <LoadingSkeleton variant="shimmer" className="h-3 w-16" />
                    <LoadingSkeleton variant="shimmer" className="h-4 w-12 rounded" />
                  </div>
                  <LoadingSkeleton variant="shimmer" className="h-3 w-full" />
                  <div className="flex items-center gap-2">
                    <LoadingSkeleton variant="shimmer" className="h-2 w-16" />
                    <LoadingSkeleton variant="shimmer" className="h-2 w-12" />
                    <LoadingSkeleton variant="shimmer" className="h-2 w-14" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export function LiveChartSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-4 p-6 rounded-xl border bg-card/50 backdrop-blur-sm", className)}>
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <LoadingSkeleton variant="pulse" className="h-4 w-4 rounded-full" />
            <LoadingSkeleton variant="shimmer" className="h-5 w-32" />
          </div>
          <LoadingSkeleton variant="shimmer" className="h-4 w-24" />
        </div>
        <div className="flex items-center gap-2">
          <LoadingSkeleton variant="shimmer" className="h-6 w-12 rounded-full" />
          <LoadingSkeleton variant="shimmer" className="h-8 w-8 rounded" />
          <LoadingSkeleton variant="shimmer" className="h-8 w-8 rounded" />
        </div>
      </div>

      {/* Metric selector */}
      <div className="flex items-center gap-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <LoadingSkeleton key={i} variant="shimmer" className="h-8 w-20 rounded-lg" />
        ))}
      </div>

      {/* Current value */}
      <div className="flex items-center gap-4">
        <div className="space-y-1">
          <LoadingSkeleton variant="shimmer" className="h-8 w-24" />
          <LoadingSkeleton variant="shimmer" className="h-4 w-20" />
        </div>
        <div className="flex items-center gap-1">
          <LoadingSkeleton variant="shimmer" className="h-4 w-4" />
          <LoadingSkeleton variant="shimmer" className="h-4 w-8" />
        </div>
      </div>

      {/* Chart area */}
      <LoadingSkeleton variant="wave" className="h-64 w-full rounded-lg" />
    </div>
  )
}

export function SidebarSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("w-64 h-screen border-r bg-sidebar/50 backdrop-blur-sm", className)}>
      {/* Header */}
      <div className="border-b border-sidebar-border/50 p-4">
        <div className="flex items-center gap-3">
          <LoadingSkeleton variant="shimmer" className="h-10 w-10 rounded-xl" />
          <div className="space-y-1">
            <LoadingSkeleton variant="shimmer" className="h-4 w-24" />
            <LoadingSkeleton variant="shimmer" className="h-3 w-20" />
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="p-2 space-y-6">
        {/* Platform section */}
        <div className="space-y-2">
          <LoadingSkeleton variant="shimmer" className="h-3 w-16 mx-3" />
          <div className="space-y-1">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-3 py-2 rounded-lg">
                <LoadingSkeleton variant="shimmer" className="h-4 w-4" />
                <LoadingSkeleton variant="shimmer" className="h-4 w-20" />
              </div>
            ))}
          </div>
        </div>

        {/* Tools section */}
        <div className="space-y-2">
          <LoadingSkeleton variant="shimmer" className="h-3 w-12 mx-3" />
          <div className="space-y-1">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-3 py-2 rounded-lg">
                <LoadingSkeleton variant="shimmer" className="h-4 w-4" />
                <LoadingSkeleton variant="shimmer" className="h-4 w-16" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-sidebar-border/50 p-4">
        <LoadingSkeleton variant="shimmer" className="h-3 w-32 mx-auto" />
      </div>
    </div>
  )
}
