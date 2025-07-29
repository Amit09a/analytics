"use client"

import type React from "react"

import {
  MetricCardSkeleton,
  ChartSkeleton,
  TableSkeleton,
  RealTimeMetricsSkeleton,
  LiveChartSkeleton,
  SidebarSkeleton,
  LoadingSkeleton,
} from "@/components/ui/loading-skeleton"

export function DashboardSkeleton() {
  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Sidebar Skeleton */}
      <SidebarSkeleton />

      {/* Main Content */}
      <div className="flex-1">
        {/* Header Skeleton */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur px-4">
          <LoadingSkeleton variant="shimmer" className="h-7 w-7 rounded" />
          <div className="flex flex-1 items-center gap-2">
            <LoadingSkeleton variant="shimmer" className="h-10 w-64 rounded-lg" />
          </div>
          <div className="flex items-center gap-2">
            <LoadingSkeleton variant="shimmer" className="h-8 w-24 rounded" />
            <LoadingSkeleton variant="shimmer" className="h-8 w-20 rounded" />
            <LoadingSkeleton variant="shimmer" className="h-8 w-16 rounded" />
            <LoadingSkeleton variant="shimmer" className="h-8 w-8 rounded" />
            <LoadingSkeleton variant="shimmer" className="h-8 w-8 rounded" />
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 space-y-8 p-6 animate-fade-in">
          {/* Title Section */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <LoadingSkeleton variant="shimmer" className="h-10 w-80" />
              <LoadingSkeleton variant="pulse" className="h-6 w-6 rounded" />
            </div>
            <LoadingSkeleton variant="shimmer" className="h-6 w-96" />
          </div>

          {/* Tabs Skeleton */}
          <div className="space-y-6">
            <div className="flex space-x-1 rounded-lg bg-muted p-1 w-[400px]">
              {Array.from({ length: 3 }).map((_, i) => (
                <LoadingSkeleton key={i} variant="shimmer" className="h-8 flex-1 rounded-md" />
              ))}
            </div>

            {/* Metrics Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <MetricCardSkeleton
                  key={i}
                  className="animate-slide-up"
                  style={{ animationDelay: `${i * 0.1}s` } as React.CSSProperties}
                />
              ))}
            </div>

            {/* Charts Section */}
            <div className="space-y-8">
              <ChartSkeleton className="animate-slide-up" style={{ animationDelay: "0.2s" } as React.CSSProperties} />

              <div className="grid gap-8 lg:grid-cols-2">
                <ChartSkeleton
                  height="h-[400px]"
                  className="animate-slide-up"
                  style={{ animationDelay: "0.3s" } as React.CSSProperties}
                />
                <ChartSkeleton
                  height="h-[400px]"
                  className="animate-slide-up"
                  style={{ animationDelay: "0.4s" } as React.CSSProperties}
                />
              </div>
            </div>

            {/* Table Section */}
            <TableSkeleton className="animate-slide-up" style={{ animationDelay: "0.5s" } as React.CSSProperties} />
          </div>
        </div>
      </div>
    </div>
  )
}

export function RealTimeDashboardSkeleton() {
  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Sidebar Skeleton */}
      <SidebarSkeleton />

      {/* Main Content */}
      <div className="flex-1">
        {/* Header Skeleton */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur px-4">
          <LoadingSkeleton variant="shimmer" className="h-7 w-7 rounded" />
          <div className="flex flex-1 items-center gap-2">
            <LoadingSkeleton variant="shimmer" className="h-10 w-64 rounded-lg" />
          </div>
          <div className="flex items-center gap-2">
            <LoadingSkeleton variant="pulse" className="h-6 w-16 rounded-full animate-pulse" />
            <LoadingSkeleton variant="shimmer" className="h-8 w-24 rounded" />
            <LoadingSkeleton variant="shimmer" className="h-8 w-20 rounded" />
            <LoadingSkeleton variant="shimmer" className="h-8 w-8 rounded" />
          </div>
        </div>

        {/* Real-time Content */}
        <div className="flex-1 space-y-8 p-6">
          {/* Title */}
          <div className="space-y-2">
            <LoadingSkeleton variant="shimmer" className="h-10 w-80" />
            <LoadingSkeleton variant="shimmer" className="h-6 w-96" />
          </div>

          {/* Real-time Grid */}
          <div className="grid gap-6 lg:grid-cols-2">
            <RealTimeMetricsSkeleton />
            <LiveChartSkeleton />
          </div>

          {/* Live Table */}
          <TableSkeleton rows={8} />
        </div>
      </div>
    </div>
  )
}

export function CompactDashboardSkeleton() {
  return (
    <div className="space-y-6 p-6">
      {/* Compact Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-2 p-4 rounded-lg border bg-card/50">
            <div className="flex items-center justify-between">
              <LoadingSkeleton variant="shimmer" className="h-3 w-16" />
              <LoadingSkeleton variant="shimmer" className="h-6 w-6 rounded" />
            </div>
            <LoadingSkeleton variant="shimmer" className="h-6 w-20" />
            <LoadingSkeleton variant="shimmer" className="h-2 w-12" />
          </div>
        ))}
      </div>

      {/* Compact Chart */}
      <div className="space-y-3 p-4 rounded-lg border bg-card/50">
        <LoadingSkeleton variant="shimmer" className="h-4 w-32" />
        <LoadingSkeleton variant="wave" className="h-48 w-full rounded" />
      </div>

      {/* Compact Table */}
      <div className="space-y-3 p-4 rounded-lg border bg-card/50">
        <LoadingSkeleton variant="shimmer" className="h-4 w-40" />
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between">
              <LoadingSkeleton variant="shimmer" className="h-3 w-32" />
              <LoadingSkeleton variant="shimmer" className="h-3 w-16" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
