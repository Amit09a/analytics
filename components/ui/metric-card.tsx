"use client"

import { ArrowDownIcon, ArrowUpIcon, DollarSign, TrendingUp, Users, Zap } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { MetricData } from "@/lib/types"

const iconMap = {
  DollarSign,
  Users,
  TrendingUp,
  Zap,
}

const gradientMap = {
  DollarSign: "from-green-500 to-emerald-600",
  Users: "from-blue-500 to-cyan-600",
  TrendingUp: "from-purple-500 to-violet-600",
  Zap: "from-orange-500 to-red-600",
}

interface MetricCardProps {
  metric: MetricData
  index?: number
}

export function MetricCard({ metric, index = 0 }: MetricCardProps) {
  const Icon = iconMap[metric.icon as keyof typeof iconMap] || DollarSign
  const gradient = gradientMap[metric.icon as keyof typeof gradientMap] || "from-gray-500 to-gray-600"

  return (
    <Card
      className="group relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl border-0 bg-card/90 backdrop-blur-md supports-[backdrop-filter]:bg-card/70 shadow-lg min-h-[120px] sm:min-h-[140px]"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-5 group-hover:opacity-15 transition-opacity duration-300`}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-background/20 to-transparent" />
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10 p-4 sm:p-6">
        <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors duration-200 leading-tight">
          {metric.title}
        </CardTitle>
        <div
          className={`p-1.5 sm:p-2 rounded-lg bg-gradient-to-br ${gradient} shadow-lg group-hover:scale-110 transition-transform duration-200`}
        >
          <Icon className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
        </div>
      </CardHeader>
      <CardContent className="relative z-10 p-4 sm:p-6 pt-0">
        <div className="text-xl sm:text-2xl md:text-3xl font-bold mb-1 group-hover:scale-105 transition-transform duration-200 leading-tight">
          {metric.value}
        </div>
        <div className="flex items-center text-xs flex-wrap gap-1">
          {metric.changeType === "positive" ? (
            <ArrowUpIcon className="h-3 w-3 text-green-500 flex-shrink-0" />
          ) : metric.changeType === "negative" ? (
            <ArrowDownIcon className="h-3 w-3 text-red-500 flex-shrink-0" />
          ) : null}
          <span
            className={`font-medium ${
              metric.changeType === "positive"
                ? "text-green-500"
                : metric.changeType === "negative"
                  ? "text-red-500"
                  : "text-muted-foreground"
            }`}
          >
            {metric.change}
          </span>
          <span className="text-muted-foreground">{metric.description}</span>
        </div>
      </CardContent>
    </Card>
  )
}
