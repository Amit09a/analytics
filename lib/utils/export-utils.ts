import jsPDF from "jspdf"
import "jspdf-autotable"
import type { Campaign, MetricData, TimeSeriesData } from "@/lib/types"

// Extend jsPDF type to include autoTable
declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: any) => jsPDF
  }
}

export interface ExportData {
  metrics: MetricData[]
  campaigns: Campaign[]
  timeSeriesData: TimeSeriesData[]
  exportDate: string
  dateRange: string
}

export class ExportService {
  private static formatCurrency(value: number): string {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  private static formatNumber(value: number): string {
    return new Intl.NumberFormat("en-US").format(value)
  }

  private static formatPercentage(value: number): string {
    return `${value.toFixed(1)}%`
  }

  // Export to CSV
  static exportToCSV(data: ExportData, filename?: string): void {
    const csvContent = this.generateCSVContent(data)
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    this.downloadFile(blob, filename || `dashboard-export-${Date.now()}.csv`)
  }

  // Export to PDF
  static exportToPDF(data: ExportData, filename?: string): void {
    const pdf = new jsPDF("p", "mm", "a4")
    this.generatePDFContent(pdf, data)
    pdf.save(filename || `dashboard-export-${Date.now()}.pdf`)
  }

  // Export campaigns only to CSV
  static exportCampaignsToCSV(campaigns: Campaign[], filename?: string): void {
    const headers = [
      "Campaign Name",
      "Channel",
      "Status",
      "Budget",
      "Spent",
      "Impressions",
      "Clicks",
      "Conversions",
      "CTR (%)",
      "CPC ($)",
      "ROAS",
      "Start Date",
      "End Date",
      "Objective",
    ]

    const rows = campaigns.map((campaign) => [
      campaign.name,
      campaign.channel,
      campaign.status,
      this.formatCurrency(campaign.budget),
      this.formatCurrency(campaign.spent),
      this.formatNumber(campaign.impressions),
      this.formatNumber(campaign.clicks),
      this.formatNumber(campaign.conversions),
      this.formatPercentage(campaign.ctr),
      campaign.cpc.toFixed(2),
      `${campaign.roas.toFixed(1)}x`,
      campaign.startDate,
      campaign.endDate,
      campaign.objective,
    ])

    const csvContent = this.arrayToCSV([headers, ...rows])
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    this.downloadFile(blob, filename || `campaigns-export-${Date.now()}.csv`)
  }

  // Export metrics to CSV
  static exportMetricsToCSV(metrics: MetricData[], filename?: string): void {
    const headers = ["Metric", "Value", "Change", "Change Type", "Description"]
    const rows = metrics.map((metric) => [
      metric.title,
      metric.value.toString(),
      metric.change,
      metric.changeType,
      metric.description,
    ])

    const csvContent = this.arrayToCSV([headers, ...rows])
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    this.downloadFile(blob, filename || `metrics-export-${Date.now()}.csv`)
  }

  // Export time series data to CSV
  static exportTimeSeriesDataToCSV(timeSeriesData: TimeSeriesData[], filename?: string): void {
    const headers = ["Date", "Revenue", "Users", "Conversions", "Impressions"]
    const rows = timeSeriesData.map((data) => [
      data.date,
      data.revenue.toString(),
      data.users.toString(),
      data.conversions.toString(),
      data.impressions.toString(),
    ])

    const csvContent = this.arrayToCSV([headers, ...rows])
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    this.downloadFile(blob, filename || `timeseries-export-${Date.now()}.csv`)
  }

  private static generateCSVContent(data: ExportData): string {
    let csvContent = ""

    // Add header information
    csvContent += `ADmyBRAND Dashboard Export\n`
    csvContent += `Export Date: ${data.exportDate}\n`
    csvContent += `Date Range: ${data.dateRange}\n\n`

    // Add metrics section
    csvContent += `METRICS\n`
    csvContent += `Metric,Value,Change,Change Type,Description\n`
    data.metrics.forEach((metric) => {
      csvContent += `"${metric.title}","${metric.value}","${metric.change}","${metric.changeType}","${metric.description}"\n`
    })
    csvContent += `\n`

    // Add campaigns section
    csvContent += `CAMPAIGNS\n`
    csvContent += `Campaign Name,Channel,Status,Budget,Spent,Impressions,Clicks,Conversions,CTR (%),CPC ($),ROAS,Start Date,End Date,Objective\n`
    data.campaigns.forEach((campaign) => {
      csvContent += `"${campaign.name}","${campaign.channel}","${campaign.status}","${this.formatCurrency(campaign.budget)}","${this.formatCurrency(campaign.spent)}","${this.formatNumber(campaign.impressions)}","${this.formatNumber(campaign.clicks)}","${this.formatNumber(campaign.conversions)}","${this.formatPercentage(campaign.ctr)}","${campaign.cpc.toFixed(2)}","${campaign.roas.toFixed(1)}x","${campaign.startDate}","${campaign.endDate}","${campaign.objective}"\n`
    })
    csvContent += `\n`

    // Add time series data section
    csvContent += `TIME SERIES DATA\n`
    csvContent += `Date,Revenue,Users,Conversions,Impressions\n`
    data.timeSeriesData.forEach((item) => {
      csvContent += `"${item.date}","${item.revenue}","${item.users}","${item.conversions}","${item.impressions}"\n`
    })

    return csvContent
  }

  private static generatePDFContent(pdf: jsPDF, data: ExportData): void {
    const pageWidth = pdf.internal.pageSize.width
    const pageHeight = pdf.internal.pageSize.height
    let yPosition = 20

    // Add header
    pdf.setFontSize(20)
    pdf.setFont("helvetica", "bold")
    pdf.text("ADmyBRAND Dashboard Export", pageWidth / 2, yPosition, { align: "center" })
    yPosition += 10

    pdf.setFontSize(12)
    pdf.setFont("helvetica", "normal")
    pdf.text(`Export Date: ${data.exportDate}`, pageWidth / 2, yPosition, { align: "center" })
    yPosition += 5
    pdf.text(`Date Range: ${data.dateRange}`, pageWidth / 2, yPosition, { align: "center" })
    yPosition += 15

    // Add metrics section
    pdf.setFontSize(16)
    pdf.setFont("helvetica", "bold")
    pdf.text("Key Metrics", 20, yPosition)
    yPosition += 10

    const metricsData = data.metrics.map((metric) => [
      metric.title,
      metric.value.toString(),
      metric.change,
      metric.changeType,
      metric.description,
    ])

    pdf.autoTable({
      head: [["Metric", "Value", "Change", "Type", "Description"]],
      body: metricsData,
      startY: yPosition,
      theme: "grid",
      headStyles: { fillColor: [34, 139, 230] },
      styles: { fontSize: 10 },
      margin: { left: 20, right: 20 },
    })

    yPosition = (pdf as any).lastAutoTable.finalY + 15

    // Check if we need a new page
    if (yPosition > pageHeight - 60) {
      pdf.addPage()
      yPosition = 20
    }

    // Add campaigns section
    pdf.setFontSize(16)
    pdf.setFont("helvetica", "bold")
    pdf.text("Campaign Performance", 20, yPosition)
    yPosition += 10

    const campaignsData = data.campaigns.map((campaign) => [
      campaign.name,
      campaign.channel,
      campaign.status,
      this.formatCurrency(campaign.budget),
      this.formatCurrency(campaign.spent),
      this.formatNumber(campaign.impressions),
      this.formatNumber(campaign.clicks),
      this.formatNumber(campaign.conversions),
      this.formatPercentage(campaign.ctr),
      `$${campaign.cpc.toFixed(2)}`,
      `${campaign.roas.toFixed(1)}x`,
    ])

    pdf.autoTable({
      head: [
        [
          "Campaign",
          "Channel",
          "Status",
          "Budget",
          "Spent",
          "Impressions",
          "Clicks",
          "Conversions",
          "CTR",
          "CPC",
          "ROAS",
        ],
      ],
      body: campaignsData,
      startY: yPosition,
      theme: "grid",
      headStyles: { fillColor: [34, 139, 230] },
      styles: { fontSize: 8 },
      margin: { left: 20, right: 20 },
      columnStyles: {
        0: { cellWidth: 25 },
        1: { cellWidth: 15 },
        2: { cellWidth: 12 },
        3: { cellWidth: 15 },
        4: { cellWidth: 15 },
        5: { cellWidth: 18 },
        6: { cellWidth: 12 },
        7: { cellWidth: 15 },
        8: { cellWidth: 10 },
        9: { cellWidth: 12 },
        10: { cellWidth: 12 },
      },
    })

    // Add footer
    const totalPages = pdf.getNumberOfPages()
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i)
      pdf.setFontSize(10)
      pdf.setFont("helvetica", "normal")
      pdf.text(`Generated by ADmyBRAND Insights - Page ${i} of ${totalPages}`, pageWidth / 2, pageHeight - 10, {
        align: "center",
      })
    }
  }

  private static arrayToCSV(data: string[][]): string {
    return data.map((row) => row.map((field) => `"${field.toString().replace(/"/g, '""')}"`).join(",")).join("\n")
  }

  private static downloadFile(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }

  // Generate export preview data
  static generateExportPreview(data: ExportData): {
    totalMetrics: number
    totalCampaigns: number
    totalDataPoints: number
    estimatedFileSize: string
  } {
    const csvContent = this.generateCSVContent(data)
    const estimatedSize = new Blob([csvContent]).size

    return {
      totalMetrics: data.metrics.length,
      totalCampaigns: data.campaigns.length,
      totalDataPoints: data.timeSeriesData.length,
      estimatedFileSize: this.formatFileSize(estimatedSize),
    }
  }

  private static formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }
}
