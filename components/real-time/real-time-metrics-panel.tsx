"use client"

import { useState } from "react"
import { Activity, Users, DollarSign, TrendingUp, Wifi, WifiOff, Pause, Play, Trash2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { useRealTimeUpdates } from "@/lib/hooks/use-real-time-updates"
import { formatters } from "@/lib/data/api-service"

interface RealTimeMetricsPanelProps {
  className?: string
}

export function RealTimeMetricsPanel({ className = "" }: RealTimeMetricsPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const { metrics, activities, isConnected, lastUpdate, toggleUpdates, clearActivities } = useRealTimeUpdates({
    enabled: true,
    metricsInterval: 5000,
    activitiesInterval: 3000,
    maxActivities: 30,
  })

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "conversion":
        return <TrendingUp className="h-3 w-3 text-green-500" />
      case "signup":
        return <Users className="h-3 w-3 text-blue-500" />
      case "purchase":
        return <DollarSign className="h-3 w-3 text-emerald-500" />
      case "pageview":
        return <Activity className="h-3 w-3 text-purple-500" />
      case "click":
        return <Activity className="h-3 w-3 text-orange-500" />
      default:
        return <Activity className="h-3 w-3 text-gray-500" />
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case "conversion":
        return "bg-green-500/10 text-green-700 dark:text-green-400"
      case "signup":
        return "bg-blue-500/10 text-blue-700 dark:text-blue-400"
      case "purchase":
        return "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
      case "pageview":
        return "bg-purple-500/10 text-purple-700 dark:text-purple-400"
      case "click":
        return "bg-orange-500/10 text-orange-700 dark:text-orange-400"
      default:
        return "bg-gray-500/10 text-gray-700 dark:text-gray-400"
    }
  }

  return (
    <Card className={`transition-all duration-300 hover:shadow-lg ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              {isConnected ? <Wifi className="h-4 w-4 text-green-500" /> : <WifiOff className="h-4 w-4 text-red-500" />}
              Real-Time Activity
            </CardTitle>
            <CardDescription className="text-sm">
              {isConnected ? "Live updates" : "Disconnected"} •{" "}
              {lastUpdate && `Updated ${new Date(lastUpdate).toLocaleTimeString()}`}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={toggleUpdates}>
              {isConnected ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="sm" onClick={clearActivities}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Real-time metrics */}
        {metrics && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="text-center p-3 rounded-lg bg-muted/30">
              <div className="text-2xl font-bold text-primary">{metrics.activeUsers}</div>
              <div className="text-xs text-muted-foreground">Active Users</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/30">
              <div className="text-2xl font-bold text-green-600">{formatters.currency(metrics.currentRevenue)}</div>
              <div className="text-xs text-muted-foreground">Revenue Today</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/30">
              <div className="text-2xl font-bold text-blue-600">{metrics.conversionRate}%</div>
              <div className="text-xs text-muted-foreground">Conversion Rate</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/30">
              <div className="text-2xl font-bold text-purple-600">{metrics.avgSessionDuration}</div>
              <div className="text-xs text-muted-foreground">Avg. Session</div>
            </div>
          </div>
        )}

        <Separator />

        {/* Activity feed */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">Live Activity Feed</h4>
            <Badge variant="secondary" className="text-xs">
              {activities.length} activities
            </Badge>
          </div>

          <ScrollArea className="h-64 w-full rounded-md border p-2">
            <div className="space-y-2">
              {activities.length === 0 ? (
                <div className="text-center text-muted-foreground text-sm py-8">No recent activity</div>
              ) : (
                activities.map((activity, index) => (
                  <div
                    key={activity.id}
                    className={`flex items-start gap-3 p-2 rounded-lg transition-all duration-300 ${
                      index === 0 ? "bg-primary/5 border border-primary/20" : "hover:bg-muted/50"
                    }`}
                    style={{
                      animation: index === 0 ? "slideInFromTop 0.3s ease-out" : undefined,
                    }}
                  >
                    <div className="flex-shrink-0 mt-0.5">{getActivityIcon(activity.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium capitalize">{activity.type}</span>
                        {activity.value && (
                          <Badge variant="outline" className="text-xs">
                            {formatters.currency(activity.value)}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mb-1">{activity.description}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{activity.location}</span>
                        <span>•</span>
                        <span>{activity.channel}</span>
                        <span>•</span>
                        <span>{new Date(activity.timestamp).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Connection status */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className={`h-2 w-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`} />
            <span>{isConnected ? "Connected" : "Disconnected"}</span>
          </div>
          {lastUpdate && <span>Last update: {new Date(lastUpdate).toLocaleTimeString()}</span>}
        </div>
      </CardContent>
    </Card>
  )
}
