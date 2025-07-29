import type { Campaign, MetricData, ChartData, TimeSeriesData } from "@/lib/types"

// Utility functions for realistic data generation
const getRandomValue = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min
const getRandomFloat = (min: number, max: number) => Math.random() * (max - min) + min

// Generate realistic time series data with trends and seasonality
export const generateTimeSeriesData = (days = 30): TimeSeriesData[] => {
  const data: TimeSeriesData[] = []
  const baseDate = new Date()
  baseDate.setDate(baseDate.getDate() - days)

  // Base values for realistic scaling
  const baseRevenue = 3500
  const baseUsers = 1800
  const baseConversions = 120
  const baseImpressions = 45000

  for (let i = 0; i < days; i++) {
    const date = new Date(baseDate)
    date.setDate(date.getDate() + i)

    // Create realistic trends with weekly patterns and growth
    const weeklyPattern = Math.sin(((i % 7) * Math.PI) / 3.5) * 0.15 + 1
    const growthTrend = 1 + (i / days) * 0.3 // 30% growth over period
    const randomVariation = 0.85 + Math.random() * 0.3 // ±15% random variation
    const seasonality = Math.sin(i / 10) * 0.1 + 1 // Seasonal variation

    const multiplier = weeklyPattern * growthTrend * randomVariation * seasonality

    // Weekend dips (Saturday = 6, Sunday = 0)
    const dayOfWeek = date.getDay()
    const weekendMultiplier = dayOfWeek === 0 || dayOfWeek === 6 ? 0.7 : 1

    data.push({
      date: date.toISOString().split("T")[0],
      revenue: Math.round(baseRevenue * multiplier * weekendMultiplier),
      users: Math.round(baseUsers * multiplier * weekendMultiplier),
      conversions: Math.round(baseConversions * multiplier * weekendMultiplier),
      impressions: Math.round(baseImpressions * multiplier * weekendMultiplier),
    })
  }

  return data
}

// Enhanced campaign data with realistic metrics
export const mockCampaigns: Campaign[] = [
  {
    id: "camp_001",
    name: "Summer Sale 2024 - Social Media Blitz",
    channel: "Social Media",
    status: "Active",
    budget: 8500,
    spent: 6240,
    impressions: 245000,
    clicks: 4680,
    conversions: 312,
    ctr: 1.91,
    cpc: 1.33,
    roas: 5.2,
    startDate: "2024-06-01",
    endDate: "2024-08-31",
    targetAudience: "Ages 25-45, Fashion & Lifestyle",
    objective: "Drive Sales & Brand Awareness",
  },
  {
    id: "camp_002",
    name: "Q3 Brand Awareness - Display Network",
    channel: "Display",
    status: "Active",
    budget: 12000,
    spent: 9800,
    impressions: 1250000,
    clicks: 6250,
    conversions: 425,
    ctr: 0.5,
    cpc: 1.57,
    roas: 3.8,
    startDate: "2024-07-01",
    endDate: "2024-09-30",
    targetAudience: "Broad Audience, 18-65, High Income",
    objective: "Brand Awareness & Reach",
  },
  {
    id: "camp_003",
    name: "Weekly Newsletter - Customer Retention",
    channel: "Email",
    status: "Active",
    budget: 3500,
    spent: 2890,
    impressions: 85000,
    clicks: 3400,
    conversions: 510,
    ctr: 4.0,
    cpc: 0.85,
    roas: 7.2,
    startDate: "2024-05-01",
    endDate: "2024-12-31",
    targetAudience: "Existing Customers & Subscribers",
    objective: "Customer Retention & Upselling",
  },
  {
    id: "camp_004",
    name: "High-Intent Search Campaign",
    channel: "Search",
    status: "Active",
    budget: 15000,
    spent: 12400,
    impressions: 180000,
    clicks: 7200,
    conversions: 864,
    ctr: 4.0,
    cpc: 1.72,
    roas: 6.8,
    startDate: "2024-06-15",
    endDate: "2024-12-31",
    targetAudience: "High-Intent Searchers, Purchase Ready",
    objective: "Lead Generation & Sales",
  },
  {
    id: "camp_005",
    name: "Product Demo Video Campaign",
    channel: "Video",
    status: "Paused",
    budget: 7500,
    spent: 3200,
    impressions: 320000,
    clicks: 2560,
    conversions: 128,
    ctr: 0.8,
    cpc: 1.25,
    roas: 2.4,
    startDate: "2024-07-01",
    endDate: "2024-08-31",
    targetAudience: "Video Consumers, 18-35, Tech Savvy",
    objective: "Product Education & Awareness",
  },
  {
    id: "camp_006",
    name: "Influencer Partnership - Lifestyle Brand",
    channel: "Influencer",
    status: "Active",
    budget: 20000,
    spent: 16500,
    impressions: 680000,
    clicks: 10200,
    conversions: 612,
    ctr: 1.5,
    cpc: 1.62,
    roas: 4.9,
    startDate: "2024-07-15",
    endDate: "2024-10-15",
    targetAudience: "Lifestyle Enthusiasts, 20-40, Social Media Active",
    objective: "Brand Partnership & Authenticity",
  },
  {
    id: "camp_007",
    name: "Black Friday Early Bird Campaign",
    channel: "Search",
    status: "Draft",
    budget: 25000,
    spent: 0,
    impressions: 0,
    clicks: 0,
    conversions: 0,
    ctr: 0,
    cpc: 0,
    roas: 0,
    startDate: "2024-11-01",
    endDate: "2024-11-30",
    targetAudience: "Deal Seekers, Previous Customers",
    objective: "Holiday Sales Preparation",
  },
  {
    id: "camp_008",
    name: "Retargeting Campaign - Cart Abandoners",
    channel: "Display",
    status: "Active",
    budget: 5500,
    spent: 4200,
    impressions: 95000,
    clicks: 1900,
    conversions: 285,
    ctr: 2.0,
    cpc: 2.21,
    roas: 8.1,
    startDate: "2024-06-01",
    endDate: "2024-12-31",
    targetAudience: "Cart Abandoners, Website Visitors",
    objective: "Conversion Recovery",
  },
]

