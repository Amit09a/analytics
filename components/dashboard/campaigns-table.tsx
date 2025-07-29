"use client"

import { useState } from "react"
import { ArrowUpDown, ChevronDown, Filter, MoreHorizontal, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import type { Campaign } from "@/lib/types"

interface CampaignsTableProps {
  campaigns: Campaign[]
  loading: boolean
}

type SortField = keyof Campaign
type SortDirection = "asc" | "desc"

export function CampaignsTable({ campaigns, loading }: CampaignsTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState<SortField>("name")
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const filteredData = campaigns
    .filter((campaign) => {
      const matchesSearch =
        campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        campaign.channel.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === "all" || campaign.status.toLowerCase() === statusFilter.toLowerCase()
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      const aValue = a[sortField]
      const bValue = b[sortField]

      if (sortDirection === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const getStatusBadge = (status: Campaign["status"]) => {
    const variants = {
      Active: "default",
      Completed: "secondary",
      Paused: "outline",
      Draft: "outline",
    } as const

    return (
      <Badge variant={variants[status]} className="transition-all duration-200 hover:scale-105">
        {status}
      </Badge>
    )
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US").format(num)
  }

  if (loading) {
    return (
      <Card className="transition-all duration-300 hover:shadow-2xl border-0 bg-card/80 backdrop-blur-md supports-[backdrop-filter]:bg-card/60">
        <div className="absolute inset-0 bg-gradient-to-br from-background/10 to-transparent rounded-lg" />
        <CardHeader className="relative z-10">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-10 w-64" />
              <Skeleton className="h-10 w-32" />
            </div>
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="transition-all duration-300 hover:shadow-2xl border-0 bg-card/80 backdrop-blur-md supports-[backdrop-filter]:bg-card/60">
      <div className="absolute inset-0 bg-gradient-to-br from-background/10 to-transparent rounded-lg" />
      <CardHeader className="space-y-2 relative z-10">
        <CardTitle className="text-2xl font-semibold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          Campaign Performance
        </CardTitle>
        <CardDescription className="text-base">Detailed view of all your marketing campaigns</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 relative z-10">
        <div className="flex items-center justify-between space-x-4 py-4">
          <div className="flex items-center space-x-3">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                placeholder="Search campaigns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 max-w-sm transition-all duration-200 focus:ring-2 focus:ring-primary/20 hover:shadow-md bg-background/50 backdrop-blur-sm"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="transition-all duration-200 hover:scale-105 hover:shadow-md bg-background/50 backdrop-blur-sm"
                >
                  <Filter className="mr-2 h-4 w-4" />
                  Status
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="animate-scale-in z-50 bg-background/95 backdrop-blur-md">
                <DropdownMenuItem onClick={() => setStatusFilter("all")} className="hover:bg-primary/10">
                  All Status
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("active")} className="hover:bg-primary/10">
                  Active
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("completed")} className="hover:bg-primary/10">
                  Completed
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("paused")} className="hover:bg-primary/10">
                  Paused
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="text-sm text-muted-foreground font-medium">
            Showing {filteredData.length} of {campaigns.length} campaigns
          </div>
        </div>

        <div className="rounded-xl border border-border/50 overflow-hidden shadow-lg bg-background/30 backdrop-blur-sm">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/30 backdrop-blur-sm">
                <TableRow className="hover:bg-muted/50 transition-colors">
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort("name")}
                      className="h-auto p-0 font-semibold hover:text-primary transition-colors"
                    >
                      Campaign
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead className="font-semibold">Channel</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="text-right font-semibold">Budget</TableHead>
                  <TableHead className="text-right font-semibold">Spent</TableHead>
                  <TableHead className="text-right font-semibold">Impressions</TableHead>
                  <TableHead className="text-right font-semibold">Clicks</TableHead>
                  <TableHead className="text-right font-semibold">Conversions</TableHead>
                  <TableHead className="text-right font-semibold">CTR</TableHead>
                  <TableHead className="text-right font-semibold">CPC</TableHead>
                  <TableHead className="text-right font-semibold">ROAS</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((campaign, index) => (
                  <TableRow
                    key={campaign.id}
                    className="hover:bg-muted/30 transition-all duration-200 group animate-fade-in backdrop-blur-sm"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <TableCell className="font-medium group-hover:text-primary transition-colors">
                      <div>
                        <div className="font-semibold">{campaign.name}</div>
                        <div className="text-xs text-muted-foreground">{campaign.objective}</div>
                      </div>
                    </TableCell>
                    <TableCell>{campaign.channel}</TableCell>
                    <TableCell>{getStatusBadge(campaign.status)}</TableCell>
                    <TableCell className="text-right font-mono">{formatCurrency(campaign.budget)}</TableCell>
                    <TableCell className="text-right font-mono">{formatCurrency(campaign.spent)}</TableCell>
                    <TableCell className="text-right font-mono">{formatNumber(campaign.impressions)}</TableCell>
                    <TableCell className="text-right font-mono">{formatNumber(campaign.clicks)}</TableCell>
                    <TableCell className="text-right font-mono">{formatNumber(campaign.conversions)}</TableCell>
                    <TableCell className="text-right font-mono">{campaign.ctr.toFixed(2)}%</TableCell>
                    <TableCell className="text-right font-mono">${campaign.cpc.toFixed(2)}</TableCell>
                    <TableCell className="text-right font-mono font-semibold text-green-600">
                      {campaign.roas.toFixed(1)}x
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="animate-scale-in z-50 bg-background/95 backdrop-blur-md"
                        >
                          <DropdownMenuItem className="hover:bg-primary/10">View details</DropdownMenuItem>
                          <DropdownMenuItem className="hover:bg-primary/10">Edit campaign</DropdownMenuItem>
                          <DropdownMenuItem className="hover:bg-primary/10">Duplicate</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600 hover:bg-red-50">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
