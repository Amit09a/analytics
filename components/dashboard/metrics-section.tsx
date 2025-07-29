"use client"

import { MetricCard } from "@/components/ui/metric-card"
import { Skeleton } from "@/components/ui/skeleton"
import type { MetricData } from "@/lib/types"

interface MetricsSectionProps {
  metrics: MetricData[]
  loading: boolean
}

export function MetricsSection({ metrics, loading }: MetricsSectionProps) {
  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-24 w-full rounded-lg" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric, index) => (
        <MetricCard key={metric.title} metric={metric} index={index} />
      ))}
    </div>
  )
}
