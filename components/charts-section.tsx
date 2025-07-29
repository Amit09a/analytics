"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Area, AreaChart, Bar, BarChart, Cell, Pie, PieChart, XAxis, YAxis, ResponsiveContainer } from "recharts"

const revenueData = [
  { month: "Jan", revenue: 4000, users: 2400 },
  { month: "Feb", revenue: 3000, users: 1398 },
  { month: "Mar", revenue: 2000, users: 9800 },
  { month: "Apr", revenue: 2780, users: 3908 },
  { month: "May", revenue: 1890, users: 4800 },
  { month: "Jun", revenue: 2390, users: 3800 },
  { month: "Jul", revenue: 3490, users: 4300 },
]

const campaignData = [
  { name: "Social Media", value: 4000, fill: "hsl(var(--chart-1))" },
  { name: "Email", value: 3000, fill: "hsl(var(--chart-2))" },
  { name: "Search", value: 2000, fill: "hsl(var(--chart-3))" },
  { name: "Display", value: 2780, fill: "hsl(var(--chart-4))" },
  { name: "Video", value: 1890, fill: "hsl(var(--chart-5))" },
]

const conversionData = [
  { channel: "Organic", conversions: 1200 },
  { channel: "Paid Social", conversions: 800 },
  { channel: "Email", conversions: 600 },
  { channel: "Direct", conversions: 400 },
  { channel: "Referral", conversions: 300 },
]

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--chart-1))",
  },
  users: {
    label: "Users",
    color: "hsl(var(--chart-2))",
  },
}

export function ChartsSection() {
  return (
    <div className="grid gap-6 md:gap-8">
      {/* Revenue Chart - Full width on mobile, 2/3 on desktop */}
      <Card className="group transition-all duration-300 hover:shadow-2xl border-0 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
        <CardHeader className="space-y-2">
          <CardTitle className="text-lg md:text-xl font-semibold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Revenue & User Growth
          </CardTitle>
          <CardDescription className="text-sm md:text-base">
            Monthly revenue and user acquisition trends
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          <ChartContainer config={chartConfig} className="h-[300px] md:h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient id="usersGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" className="text-xs" axisLine={false} tickLine={false} />
                <YAxis className="text-xs" axisLine={false} tickLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stackId="1"
                  stroke="hsl(var(--chart-1))"
                  fill="url(#revenueGradient)"
                  strokeWidth={3}
                />
                <Area
                  type="monotone"
                  dataKey="users"
                  stackId="1"
                  stroke="hsl(var(--chart-2))"
                  fill="url(#usersGradient)"
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:gap-8 lg:grid-cols-2">
        {/* Pie Chart */}
        <Card className="group transition-all duration-300 hover:shadow-2xl border-0 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
          <CardHeader className="space-y-2">
            <CardTitle className="text-lg md:text-xl font-semibold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Campaign Performance
            </CardTitle>
            <CardDescription className="text-sm md:text-base">Distribution by channel type</CardDescription>
          </CardHeader>
          <CardContent className="p-4 md:p-6">
            <ChartContainer config={chartConfig} className="h-[300px] md:h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={campaignData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {campaignData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.fill}
                        className="hover:opacity-80 transition-opacity duration-200"
                      />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Bar Chart */}
        <Card className="group transition-all duration-300 hover:shadow-2xl border-0 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
          <CardHeader className="space-y-2">
            <CardTitle className="text-lg md:text-xl font-semibold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Conversion by Channel
            </CardTitle>
            <CardDescription className="text-sm md:text-base">
              Total conversions across different marketing channels
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 md:p-6">
            <ChartContainer config={chartConfig} className="h-[300px] md:h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={conversionData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.9} />
                      <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0.6} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="channel" className="text-xs" axisLine={false} tickLine={false} />
                  <YAxis className="text-xs" axisLine={false} tickLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar
                    dataKey="conversions"
                    fill="url(#barGradient)"
                    radius={[8, 8, 0, 0]}
                    className="hover:opacity-80 transition-opacity duration-200"
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
