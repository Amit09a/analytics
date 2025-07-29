"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { apiService } from "@/lib/data/api-service"

interface RealTimeMetrics {
  activeUsers: number
  currentRevenue: number
  conversionRate: number
  bounceRate: number
  avgSessionDuration: string
  pageViews: number
  newSessions: number
  goalCompletions: number
  timestamp: string
}

interface RealTimeActivity {
  id: string
  type: "conversion" | "signup" | "purchase" | "pageview" | "click"
  description: string
  value?: number
  location?: string
  timestamp: string
  channel?: string
}

interface RealTimeState {
  metrics: RealTimeMetrics | null
  activities: RealTimeActivity[]
  isConnected: boolean
  lastUpdate: string | null
  error: string | null
}

interface UseRealTimeUpdatesOptions {
  enabled?: boolean
  metricsInterval?: number // milliseconds
  activitiesInterval?: number // milliseconds
  maxActivities?: number
}

export function useRealTimeUpdates(options: UseRealTimeUpdatesOptions = {}) {
  const {
    enabled = true,
    metricsInterval = 5000, // 5 seconds
    activitiesInterval = 2000, // 2 seconds
    maxActivities = 50,
  } = options

  const [state, setState] = useState<RealTimeState>({
    metrics: null,
    activities: [],
    isConnected: false,
    lastUpdate: null,
    error: null,
  })

  const metricsIntervalRef = useRef<NodeJS.Timeout>()
  const activitiesIntervalRef = useRef<NodeJS.Timeout>()
  const connectionTimeoutRef = useRef<NodeJS.Timeout>()

  // Generate realistic real-time activities
  const generateActivity = useCallback((): RealTimeActivity => {
    const activities = [
      {
        type: "conversion" as const,
        descriptions: [
          "completed a purchase",
          "signed up for newsletter",
          "downloaded whitepaper",
          "requested demo",
          "filled contact form",
        ],
        values: [25, 50, 75, 100, 150, 200, 300, 500],
        channels: ["Search", "Social Media", "Email", "Direct", "Referral"],
      },
      {
        type: "signup" as const,
        descriptions: ["created new account", "joined webinar", "subscribed to updates"],
        channels: ["Social Media", "Search", "Email", "Direct"],
      },
      {
        type: "purchase" as const,
        descriptions: ["purchased premium plan", "bought product", "upgraded subscription"],
        values: [99, 199, 299, 499, 999, 1499],
        channels: ["Search", "Email", "Direct", "Social Media"],
      },
      {
        type: "pageview" as const,
        descriptions: [
          "viewed pricing page",
          "visited product demo",
          "browsed case studies",
          "checked testimonials",
          "explored features",
        ],
        channels: ["Search", "Social Media", "Direct", "Referral"],
      },
      {
        type: "click" as const,
        descriptions: [
          "clicked CTA button",
          "opened email campaign",
          "clicked social ad",
          "engaged with video",
          "downloaded resource",
        ],
        channels: ["Email", "Social Media", "Display", "Video"],
      },
    ]

    const locations = [
      "New York, US",
      "Los Angeles, US",
      "London, UK",
      "Toronto, CA",
      "Sydney, AU",
      "Berlin, DE",
      "Paris, FR",
      "Tokyo, JP",
      "Singapore, SG",
      "Amsterdam, NL",
    ]

    const activityType = activities[Math.floor(Math.random() * activities.length)]
    const description = activityType.descriptions[Math.floor(Math.random() * activityType.descriptions.length)]
    const channel = activityType.channels[Math.floor(Math.random() * activityType.channels.length)]
    const location = locations[Math.floor(Math.random() * locations.length)]

    return {
      id: `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: activityType.type,
      description,
      value: activityType.values
        ? activityType.values[Math.floor(Math.random() * activityType.values.length)]
        : undefined,
      location,
      channel,
      timestamp: new Date().toISOString(),
    }
  }, [])

  // Fetch real-time metrics
  const fetchMetrics = useCallback(async () => {
    if (!enabled) return

    try {
      const metrics = await apiService.getRealTimeMetrics()
      setState((prev) => ({
        ...prev,
        metrics,
        lastUpdate: new Date().toISOString(),
        error: null,
        isConnected: true,
      }))
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : "Failed to fetch real-time metrics",
        isConnected: false,
      }))
    }
  }, [enabled])

  // Add new activity
  const addActivity = useCallback(() => {
    if (!enabled) return

    const newActivity = generateActivity()
    setState((prev) => ({
      ...prev,
      activities: [newActivity, ...prev.activities.slice(0, maxActivities - 1)],
      lastUpdate: new Date().toISOString(),
    }))
  }, [enabled, generateActivity, maxActivities])

  // Start real-time updates
  const startUpdates = useCallback(() => {
    if (!enabled) return

    // Initial fetch
    fetchMetrics()
    addActivity()

    // Set up intervals
    metricsIntervalRef.current = setInterval(fetchMetrics, metricsInterval)
    activitiesIntervalRef.current = setInterval(addActivity, activitiesInterval)

    // Connection timeout simulation
    connectionTimeoutRef.current = setTimeout(() => {
      setState((prev) => ({ ...prev, isConnected: true }))
    }, 1000)
  }, [enabled, fetchMetrics, addActivity, metricsInterval, activitiesInterval])

  // Stop real-time updates
  const stopUpdates = useCallback(() => {
    if (metricsIntervalRef.current) {
      clearInterval(metricsIntervalRef.current)
    }
    if (activitiesIntervalRef.current) {
      clearInterval(activitiesIntervalRef.current)
    }
    if (connectionTimeoutRef.current) {
      clearTimeout(connectionTimeoutRef.current)
    }
    setState((prev) => ({ ...prev, isConnected: false }))
  }, [])

  // Toggle real-time updates
  const toggleUpdates = useCallback(() => {
    if (state.isConnected) {
      stopUpdates()
    } else {
      startUpdates()
    }
  }, [state.isConnected, startUpdates, stopUpdates])

  // Clear activities
  const clearActivities = useCallback(() => {
    setState((prev) => ({ ...prev, activities: [] }))
  }, [])

  // Effect to manage updates
  useEffect(() => {
    if (enabled) {
      startUpdates()
    }

    return () => {
      stopUpdates()
    }
  }, [enabled, startUpdates, stopUpdates])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopUpdates()
    }
  }, [stopUpdates])

  return {
    ...state,
    toggleUpdates,
    clearActivities,
    startUpdates,
    stopUpdates,
  }
}

// Hook for real-time chart data updates
export function useRealTimeChartData(enabled = true, interval = 10000) {
  const [chartData, setChartData] = useState<any[]>([])
  const [isUpdating, setIsUpdating] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout>()

  const generateDataPoint = useCallback(() => {
    const now = new Date()
    const timeLabel = now.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })

    return {
      time: timeLabel,
      timestamp: now.getTime(),
      revenue: Math.floor(Math.random() * 1000) + 500,
      users: Math.floor(Math.random() * 100) + 50,
      conversions: Math.floor(Math.random() * 20) + 5,
      bounceRate: Math.floor(Math.random() * 30) + 20,
    }
  }, [])

  const updateChartData = useCallback(() => {
    if (!enabled) return

    setIsUpdating(true)
    const newDataPoint = generateDataPoint()

    setChartData((prev) => {
      const updated = [...prev, newDataPoint]
      // Keep only last 20 data points
      return updated.slice(-20)
    })

    setTimeout(() => setIsUpdating(false), 500)
  }, [enabled, generateDataPoint])

  useEffect(() => {
    if (!enabled) return

    // Initial data
    const initialData = Array.from({ length: 10 }, () => generateDataPoint())
    setChartData(initialData)

    // Set up interval
    intervalRef.current = setInterval(updateChartData, interval)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [enabled, interval, updateChartData, generateDataPoint])

  return {
    chartData,
    isUpdating,
    clearData: () => setChartData([]),
  }
}

// Hook for simulating live campaign performance updates
export function useLiveCampaignUpdates(campaigns: any[], enabled = true, interval = 15000) {
  const [updatedCampaigns, setUpdatedCampaigns] = useState(campaigns)
  const [recentUpdates, setRecentUpdates] = useState<string[]>([])
  const intervalRef = useRef<NodeJS.Timeout>()

  const updateCampaignMetrics = useCallback(() => {
    if (!enabled || campaigns.length === 0) return

    setUpdatedCampaigns((prev) => {
      const updated = prev.map((campaign) => {
        // Only update active campaigns
        if (campaign.status !== "Active") return campaign

        // Small random changes to simulate real-time updates
        const spentIncrease = Math.floor(Math.random() * 50) + 10
        const impressionsIncrease = Math.floor(Math.random() * 1000) + 100
        const clicksIncrease = Math.floor(Math.random() * 20) + 2
        const conversionsIncrease = Math.floor(Math.random() * 3)

        const newSpent = Math.min(campaign.spent + spentIncrease, campaign.budget)
        const newImpressions = campaign.impressions + impressionsIncrease
        const newClicks = campaign.clicks + clicksIncrease
        const newConversions = campaign.conversions + conversionsIncrease

        // Recalculate derived metrics
        const newCTR = ((newClicks / newImpressions) * 100).toFixed(2)
        const newCPC = (newSpent / newClicks).toFixed(2)
        const newROAS = (newConversions * 100) / newSpent

        return {
          ...campaign,
          spent: newSpent,
          impressions: newImpressions,
          clicks: newClicks,
          conversions: newConversions,
          ctr: Number.parseFloat(newCTR),
          cpc: Number.parseFloat(newCPC),
          roas: Number.parseFloat(newROAS.toFixed(1)),
        }
      })

      // Track which campaigns were updated
      const updatedCampaignNames = updated
        .filter((campaign, index) => campaign.spent !== prev[index]?.spent)
        .map((campaign) => campaign.name)

      if (updatedCampaignNames.length > 0) {
        setRecentUpdates(updatedCampaignNames)
        // Clear recent updates after 5 seconds
        setTimeout(() => setRecentUpdates([]), 5000)
      }

      return updated
    })
  }, [enabled, campaigns])

  useEffect(() => {
    setUpdatedCampaigns(campaigns)
  }, [campaigns])

  useEffect(() => {
    if (!enabled) return

    intervalRef.current = setInterval(updateCampaignMetrics, interval)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [enabled, interval, updateCampaignMetrics])

  return {
    campaigns: updatedCampaigns,
    recentUpdates,
  }
}
