"use client"

import { Bell, Calendar, Search, Sparkles, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { MetricsSection } from "@/components/dashboard/metrics-section"
import { ChartsSection } from "@/components/dashboard/charts-section"
import { CampaignsTable } from "@/components/dashboard/campaigns-table"
import { DashboardBackground } from "@/components/dashboard/dashboard-background"
import { RealTimeMetricsPanel } from "@/components/real-time/real-time-metrics-panel"
import { LiveChart } from "@/components/real-time/live-chart"
import { LiveCampaignsTable } from "@/components/real-time/live-campaigns-table"
import { DashboardSkeleton, RealTimeDashboardSkeleton } from "@/components/ui/dashboard-skeleton"
import { QuickExportMenu } from "@/components/ui/quick-export-menu"
import { useDashboardData } from "@/lib/hooks/use-dashboard-data"
import { useRealTimeUpdates } from "@/lib/hooks/use-real-time-updates"
import { useToast } from "@/hooks/use-toast"
import { formatters } from "@/lib/data/api-service"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState } from "react"
import type { ExportData } from "@/lib/utils/export-utils"

export function DashboardContent() {
  const [activeTab, setActiveTab] = useState("overview")
  const { campaigns, metrics, timeSeriesData, loading, error, lastUpdated, derivedMetrics, isStale, refreshData } =
    useDashboardData({
      autoRefresh: true,
      refreshInterval: 300000, // 5 minutes
    })

  const { metrics: realTimeMetrics } = useRealTimeUpdates({ enabled: true })
  const { toast } = useToast()

  const handleRefresh = async () => {
    await refreshData()
    toast({
      title: "Data Refreshed",
      description: `Dashboard updated at ${formatters.dateTime(new Date())}`,
    })
  }

  const handleExportComplete = (format: string, filename: string) => {
    toast({
      title: "Export Complete",
      description: `Successfully exported ${filename}`,
    })
  }

  // Prepare export data
  const exportData: ExportData = {
    metrics,
    campaigns,
    timeSeriesData,
    exportDate: new Date().toLocaleDateString(),
    dateRange: "Last 30 days",
  }

  // Show appropriate skeleton based on active tab and loading state
  if (loading) {
    if (activeTab === "realtime") {
      return <RealTimeDashboardSkeleton />
    }
    return <DashboardSkeleton />
  }

  if (error) {
    return (
      <SidebarInset className="flex-1 relative">
        <DashboardBackground />
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center space-y-4 bg-card/95 backdrop-blur-md p-8 rounded-2xl border shadow-2xl">
            <h2 className="text-2xl font-bold text-destructive">Error Loading Dashboard</h2>
            <p className="text-muted-foreground">{error}</p>
            <Button onClick={handleRefresh}>Try Again</Button>
          </div>
        </div>
      </SidebarInset>
    )
  }

  return (
    <SidebarInset className="flex-1 relative">
      <DashboardBackground />

      <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-2 border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 px-4 transition-all duration-300 shadow-sm">
        <SidebarTrigger className="-ml-1 transition-all duration-200 hover:scale-110" />
        <div className="flex flex-1 items-center gap-2">
          <div className="relative flex-1 max-w-md group">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
            <Input
              placeholder="Search campaigns, metrics..."
              className="pl-8 transition-all duration-200 focus:ring-2 focus:ring-primary/20 bg-background/70 backdrop-blur-sm border-border/50"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Data freshness indicator */}
          {lastUpdated && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className={`h-2 w-2 rounded-full ${isStale ? "bg-yellow-500" : "bg-green-500"} animate-pulse`} />
              <span>Updated {formatters.dateTime(lastUpdated)}</span>
            </div>
          )}

          {/* Real-time metrics badge */}
          {realTimeMetrics && (
            <Badge variant="outline" className="text-xs animate-pulse">
              🔴 {realTimeMetrics.activeUsers} live
            </Badge>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="transition-all duration-200 hover:scale-105 hover:shadow-md bg-background/70 backdrop-blur-sm border-border/50"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Last 30 days
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="animate-scale-in z-50 bg-background/95 backdrop-blur-md border-border/50"
            >
              <DropdownMenuItem>Last 7 days</DropdownMenuItem>
              <DropdownMenuItem>Last 30 days</DropdownMenuItem>
              <DropdownMenuItem>Last 90 days</DropdownMenuItem>
              <DropdownMenuItem>Custom range</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={loading}
            className="transition-all duration-200 hover:scale-105 hover:shadow-md bg-background/70 backdrop-blur-sm border-border/50"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>

          {/* Export Options */}
          <QuickExportMenu
            campaigns={campaigns}
            metrics={metrics}
            timeSeriesData={timeSeriesData}
            className="transition-all duration-200 hover:scale-105 hover:shadow-md bg-background/70 backdrop-blur-sm border-border/50"
          />

          <Button variant="ghost" size="sm" className="relative transition-all duration-200 hover:scale-110">
            <Bell className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full animate-pulse"></span>
          </Button>
          <ThemeToggle />
        </div>
      </header>

      <main className="relative z-10 flex-1 space-y-8 p-4 md:p-6 animate-fade-in overflow-x-hidden">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent drop-shadow-sm">
              Dashboard Overview
            </h1>
            <Sparkles className="h-5 w-5 md:h-6 md:w-6 text-primary animate-pulse-subtle drop-shadow-sm" />
          </div>
          <div className="flex items-center gap-4">
            <p className="text-base md:text-lg text-muted-foreground/90 drop-shadow-sm">
              Welcome back! Here's what's happening with your campaigns today.
            </p>
            {derivedMetrics.totalCampaigns > 0 && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Badge variant="secondary">{derivedMetrics.activeCampaigns} active campaigns</Badge>
                <Badge variant="outline">{formatters.currency(derivedMetrics.totalSpent)} spent</Badge>
              </div>
            )}
          </div>
        </div>

        {/* Tabs for different views */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="realtime">Real-Time</TabsTrigger>
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            <section className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
              <MetricsSection metrics={metrics} loading={false} />
            </section>

            <section className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
              <ChartsSection timeSeriesData={timeSeriesData} loading={false} onRefresh={handleRefresh} />
            </section>

            <section className="animate-slide-up" style={{ animationDelay: "0.3s" }}>
              <CampaignsTable campaigns={campaigns} loading={false} />
            </section>
          </TabsContent>

          <TabsContent value="realtime" className="space-y-8">
            <div className="grid gap-6 lg:grid-cols-2">
              <section className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
                <RealTimeMetricsPanel />
              </section>

              <section className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
                <LiveChart />
              </section>
            </div>

            <section className="animate-slide-up" style={{ animationDelay: "0.3s" }}>
              <LiveCampaignsTable campaigns={campaigns} />
            </section>
          </TabsContent>

          <TabsContent value="campaigns" className="space-y-8">
            <section className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
              <LiveCampaignsTable campaigns={campaigns} />
            </section>

            <section className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
              <CampaignsTable campaigns={campaigns} loading={false} />
            </section>
          </TabsContent>
        </Tabs>
      </main>
    </SidebarInset>
  )
}
