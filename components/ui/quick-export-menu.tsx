"use client"

import { useState } from "react"
import { Download, FileText, Table, BarChart3, TrendingUp, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ExportService, type ExportData } from "@/lib/utils/export-utils"
import { useToast } from "@/hooks/use-toast"
import type { Campaign, MetricData, TimeSeriesData } from "@/lib/types"

interface QuickExportMenuProps {
  campaigns: Campaign[]
  metrics: MetricData[]
  timeSeriesData: TimeSeriesData[]
  className?: string
}

export function QuickExportMenu({ campaigns, metrics, timeSeriesData, className }: QuickExportMenuProps) {
  const [isExporting, setIsExporting] = useState<string | null>(null)
  const { toast } = useToast()

  const handleQuickExport = async (type: string, format: "csv" | "pdf") => {
    setIsExporting(`${type}-${format}`)

    try {
      // Simulate processing time
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const timestamp = new Date().toISOString().split("T")[0]

      switch (type) {
        case "campaigns":
          ExportService.exportCampaignsToCSV(campaigns, `campaigns-${timestamp}.csv`)
          break
        case "metrics":
          ExportService.exportMetricsToCSV(metrics, `metrics-${timestamp}.csv`)
          break
        case "timeseries":
          ExportService.exportTimeSeriesDataToCSV(timeSeriesData, `timeseries-${timestamp}.csv`)
          break
        case "full":
          const exportData: ExportData = {
            campaigns,
            metrics,
            timeSeriesData,
            exportDate: new Date().toLocaleDateString(),
            dateRange: "Last 30 days",
          }
          if (format === "csv") {
            ExportService.exportToCSV(exportData, `dashboard-full-${timestamp}.csv`)
          } else {
            ExportService.exportToPDF(exportData, `dashboard-full-${timestamp}.pdf`)
          }
          break
      }

      toast({
        title: "Export Successful",
        description: `Your ${type} data has been exported successfully.`,
      })
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "There was an error exporting your data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsExporting(null)
    }
  }

  const isLoading = (type: string, format: string) => isExporting === `${type}-${format}`

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className={className}>
          <Download className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Quick Export</span>
          <span className="sm:hidden">Export</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 sm:w-64">
        <DropdownMenuLabel>Export Options</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => handleQuickExport("full", "csv")} disabled={isExporting !== null}>
          <Table className="h-4 w-4 mr-2 text-green-600" />
          <div className="flex-1">
            <div className="font-medium text-sm">Full Dashboard (CSV)</div>
            <div className="text-xs text-muted-foreground hidden sm:block">All data in spreadsheet format</div>
          </div>
          {isLoading("full", "csv") && (
            <div className="h-4 w-4 animate-spin border-2 border-primary border-t-transparent rounded-full ml-2" />
          )}
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => handleQuickExport("full", "pdf")} disabled={isExporting !== null}>
          <FileText className="h-4 w-4 mr-2 text-red-600" />
          <div className="flex-1">
            <div className="font-medium text-sm">Full Dashboard (PDF)</div>
            <div className="text-xs text-muted-foreground hidden sm:block">Formatted report document</div>
          </div>
          {isLoading("full", "pdf") && (
            <div className="h-4 w-4 animate-spin border-2 border-primary border-t-transparent rounded-full ml-2" />
          )}
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => handleQuickExport("campaigns", "csv")} disabled={isExporting !== null}>
          <BarChart3 className="h-4 w-4 mr-2 text-purple-600" />
          <div className="flex-1">
            <div className="font-medium text-sm">Campaigns Only</div>
            <div className="text-xs text-muted-foreground">{campaigns.length} campaigns</div>
          </div>
          {isLoading("campaigns", "csv") && (
            <div className="h-4 w-4 animate-spin border-2 border-primary border-t-transparent rounded-full ml-2" />
          )}
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => handleQuickExport("metrics", "csv")} disabled={isExporting !== null}>
          <TrendingUp className="h-4 w-4 mr-2 text-blue-600" />
          <div className="flex-1">
            <div className="font-medium text-sm">Metrics Only</div>
            <div className="text-xs text-muted-foreground">{metrics.length} metrics</div>
          </div>
          {isLoading("metrics", "csv") && (
            <div className="h-4 w-4 animate-spin border-2 border-primary border-t-transparent rounded-full ml-2" />
          )}
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => handleQuickExport("timeseries", "csv")} disabled={isExporting !== null}>
          <Calendar className="h-4 w-4 mr-2 text-orange-600" />
          <div className="flex-1">
            <div className="font-medium text-sm">Time Series Data</div>
            <div className="text-xs text-muted-foreground">{timeSeriesData.length} data points</div>
          </div>
          {isLoading("timeseries", "csv") && (
            <div className="h-4 w-4 animate-spin border-2 border-primary border-t-transparent rounded-full ml-2" />
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
