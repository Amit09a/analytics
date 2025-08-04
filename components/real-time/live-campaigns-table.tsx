"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Activity, Pause, Play, TrendingUp, TrendingDown } from "lucide-react"
import { useLiveCampaignUpdates } from "@/lib/hooks/use-real-time-updates"
import { formatters } from "@/lib/data/api-service"
import type { Campaign } from "@/lib/types"

interface LiveCampaignsTableProps {
  campaigns: Campaign[]
  className?: string
}

export function LiveCampaignsTable({ campaigns: initialCampaigns, className = "" }: LiveCampaignsTableProps) {
  const [isEnabled, setIsEnabled] = useState(true)
  const { campaigns, recentUpdates } = useLiveCampaignUpdates(initialCampaigns, isEnabled, 12000)

  const toggleUpdates = () => {
    setIsEnabled(!isEnabled)
  }

  const isRecentlyUpdated = (campaignName: string) => {
    return recentUpdates.includes(campaignName)
  }

  const getStatusBadge = (status: Campaign["status"]) => {
    const variants = {
      Active: "default",
      Completed: "secondary",
      Paused: "outline",
      Draft: "outline",
    } as const

    return (
      <Badge variant={variants[status]} className="transition-all duration-200">
        {status}
      </Badge>
    )
  }

  const getROASColor = (roas: number) => {
    if (roas >= 5) return "text-green-600"
    if (roas >= 3) return "text-yellow-600"
    return "text-red-600"
  }

  const getROASTrend = (roas: number) => {
    // Simulate trend based on ROAS value
    if (roas >= 4) return <TrendingUp className="h-3 w-3 text-green-500" />
    if (roas >= 2.5) return <TrendingUp className="h-3 w-3 text-yellow-500" />
    return <TrendingDown className="h-3 w-3 text-red-500" />
  }

  return (
    <Card className={`transition-all duration-300 hover:shadow-lg ${className}`}>
      <CardHeader className="pb-3 p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-base sm:text-lg font-semibold flex items-center gap-2">
              <Activity className={`h-4 w-4 ${isEnabled ? "animate-pulse text-green-500" : "text-muted-foreground"}`} />
              Live Campaign Performance
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">Real-time campaign metrics and updates</CardDescription>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <Badge variant={isEnabled ? "default" : "secondary"} className="text-xs">
              {isEnabled ? "Live Updates" : "Paused"}
            </Badge>
            <Button variant="ghost" size="sm" onClick={toggleUpdates}>
              {isEnabled ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-6">
        <div className="rounded-lg border overflow-hidden overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead className="font-semibold text-xs sm:text-sm min-w-[180px]">Campaign</TableHead>
                <TableHead className="font-semibold text-xs sm:text-sm min-w-[80px]">Status</TableHead>
                <TableHead className="text-right font-semibold text-xs sm:text-sm min-w-[90px]">Spent</TableHead>
                <TableHead className="text-right font-semibold text-xs sm:text-sm min-w-[100px] hidden sm:table-cell">Impressions</TableHead>
                <TableHead className="text-right font-semibold text-xs sm:text-sm min-w-[80px] hidden md:table-cell">Clicks</TableHead>
                <TableHead className="text-right font-semibold text-xs sm:text-sm min-w-[100px] hidden md:table-cell">Conversions</TableHead>
                <TableHead className="text-right font-semibold text-xs sm:text-sm min-w-[60px] hidden lg:table-cell">CTR</TableHead>
                <TableHead className="text-right font-semibold text-xs sm:text-sm min-w-[70px]">ROAS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaigns.map((campaign, index) => (
                <TableRow
                  key={campaign.id}
                  className={`transition-all duration-500 ${
                    isRecentlyUpdated(campaign.name)
                      ? "bg-primary/5 border-l-4 border-l-primary animate-pulse"
                      : "hover:bg-muted/30"
                  }`}
                >
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm ${isRecentlyUpdated(campaign.name) ? "font-semibold" : ""}`}>{campaign.name}</span>
                      {isRecentlyUpdated(campaign.name) && (
                        <Badge variant="outline" className="text-xs animate-bounce">
                          Updated
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">{campaign.channel}</div>
                  </TableCell>
                  <TableCell>{getStatusBadge(campaign.status)}</TableCell>
                  <TableCell className="text-right font-mono">
                    <div className={`text-sm ${isRecentlyUpdated(campaign.name) ? "font-semibold text-primary" : ""}`}>
                      {formatters.currency(campaign.spent)}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">of {formatters.currency(campaign.budget)}</div>
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm hidden sm:table-cell">
                    <div className={isRecentlyUpdated(campaign.name) ? "font-semibold text-primary" : ""}>
                      {formatters.number(campaign.impressions)}
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm hidden md:table-cell">
                    <div className={isRecentlyUpdated(campaign.name) ? "font-semibold text-primary" : ""}>
                      {formatters.number(campaign.clicks)}
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm hidden md:table-cell">
                    <div className={isRecentlyUpdated(campaign.name) ? "font-semibold text-primary" : ""}>
                      {formatters.number(campaign.conversions)}
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm hidden lg:table-cell">{formatters.percentage(campaign.ctr)}</TableCell>
                  <TableCell className="text-right font-mono text-sm">
                    <div className={`flex items-center justify-end gap-1 ${getROASColor(campaign.roas)}`}>
                      <span className="font-semibold">{campaign.roas.toFixed(1)}x</span>
                      {getROASTrend(campaign.roas)}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Update info */}
        <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground">
          <span className="truncate">
            {recentUpdates.length > 0 ? `${recentUpdates.length} campaigns updated recently` : "No recent updates"}
          </span>
          <span className="whitespace-nowrap ml-2">Updates every 12s</span>
        </div>
      </CardContent>
    </Card>
  )
}