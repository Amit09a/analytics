"use client"

import { ArrowDownIcon, ArrowUpIcon, DollarSign, TrendingUp, Users, Zap } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const metrics = [
  {
    title: "Total Revenue",
    value: "$45,231.89",
    change: "+20.1%",
    changeType: "positive" as const,
    icon: DollarSign,
    description: "from last month",
    gradient: "from-green-500 to-emerald-600",
  },
  {
    title: "Active Users",
    value: "2,350",
    change: "+180.1%",
    changeType: "positive" as const,
    icon: Users,
    description: "from last month",
    gradient: "from-blue-500 to-cyan-600",
  },
  {
    title: "Conversions",
    value: "12,234",
    change: "+19%",
    changeType: "positive" as const,
    icon: TrendingUp,
    description: "from last month",
    gradient: "from-purple-500 to-violet-600",
  },
  {
    title: "Growth Rate",
    value: "573",
    change: "-2.1%",
    changeType: "negative" as const,
    icon: Zap,
    description: "from last month",
    gradient: "from-orange-500 to-red-600",
  },
]

export function MetricsCards() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric, index) => (
        <Card
          key={metric.title}
          className="group relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl border-0 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div
            className={`absolute inset-0 bg-gradient-to-br ${metric.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}
          />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors duration-200">
              {metric.title}
            </CardTitle>
            <div
              className={`p-2 rounded-lg bg-gradient-to-br ${metric.gradient} shadow-lg group-hover:scale-110 transition-transform duration-200`}
            >
              <metric.icon className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-3xl font-bold mb-1 group-hover:scale-105 transition-transform duration-200">
              {metric.value}
            </div>
            <div className="flex items-center text-xs">
              {metric.changeType === "positive" ? (
                <ArrowUpIcon className="mr-1 h-3 w-3 text-green-500" />
              ) : (
                <ArrowDownIcon className="mr-1 h-3 w-3 text-red-500" />
              )}
              <span className={`font-medium ${metric.changeType === "positive" ? "text-green-500" : "text-red-500"}`}>
                {metric.change}
              </span>
              <span className="ml-1 text-muted-foreground">{metric.description}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
