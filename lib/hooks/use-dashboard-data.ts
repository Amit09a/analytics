"use client"

import { useState, useEffect, useCallback } from "react"
import type { Campaign, MetricData, TimeSeriesData } from "@/lib/types"
import { apiService } from "@/lib/data/api-service"

interface DashboardDataState {
  campaigns: Campaign[]
  metrics: MetricData[]
  timeSeriesData: TimeSeriesData[]
  loading: boolean
  error: string | null
  lastUpdated: string | null
}

interface UseDashboardDataOptions {
  autoRefresh?: boolean
  refreshInterval?: number // in milliseconds
  dateRange?: { start: string; end: string }
}

export function useDashboardData(options: UseDashboardDataOptions = {}) {
  const { autoRefresh = false, refreshInterval = 300000, dateRange } = options // Default 5 minutes

  const [state, setState] = useState<DashboardDataState>({
    campaigns: [],
    metrics: [],
    timeSeriesData: [],
    loading: true,
    error: null,
    lastUpdated: null,
  })

  const fetchData = useCallback(
    async (showLoading = true) => {
      try {
        if (showLoading) {
          setState((prev) => ({ ...prev, loading: true, error: null }))
        }

        // Fetch dashboard overview data
        const overviewData = await apiService.getDashboardOverview(dateRange)

        // Fetch campaigns data
        const campaignsData = await apiService.getCampaigns({
          limit: 20,
          sortBy: "spent",
          sortOrder: "desc",
        })

        setState((prev) => ({
          ...prev,
          campaigns: campaignsData.campaigns,
          metrics: overviewData.metrics,
          timeSeriesData: overviewData.timeSeriesData,
          loading: false,
          error: null,
          lastUpdated: overviewData.lastUpdated,
        }))
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to fetch dashboard data"
        setState((prev) => ({
          ...prev,
          loading: false,
          error: errorMessage,
        }))
        console.error("Dashboard data fetch error:", err)
      }
    },
    [dateRange],
  )

  const refreshData = useCallback(async () => {
    // Clear cache to force fresh data
    apiService.clearCache("dashboard_overview")
    apiService.clearCache("campaigns")
    await fetchData(false) // Don't show loading spinner for refresh
  }, [fetchData])

  // Initial data fetch
  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Auto-refresh functionality
  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(() => {
      refreshData()
    }, refreshInterval)

    return () => clearInterval(interval)
  }, [autoRefresh, refreshInterval, refreshData])

  // Derived state for additional metrics
  const derivedMetrics = {
    totalCampaigns: state.campaigns.length,
    activeCampaigns: state.campaigns.filter((c) => c.status === "Active").length,
    totalBudget: state.campaigns.reduce((sum, c) => sum + c.budget, 0),
    totalSpent: state.campaigns.reduce((sum, c) => sum + c.spent, 0),
    avgROAS:
      state.campaigns.length > 0 ? state.campaigns.reduce((sum, c) => sum + c.roas, 0) / state.campaigns.length : 0,
    topPerformingChannel:
      state.campaigns.length > 0
        ? state.campaigns.reduce((prev, current) => (prev.roas > current.roas ? prev : current)).channel
        : null,
  }

  return {
    ...state,
    derivedMetrics,
    refreshData,
    isStale: state.lastUpdated ? Date.now() - new Date(state.lastUpdated).getTime() > refreshInterval : false,
  }
}

// Hook for real-time metrics
export function useRealTimeMetrics(enabled = false) {
  const [metrics, setMetrics] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const fetchRealTimeMetrics = useCallback(async () => {
    if (!enabled) return

    try {
      setLoading(true)
      const data = await apiService.getRealTimeMetrics()
      setMetrics(data)
    } catch (error) {
      console.error("Real-time metrics fetch error:", error)
    } finally {
      setLoading(false)
    }
  }, [enabled])

  useEffect(() => {
    if (!enabled) return

    fetchRealTimeMetrics()
    const interval = setInterval(fetchRealTimeMetrics, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [enabled, fetchRealTimeMetrics])

  return { metrics, loading, refresh: fetchRealTimeMetrics }
}

// Hook for analytics data with date range support
export function useAnalyticsData(dateRange: { start: string; end: string }) {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const analyticsData = await apiService.getAnalytics(dateRange)
      setData(analyticsData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch analytics data")
    } finally {
      setLoading(false)
    }
  }, [dateRange])

  useEffect(() => {
    fetchAnalytics()
  }, [fetchAnalytics])

  return { data, loading, error, refresh: fetchAnalytics }
}
