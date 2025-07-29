"use client"

import { mockData } from "./mock-data"
import type { Campaign } from "@/lib/types"

// Simulate API delays for realistic experience
const simulateDelay = (ms = 800) => new Promise((resolve) => setTimeout(resolve, ms))

// API service class for data management
export class ApiService {
  private static instance: ApiService
  private cache: Map<string, { data: any; timestamp: number; ttl: number }> = new Map()

  static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService()
    }
    return ApiService.instance
  }

  private getCacheKey(endpoint: string, params?: Record<string, any>): string {
    return `${endpoint}_${JSON.stringify(params || {})}`
  }

  private isValidCache(cacheKey: string): boolean {
    const cached = this.cache.get(cacheKey)
    if (!cached) return false
    return Date.now() - cached.timestamp < cached.ttl
  }

  private setCache(cacheKey: string, data: any, ttlMinutes = 5): void {
    this.cache.set(cacheKey, {
      data,
      timestamp: Date.now(),
      ttl: ttlMinutes * 60 * 1000,
    })
  }

  // Dashboard overview data
  async getDashboardOverview(dateRange?: { start: string; end: string }) {
    const cacheKey = this.getCacheKey("dashboard_overview", dateRange)

    if (this.isValidCache(cacheKey)) {
      return this.cache.get(cacheKey)!.data
    }

    await simulateDelay(600)

    const data = {
      metrics: mockData.metrics,
      timeSeriesData: mockData.generateTimeSeriesData(30),
      channelPerformance: mockData.channelPerformance,
      conversionFunnel: mockData.conversionFunnel,
      lastUpdated: new Date().toISOString(),
    }

    this.setCache(cacheKey, data, 5)
    return data
  }

  // Campaign data with filtering and pagination
  async getCampaigns(params?: {
    status?: string
    channel?: string
    page?: number
    limit?: number
    sortBy?: string
    sortOrder?: "asc" | "desc"
  }) {
    const cacheKey = this.getCacheKey("campaigns", params)

    if (this.isValidCache(cacheKey)) {
      return this.cache.get(cacheKey)!.data
    }

    await simulateDelay(400)

    let campaigns = [...mockData.campaigns]

    // Apply filters
    if (params?.status && params.status !== "all") {
      campaigns = campaigns.filter((c) => c.status.toLowerCase() === params.status!.toLowerCase())
    }

    if (params?.channel && params.channel !== "all") {
      campaigns = campaigns.filter((c) => c.channel.toLowerCase() === params.channel!.toLowerCase())
    }

    // Apply sorting
    if (params?.sortBy) {
      campaigns.sort((a, b) => {
        const aVal = a[params.sortBy as keyof Campaign]
        const bVal = b[params.sortBy as keyof Campaign]

        if (params.sortOrder === "desc") {
          return aVal < bVal ? 1 : aVal > bVal ? -1 : 0
        }
        return aVal > bVal ? 1 : aVal < bVal ? -1 : 0
      })
    }

    // Apply pagination
    const page = params?.page || 1
    const limit = params?.limit || 10
    const startIndex = (page - 1) * limit
    const paginatedCampaigns = campaigns.slice(startIndex, startIndex + limit)

    const data = {
      campaigns: paginatedCampaigns,
      pagination: {
        page,
        limit,
        total: campaigns.length,
        totalPages: Math.ceil(campaigns.length / limit),
      },
      lastUpdated: new Date().toISOString(),
    }

    this.setCache(cacheKey, data, 3)
    return data
  }

  // Analytics data with date range support
  async getAnalytics(dateRange: { start: string; end: string }) {
    const cacheKey = this.getCacheKey("analytics", dateRange)

    if (this.isValidCache(cacheKey)) {
      return this.cache.get(cacheKey)!.data
    }

    await simulateDelay(800)

    // Calculate days between dates
    const startDate = new Date(dateRange.start)
    const endDate = new Date(dateRange.end)
    const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))

    const data = {
      timeSeriesData: mockData.generateTimeSeriesData(daysDiff),
      geographic: mockData.geographic,
      devicePerformance: mockData.devicePerformance,
      ageGroups: mockData.ageGroups,
      topKeywords: mockData.topKeywords,
      hourlyData: mockData.generateHourlyData(),
      lastUpdated: new Date().toISOString(),
    }

    this.setCache(cacheKey, data, 10)
    return data
  }

  // Competitor analysis data
  async getCompetitorAnalysis() {
    const cacheKey = this.getCacheKey("competitor_analysis")

    if (this.isValidCache(cacheKey)) {
      return this.cache.get(cacheKey)!.data
    }

    await simulateDelay(1000)

    const data = {
      competitors: mockData.competitors,
      industryBenchmarks: mockData.industryBenchmarks,
      marketTrends: mockData.generateTimeSeriesData(90), // 3 months of market data
      lastUpdated: new Date().toISOString(),
    }

    this.setCache(cacheKey, data, 30) // Cache for 30 minutes
    return data
  }

  // A/B test results
  async getABTestResults() {
    const cacheKey = this.getCacheKey("ab_test_results")

    if (this.isValidCache(cacheKey)) {
      return this.cache.get(cacheKey)!.data
    }

    await simulateDelay(500)

    const data = {
      tests: mockData.abTestResults,
      lastUpdated: new Date().toISOString(),
    }

    this.setCache(cacheKey, data, 15)
    return data
  }

  // Real-time metrics (no caching)
  async getRealTimeMetrics() {
    await simulateDelay(200)

    return {
      activeUsers: Math.floor(Math.random() * 500) + 100,
      currentRevenue: Math.floor(Math.random() * 5000) + 1000,
      conversionRate: (Math.random() * 2 + 3).toFixed(1),
      bounceRate: (Math.random() * 20 + 30).toFixed(1),
      avgSessionDuration: `${Math.floor(Math.random() * 3) + 2}:${Math.floor(Math.random() * 60)
        .toString()
        .padStart(2, "0")}`,
      pageViews: Math.floor(Math.random() * 1000) + 500,
      newSessions: Math.floor(Math.random() * 200) + 50,
      goalCompletions: Math.floor(Math.random() * 50) + 10,
      timestamp: new Date().toISOString(),
    }
  }

  // Clear cache (useful for refresh functionality)
  clearCache(pattern?: string) {
    if (pattern) {
      const keysToDelete = Array.from(this.cache.keys()).filter((key) => key.includes(pattern))
      keysToDelete.forEach((key) => this.cache.delete(key))
    } else {
      this.cache.clear()
    }
  }

  // Get cache statistics
  getCacheStats() {
    return {
      totalEntries: this.cache.size,
      entries: Array.from(this.cache.entries()).map(([key, value]) => ({
        key,
        timestamp: new Date(value.timestamp).toISOString(),
        ttl: value.ttl,
        size: JSON.stringify(value.data).length,
      })),
    }
  }
}

// Export singleton instance
export const apiService = ApiService.getInstance()

// Utility functions for data formatting
export const formatters = {
  currency: (value: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value),

  number: (value: number) => new Intl.NumberFormat("en-US").format(value),

  percentage: (value: number) => `${value.toFixed(1)}%`,

  date: (date: string | Date) =>
    new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(date)),

  dateTime: (date: string | Date) =>
    new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date)),

  duration: (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  },
}