// Enhanced metrics with realistic trends
export const mockMetrics: MetricData[] = [
  {
    title: "Total Revenue",
    value: "$127,845.32",
    change: "+23.5%",
    changeType: "positive",
    icon: "DollarSign",
    description: "from last month",
    trend: [98500, 105200, 112800, 118900, 123400, 125600, 127845],
  },
  {
    title: "Active Users",
    value: "8,247",
    change: "+12.8%",
    changeType: "positive",
    icon: "Users",
    description: "from last month",
    trend: [6800, 7100, 7350, 7600, 7850, 8050, 8247],
  },
  {
    title: "Total Conversions",
    value: "3,156",
    change: "+18.2%",
    changeType: "positive",
    icon: "TrendingUp",
    description: "from last month",
    trend: [2450, 2580, 2720, 2890, 3020, 3100, 3156],
  },
  {
    title: "Avg. Conversion Rate",
    value: "4.8%",
    change: "-0.3%",
    changeType: "negative",
    icon: "Zap",
    description: "from last month",
    trend: [5.2, 5.1, 4.9, 4.8, 4.7, 4.8, 4.8],
  },
]

// Enhanced channel performance data
export const channelPerformanceData: ChartData[] = [
  {
    name: "Search Ads",
    value: 4850,
    fill: "hsl(var(--chart-1))",
    campaigns: 15,
    avgCTR: 3.8,
    avgCPC: 1.65,
    totalSpent: 27400,
    conversions: 1476,
  },
  {
    name: "Social Media",
    value: 3920,
    fill: "hsl(var(--chart-2))",
    campaigns: 12,
    avgCTR: 1.9,
    avgCPC: 1.33,
    totalSpent: 14740,
    conversions: 936,
  },
  {
    name: "Email Marketing",
    value: 3100,
    fill: "hsl(var(--chart-3))",
    campaigns: 8,
    avgCTR: 4.0,
    avgCPC: 0.85,
    totalSpent: 6390,
    conversions: 1020,
  },
  {
    name: "Display Ads",
    value: 2680,
    fill: "hsl(var(--chart-4))",
    campaigns: 6,
    avgCTR: 0.75,
    avgCPC: 1.89,
    totalSpent: 14000,
    conversions: 710,
  },
  {
    name: "Video Ads",
    value: 1950,
    fill: "hsl(var(--chart-5))",
    campaigns: 4,
    avgCTR: 0.8,
    avgCPC: 1.25,
    totalSpent: 10700,
    conversions: 256,
  },
]

