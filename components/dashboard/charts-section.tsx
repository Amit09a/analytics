"use client"

import { useState } from "react"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { ChartCard } from "@/components/ui/chart-card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { TrendingUp, BarChart3, PieChart } from "lucide-react"
import {
  Line,
  LineChart,
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart as RechartsPieChart,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts"
import type { TimeSeriesData } from "@/lib/types"
import { channelPerformanceData, conversionFunnelData } from "@/lib/data/mock-data"

interface ChartsSectionProps {
  timeSeriesData: TimeSeriesData[]
  loading: boolean
  onRefresh?: () => void
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

export function ChartsSection({ timeSeriesData, loading, onRefresh }: ChartsSectionProps) {
  const [activeChart, setActiveChart] = useState<"line" | "bar" | "pie">("line")

  if (loading) {
    return (
      <div className="grid gap-6 md:gap-8">
        <div className="space-y-4">
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-[400px] w-full rounded-lg" />
        </div>
        <div className="grid gap-6 md:gap-8 lg:grid-cols-2">
          <Skeleton className="h-[450px] w-full rounded-lg" />
          <Skeleton className="h-[450px] w-full rounded-lg" />
        </div>
      </div>
    )
  }

  // Transform time series data for different chart types
  const lineChartData = timeSeriesData.map((item) => ({
    date: new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    revenue: item.revenue,
    users: item.users,
    conversions: item.conversions,
  }))

  const barChartData = timeSeriesData.slice(-7).map((item) => ({
    date: new Date(item.date).toLocaleDateString("en-US", { weekday: "short" }),
    revenue: item.revenue,
    users: item.users,
  }))

  // Enhanced pie chart data with more details
  const enhancedChannelData = channelPerformanceData.map((item, index) => ({
    ...item,
    percentage: ((item.value / channelPerformanceData.reduce((sum, d) => sum + d.value, 0)) * 100).toFixed(1),
    id: index,
  }))

  const renderChart = () => {
    switch (activeChart) {
      case "line":
        return (
          <ChartContainer config={chartConfig} className="h-[400px] w-full bg-background/50 rounded-lg border p-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineChartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "hsl(var(--foreground))", fontSize: 12 }}
                />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "hsl(var(--foreground))", fontSize: 12 }} />
                <ChartTooltip
                  content={<ChartTooltipContent />}
                  cursor={{ stroke: "hsl(var(--foreground))", strokeWidth: 1, strokeDasharray: "3 3" }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="hsl(var(--chart-1))"
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--chart-1))", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: "hsl(var(--chart-1))", strokeWidth: 2 }}
                  name="Revenue ($)"
                />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="hsl(var(--chart-2))"
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--chart-2))", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: "hsl(var(--chart-2))", strokeWidth: 2 }}
                  name="Users"
                />
                <Line
                  type="monotone"
                  dataKey="conversions"
                  stroke="hsl(var(--chart-3))"
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--chart-3))", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: "hsl(var(--chart-3))", strokeWidth: 2 }}
                  name="Conversions"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        )

      case "bar":
        return (
          <ChartContainer config={chartConfig} className="h-[400px] w-full bg-background/50 rounded-lg border p-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "hsl(var(--foreground))", fontSize: 12 }}
                />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "hsl(var(--foreground))", fontSize: 12 }} />
                <ChartTooltip content={<ChartTooltipContent />} cursor={{ fill: "hsl(var(--muted))", opacity: 0.3 }} />
                <Legend />
                <Bar dataKey="revenue" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} name="Revenue ($)" />
                <Bar dataKey="users" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} name="Users" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        )

      case "pie":
        return (
          <ChartContainer config={chartConfig} className="h-[400px] w-full bg-background/50 rounded-lg border p-4">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
                <Pie
                  data={enhancedChannelData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {enhancedChannelData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.fill}
                      stroke="hsl(var(--background))"
                      strokeWidth={2}
                      className="hover:opacity-80 transition-opacity duration-200 cursor-pointer"
                    />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload
                      return (
                        <div className="rounded-lg border bg-background/95 backdrop-blur-sm p-4 shadow-lg">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <div className="h-3 w-3 rounded-full" style={{ backgroundColor: data.fill }} />
                              <span className="font-semibold">{data.name}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-muted-foreground">Value:</span>
                                <div className="font-bold">{data.value.toLocaleString()}</div>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Percentage:</span>
                                <div className="font-bold">{data.percentage}%</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value, entry) => <span style={{ color: entry.color }}>{value}</span>}
                />
              </RechartsPieChart>
            </ResponsiveContainer>
          </ChartContainer>
        )

      default:
        return null
    }
  }

  const getChartTitle = () => {
    switch (activeChart) {
      case "line":
        return "Performance Trends"
      case "bar":
        return "Weekly Comparison"
      case "pie":
        return "Channel Distribution"
      default:
        return "Interactive Charts"
    }
  }

  const getChartDescription = () => {
    switch (activeChart) {
      case "line":
        return "Revenue, users, and conversions over time"
      case "bar":
        return "Last 7 days revenue and user comparison"
      case "pie":
        return "Marketing channel performance breakdown"
      default:
        return "Select a chart type to view data"
    }
  }

  return (
    <div className="space-y-6">
      {/* Interactive Chart Section */}
      <ChartCard title={getChartTitle()} description={getChartDescription()} onRefresh={onRefresh}>
        {/* Chart Type Selector */}
        <div className="flex items-center gap-2 mb-6 p-1 bg-muted/50 rounded-lg w-fit">
          <Button
            variant={activeChart === "line" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveChart("line")}
            className="transition-all duration-200"
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            Line Chart
          </Button>
          <Button
            variant={activeChart === "bar" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveChart("bar")}
            className="transition-all duration-200"
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Bar Chart
          </Button>
          <Button
            variant={activeChart === "pie" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveChart("pie")}
            className="transition-all duration-200"
          >
            <PieChart className="h-4 w-4 mr-2" />
            Donut Chart
          </Button>
        </div>

        {renderChart()}
      </ChartCard>

      {/* Additional Charts Grid */}
      <div className="grid gap-6 md:gap-8 lg:grid-cols-2">
        {/* Conversion Funnel Bar Chart */}
        <ChartCard title="Conversion Funnel" description="User journey through conversion stages">
          <ChartContainer config={chartConfig} className="h-[300px] w-full bg-background/50 rounded-lg border p-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={conversionFunnelData} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
                <defs>
                  <linearGradient id="funnelGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--chart-4))" stopOpacity={0.9} />
                    <stop offset="95%" stopColor="hsl(var(--chart-4))" stopOpacity={0.6} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "hsl(var(--foreground))", fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "hsl(var(--foreground))", fontSize: 12 }}
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                />
                <ChartTooltip
                  content={<ChartTooltipContent />}
                  formatter={(value) => [value.toLocaleString(), "Count"]}
                />
                <Bar
                  dataKey="value"
                  fill="url(#funnelGradient)"
                  radius={[4, 4, 0, 0]}
                  stroke="hsl(var(--chart-4))"
                  strokeWidth={1}
                  className="hover:opacity-80 transition-opacity duration-200 cursor-pointer"
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </ChartCard>

        {/* Channel Performance Summary */}
        <ChartCard title="Channel Performance" description="Top performing marketing channels">
          <div className="space-y-4">
            {enhancedChannelData.slice(0, 5).map((channel, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="h-4 w-4 rounded-full" style={{ backgroundColor: channel.fill }} />
                  <span className="font-medium">{channel.name}</span>
                </div>
                <div className="text-right">
                  <div className="font-bold">{channel.value.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">{channel.percentage}%</div>
                </div>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>
    </div>
  )
}
