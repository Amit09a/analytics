"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Line, LineChart, XAxis, YAxis, ResponsiveContainer, ReferenceLine } from "recharts"
import { Activity, Pause, Play, RotateCcw } from "lucide-react"
import { useRealTimeChartData } from "@/lib/hooks/use-real-time-updates"

interface LiveChartProps {
  title?: string
  description?: string
  className?: string
}

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--chart-1))",
  },
  users: {
    label: "Users",
    color: "hsl(var(--chart-2))",
  },
  conversions: {
    label: "Conversions",
    color: "hsl(var(--chart-3))",
  },
}

export function LiveChart({
  title = "Live Performance",
  description = "Real-time metrics",
  className = "",
}: LiveChartProps) {
  const [isEnabled, setIsEnabled] = useState(true)
  const [selectedMetric, setSelectedMetric] = useState<"revenue" | "users" | "conversions">("revenue")
  const { chartData, isUpdating, clearData } = useRealTimeChartData(isEnabled, 8000)

  const toggleUpdates = () => {
    setIsEnabled(!isEnabled)
  }

  const resetChart = () => {
    clearData()
  }

  const getMetricValue = (data: any) => {
    switch (selectedMetric) {
      case "revenue":
        return data.revenue
      case "users":
        return data.users
      case "conversions":
        return data.conversions
      default:
        return data.revenue
    }
  }

  const getMetricColor = () => {
    return chartConfig[selectedMetric].color
  }

  const getMetricLabel = () => {
    return chartConfig[selectedMetric].label
  }

  // Calculate trend
  const trend =
    chartData.length >= 2
      ? getMetricValue(chartData[chartData.length - 1]) - getMetricValue(chartData[chartData.length - 2])
      : 0

  return (
    <Card className={`transition-all duration-300 hover:shadow-lg ${className}`}>
      <CardHeader className="pb-3 p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-base sm:text-lg font-semibold flex items-center gap-2">
              <Activity
                className={`h-4 w-4 ${isUpdating ? "animate-pulse text-green-500" : "text-muted-foreground"}`}
              />
              {title}
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">{description}</CardDescription>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <Badge variant={isEnabled ? "default" : "secondary"} className="text-xs">
              {isEnabled ? "Live" : "Paused"}
            </Badge>
            <Button variant="ghost" size="sm" onClick={toggleUpdates}>
              {isEnabled ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="sm" onClick={resetChart}>
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6">
        {/* Metric selector */}
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto pb-2">
          {Object.entries(chartConfig).map(([key, config]) => (
            <Button
              key={key}
              variant={selectedMetric === key ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedMetric(key as any)}
              className="text-xs whitespace-nowrap"
            >
              {config.label}
            </Button>
          ))}
        </div>

        {/* Current value and trend */}
        {chartData.length > 0 && (
          <div className="flex items-center gap-4">
            <div>
              <div className="text-lg sm:text-xl md:text-2xl font-bold" style={{ color: getMetricColor() }}>
                {selectedMetric === "revenue"
                  ? `$${getMetricValue(chartData[chartData.length - 1]).toLocaleString()}`
                  : getMetricValue(chartData[chartData.length - 1]).toLocaleString()}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">Current {getMetricLabel()}</div>
            </div>
            {trend !== 0 && (
              <div className={`flex items-center gap-1 text-xs sm:text-sm ${trend > 0 ? "text-green-600" : "text-red-600"}`}>
                <span>{trend > 0 ? "↗" : "↘"}</span>
                <span>{Math.abs(trend)}</span>
                <span className="text-muted-foreground hidden sm:inline">vs last</span>
              </div>
            )}
          </div>
        )}

        {/* Chart */}
        <div className="h-48 sm:h-56 md:h-64">
          {chartData.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <div className="text-center">
                <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-xs sm:text-sm">Waiting for data...</p>
              </div>
            </div>
          ) : (
            <ChartContainer config={chartConfig} className="h-full w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                  <XAxis
                    dataKey="time"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }}
                    width={35}
                  />
                  <ChartTooltip
                    content={<ChartTooltipContent />}
                    labelFormatter={(value) => `Time: ${value}`}
                    formatter={(value, name) => [selectedMetric === "revenue" ? `$${value}` : value, getMetricLabel()]}
                  />
                  <Line
                    type="monotone"
                    dataKey={selectedMetric}
                    stroke={getMetricColor()}
                    strokeWidth={2}
                    dot={{ fill: getMetricColor(), strokeWidth: 2, r: 3 }}
                    activeDot={{ r: 5, stroke: getMetricColor(), strokeWidth: 2 }}
                    connectNulls={false}
                  />
                  {/* Add reference line for average */}
                  {chartData.length > 5 && (
                    <ReferenceLine
                      y={chartData.reduce((sum, item) => sum + getMetricValue(item), 0) / chartData.length}
                      stroke="hsl(var(--muted-foreground))"
                      strokeDasharray="3 3"
                      strokeOpacity={0.5}
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          )}
        </div>

        {/* Chart info */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{chartData.length} data points</span>
          <span>Updates every 8 seconds</span>
        </div>
      </CardContent>
    </Card>
  )
}