// Realistic conversion funnel data
export const conversionFunnelData: ChartData[] = [
  { name: "Impressions", value: 2850000, stage: "awareness", conversionRate: 100 },
  { name: "Clicks", value: 57000, stage: "interest", conversionRate: 2.0 },
  { name: "Landing Page Views", value: 51300, stage: "consideration", conversionRate: 90.0 },
  { name: "Add to Cart", value: 12825, stage: "intent", conversionRate: 25.0 },
  { name: "Checkout Started", value: 7695, stage: "evaluation", conversionRate: 60.0 },
  { name: "Purchase Completed", value: 3156, stage: "conversion", conversionRate: 41.0 },
]

// Industry benchmark data for comparison
export const industryBenchmarks = {
  avgCTR: {
    "Search Ads": 3.17,
    "Social Media": 1.85,
    "Email Marketing": 3.42,
    "Display Ads": 0.63,
    "Video Ads": 0.84,
  },
  avgCPC: {
    "Search Ads": 2.12,
    "Social Media": 1.86,
    "Email Marketing": 0.78,
    "Display Ads": 2.14,
    "Video Ads": 1.45,
  },
  avgConversionRate: {
    "Search Ads": 4.2,
    "Social Media": 2.8,
    "Email Marketing": 6.1,
    "Display Ads": 2.1,
    "Video Ads": 1.9,
  },
}

// Geographic performance data
export const geographicData: ChartData[] = [
  { name: "United States", value: 45200, fill: "hsl(var(--chart-1))", percentage: 42.5 },
  { name: "Canada", value: 18900, fill: "hsl(var(--chart-2))", percentage: 17.8 },
  { name: "United Kingdom", value: 15600, fill: "hsl(var(--chart-3))", percentage: 14.7 },
  { name: "Germany", value: 12300, fill: "hsl(var(--chart-4))", percentage: 11.6 },
  { name: "Australia", value: 8900, fill: "hsl(var(--chart-5))", percentage: 8.4 },
  { name: "Other", value: 5400, fill: "hsl(var(--muted-foreground))", percentage: 5.0 },
]

// Device performance data
export const devicePerformanceData: ChartData[] = [
  {
    name: "Mobile",
    value: 58.3,
    fill: "hsl(var(--chart-1))",
    sessions: 48200,
    conversions: 1840,
    conversionRate: 3.8,
    avgSessionDuration: "2:34",
  },
  {
    name: "Desktop",
    value: 32.1,
    fill: "hsl(var(--chart-2))",
    sessions: 26500,
    conversions: 1156,
    conversionRate: 4.4,
    avgSessionDuration: "4:12",
  },
  {
    name: "Tablet",
    value: 9.6,
    fill: "hsl(var(--chart-3))",
    sessions: 7900,
    conversions: 160,
    conversionRate: 2.0,
    avgSessionDuration: "3:45",
  },
]

// Age group performance data
export const ageGroupData: ChartData[] = [
  { name: "18-24", value: 1250, fill: "hsl(var(--chart-1))", percentage: 15.2 },
  { name: "25-34", value: 2890, fill: "hsl(var(--chart-2))", percentage: 35.1 },
  { name: "35-44", value: 2340, fill: "hsl(var(--chart-3))", percentage: 28.4 },
  { name: "45-54", value: 1180, fill: "hsl(var(--chart-4))", percentage: 14.3 },
  { name: "55-64", value: 420, fill: "hsl(var(--chart-5))", percentage: 5.1 },
  { name: "65+", value: 156, fill: "hsl(var(--muted-foreground))", percentage: 1.9 },
]

