"use client"

import type React from "react"

import { useState } from "react"
import { Download, FileText, Table, Calendar, BarChart3, TrendingUp, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ExportService, type ExportData } from "@/lib/utils/export-utils"
import { useToast } from "@/hooks/use-toast"
import { LoadingSkeleton } from "@/components/ui/loading-skeleton"

interface ExportDialogProps {
  data: ExportData
  trigger?: React.ReactNode
  onExportComplete?: (format: string, filename: string) => void
}

export function ExportDialog({ data, trigger, onExportComplete }: ExportDialogProps) {
  const [open, setOpen] = useState(false)
  const [format, setFormat] = useState<"csv" | "pdf">("csv")
  const [filename, setFilename] = useState("")
  const [includeMetrics, setIncludeMetrics] = useState(true)
  const [includeCampaigns, setIncludeCampaigns] = useState(true)
  const [includeTimeSeriesData, setIncludeTimeSeriesData] = useState(true)
  const [isExporting, setIsExporting] = useState(false)
  const [exportComplete, setExportComplete] = useState(false)

  const { toast } = useToast()

  const preview = ExportService.generateExportPreview(data)

  const handleExport = async () => {
    if (!filename.trim()) {
      toast({
        title: "Filename Required",
        description: "Please enter a filename for your export.",
        variant: "destructive",
      })
      return
    }

    setIsExporting(true)

    try {
      // Simulate processing time for better UX
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const exportData: ExportData = {
        ...data,
        metrics: includeMetrics ? data.metrics : [],
        campaigns: includeCampaigns ? data.campaigns : [],
        timeSeriesData: includeTimeSeriesData ? data.timeSeriesData : [],
      }

      const finalFilename = `${filename}.${format}`

      if (format === "csv") {
        ExportService.exportToCSV(exportData, finalFilename)
      } else {
        ExportService.exportToPDF(exportData, finalFilename)
      }

      setExportComplete(true)

      toast({
        title: "Export Successful",
        description: `Your dashboard data has been exported as ${finalFilename}`,
      })

      onExportComplete?.(format, finalFilename)

      // Reset state after a delay
      setTimeout(() => {
        setExportComplete(false)
        setIsExporting(false)
        setOpen(false)
      }, 2000)
    } catch (error) {
      setIsExporting(false)
      toast({
        title: "Export Failed",
        description: "There was an error exporting your data. Please try again.",
        variant: "destructive",
      })
    }
  }

  const resetDialog = () => {
    setFormat("csv")
    setFilename("")
    setIncludeMetrics(true)
    setIncludeCampaigns(true)
    setIncludeTimeSeriesData(true)
    setIsExporting(false)
    setExportComplete(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        setOpen(newOpen)
        if (!newOpen) {
          setTimeout(resetDialog, 300)
        }
      }}
    >
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export Dashboard Data
          </DialogTitle>
          <DialogDescription>
            Export your dashboard data in CSV or PDF format. Choose what data to include and customize your export.
          </DialogDescription>
        </DialogHeader>

        {isExporting ? (
          <div className="space-y-6 py-6">
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 relative">
                <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">
                  {exportComplete ? "Export Complete!" : "Preparing Your Export..."}
                </h3>
                <p className="text-muted-foreground">
                  {exportComplete
                    ? "Your file has been downloaded successfully."
                    : "Please wait while we generate your file."}
                </p>
              </div>
              {exportComplete && <CheckCircle className="h-12 w-12 text-green-500 mx-auto animate-scale-in" />}
            </div>

            {!exportComplete && (
              <div className="space-y-3">
                <LoadingSkeleton variant="shimmer" className="h-4 w-full" />
                <LoadingSkeleton variant="shimmer" className="h-4 w-3/4" />
                <LoadingSkeleton variant="shimmer" className="h-4 w-1/2" />
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Export Format Selection */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Export Format</Label>
              <RadioGroup value={format} onValueChange={(value) => setFormat(value as "csv" | "pdf")}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value="csv" id="csv" />
                    <div className="flex items-center space-x-2 flex-1">
                      <Table className="h-5 w-5 text-green-600" />
                      <div>
                        <Label htmlFor="csv" className="font-medium cursor-pointer">
                          CSV File
                        </Label>
                        <p className="text-xs text-muted-foreground">Spreadsheet compatible</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value="pdf" id="pdf" />
                    <div className="flex items-center space-x-2 flex-1">
                      <FileText className="h-5 w-5 text-red-600" />
                      <div>
                        <Label htmlFor="pdf" className="font-medium cursor-pointer">
                          PDF Report
                        </Label>
                        <p className="text-xs text-muted-foreground">Formatted document</p>
                      </div>
                    </div>
                  </div>
                </div>
              </RadioGroup>
            </div>

            <Separator />

            {/* Data Selection */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Include Data</Label>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Checkbox id="metrics" checked={includeMetrics} onCheckedChange={setIncludeMetrics} />
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-blue-600" />
                      <Label htmlFor="metrics" className="font-medium cursor-pointer">
                        Key Metrics
                      </Label>
                    </div>
                  </div>
                  <Badge variant="secondary">{data.metrics.length} items</Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Checkbox id="campaigns" checked={includeCampaigns} onCheckedChange={setIncludeCampaigns} />
                    <div className="flex items-center space-x-2">
                      <BarChart3 className="h-4 w-4 text-purple-600" />
                      <Label htmlFor="campaigns" className="font-medium cursor-pointer">
                        Campaign Data
                      </Label>
                    </div>
                  </div>
                  <Badge variant="secondary">{data.campaigns.length} campaigns</Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="timeseries"
                      checked={includeTimeSeriesData}
                      onCheckedChange={setIncludeTimeSeriesData}
                    />
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-orange-600" />
                      <Label htmlFor="timeseries" className="font-medium cursor-pointer">
                        Time Series Data
                      </Label>
                    </div>
                  </div>
                  <Badge variant="secondary">{data.timeSeriesData.length} data points</Badge>
                </div>
              </div>
            </div>

            <Separator />

            {/* Filename Input */}
            <div className="space-y-2">
              <Label htmlFor="filename" className="text-base font-semibold">
                Filename
              </Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="filename"
                  placeholder="dashboard-export"
                  value={filename}
                  onChange={(e) => setFilename(e.target.value)}
                  className="flex-1"
                />
                <Badge variant="outline">.{format}</Badge>
              </div>
            </div>

            {/* Export Preview */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Export Preview</CardTitle>
                <CardDescription className="text-xs">Summary of data to be exported</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Metrics:</span>
                    <span className="font-medium">{includeMetrics ? preview.totalMetrics : 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Campaigns:</span>
                    <span className="font-medium">{includeCampaigns ? preview.totalCampaigns : 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Data Points:</span>
                    <span className="font-medium">{includeTimeSeriesData ? preview.totalDataPoints : 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Est. Size:</span>
                    <span className="font-medium">{preview.estimatedFileSize}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {!isExporting && (
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleExport}
              disabled={!filename.trim() || (!includeMetrics && !includeCampaigns && !includeTimeSeriesData)}
            >
              <Download className="h-4 w-4 mr-2" />
              Export {format.toUpperCase()}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}
