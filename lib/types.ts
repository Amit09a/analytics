export interface Campaign {
  id: string
  name: string
  channel: "Social Media" | "Display" | "Email" | "Search" | "Video" | "Influencer"
  status: "Active" | "Paused" | "Completed" | "Draft"
  budget: number
  spent: number
  impressions: number
  clicks: number
  conversions: number
  ctr: number
  cpc: number
  roas: number
  startDate: string
  endDate: string
  targetAudience: string
  objective: string
}

export interface MetricData {
  title: string
  value: string | number
  change: string
  changeType: "positive" | "negative" | "neutral"
  icon: string
  description: string
  trend: number[]
}

export interface ChartData {
  name: string
  value: number
  fill?: string
  [key: string]: any
}

export interface TimeSeriesData {
  date: string
  revenue: number
  users: number
  conversions: number
  impressions: number
}

export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