// Top performing keywords data
export const topKeywords = [
  { keyword: "digital marketing agency", impressions: 45200, clicks: 1810, ctr: 4.0, avgPosition: 2.1, cost: 3620 },
  { keyword: "social media marketing", impressions: 38900, clicks: 1556, ctr: 4.0, avgPosition: 1.8, cost: 2890 },
  { keyword: "ppc management", impressions: 29800, clicks: 1192, ctr: 4.0, avgPosition: 2.3, cost: 2384 },
  { keyword: "seo services", impressions: 52100, clicks: 1563, ctr: 3.0, avgPosition: 3.2, cost: 1875 },
  { keyword: "content marketing", impressions: 34600, clicks: 1038, ctr: 3.0, avgPosition: 2.9, cost: 1557 },
  { keyword: "email marketing", impressions: 28400, clicks: 852, ctr: 3.0, avgPosition: 2.6, cost: 1278 },
  { keyword: "marketing automation", impressions: 19200, clicks: 576, ctr: 3.0, avgPosition: 3.1, cost: 1152 },
  { keyword: "brand strategy", impressions: 15800, clicks: 474, ctr: 3.0, avgPosition: 2.8, cost: 948 },
]

// Competitor analysis data
export const competitorData = [
  {
    name: "Competitor A",
    marketShare: 28.5,
    avgCPC: 2.45,
    estimatedBudget: 85000,
    topKeywords: ["digital marketing", "ppc management", "seo services"],
    adStrength: "High",
  },
  {
    name: "Competitor B",
    marketShare: 22.1,
    avgCPC: 1.98,
    estimatedBudget: 62000,
    topKeywords: ["social media marketing", "content marketing"],
    adStrength: "Medium",
  },
  {
    name: "Competitor C",
    marketShare: 18.7,
    avgCPC: 2.12,
    estimatedBudget: 48000,
    topKeywords: ["email marketing", "marketing automation"],
    adStrength: "Medium",
  },
  {
    name: "Our Company",
    marketShare: 15.2,
    avgCPC: 1.65,
    estimatedBudget: 45000,
    topKeywords: ["digital marketing agency", "brand strategy"],
    adStrength: "High",
  },
]

// Generate hourly performance data for today
export const generateHourlyData = () => {
  const hours = Array.from({ length: 24 }, (_, i) => {
    const hour = i
    const baseTraffic = hour < 6 ? 0.3 : hour < 9 ? 0.6 : hour < 17 ? 1.0 : hour < 22 ? 0.8 : 0.4
    const randomVariation = 0.8 + Math.random() * 0.4

    return {
      hour: `${hour.toString().padStart(2, "0")}:00`,
      traffic: Math.round(baseTraffic * randomVariation * 100),
      conversions: Math.round(baseTraffic * randomVariation * 8),
      revenue: Math.round(baseTraffic * randomVariation * 450),
    }
  })

  return hours
}

// A/B test results data
export const abTestResults = [
  {
    testName: "Homepage Hero CTA",
    variant: "Control",
    visitors: 5240,
    conversions: 262,
    conversionRate: 5.0,
    confidence: 95,
    status: "Winner",
  },
  {
    testName: "Homepage Hero CTA",
    variant: "Variant A",
    visitors: 5180,
    conversions: 337,
    conversionRate: 6.5,
    confidence: 98,
    status: "Winner",
  },
  {
    testName: "Email Subject Line",
    variant: "Control",
    visitors: 12500,
    conversions: 875,
    conversionRate: 7.0,
    confidence: 85,
    status: "Running",
  },
  {
    testName: "Email Subject Line",
    variant: "Variant B",
    visitors: 12300,
    conversions: 984,
    conversionRate: 8.0,
    confidence: 92,
    status: "Running",
  },
]

// Export all data for easy access
export const mockData = {
  campaigns: mockCampaigns,
  metrics: mockMetrics,
  channelPerformance: channelPerformanceData,
  conversionFunnel: conversionFunnelData,
  geographic: geographicData,
  devicePerformance: devicePerformanceData,
  ageGroups: ageGroupData,
  topKeywords,
  competitors: competitorData,
  industryBenchmarks,
  abTestResults,
  generateTimeSeriesData,
  generateHourlyData,
}
