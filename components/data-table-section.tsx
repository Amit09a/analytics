"use client"

import { useState } from "react"
import { ArrowUpDown, ChevronDown, Filter, MoreHorizontal, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

const campaignData = [
  {
    id: "1",
    name: "Summer Sale 2024",
    channel: "Social Media",
    status: "Active",
    budget: "$5,000",
    spent: "$3,200",
    impressions: "125,000",
    clicks: "2,400",
    conversions: "180",
    ctr: "1.92%",
    cpc: "$1.33",
    roas: "4.2x",
  },
  {
    id: "2",
    name: "Brand Awareness Q3",
    channel: "Display",
    status: "Active",
    budget: "$8,000",
    spent: "$6,800",
    impressions: "890,000",
    clicks: "4,200",
    conversions: "320",
    ctr: "0.47%",
    cpc: "$1.62",
    roas: "3.8x",
  },
  {
    id: "3",
    name: "Email Newsletter",
    channel: "Email",
    status: "Completed",
    budget: "$2,000",
    spent: "$1,950",
    impressions: "45,000",
    clicks: "1,800",
    conversions: "240",
    ctr: "4.00%",
    cpc: "$1.08",
    roas: "5.1x",
  },
  {
    id: "4",
    name: "Search Campaign",
    channel: "Search",
    status: "Active",
    budget: "$12,000",
    spent: "$9,200",
    impressions: "234,000",
    clicks: "8,900",
    conversions: "890",
    ctr: "3.80%",
    cpc: "$1.03",
    roas: "6.2x",
  },
  {
    id: "5",
    name: "Video Ads Campaign",
    channel: "Video",
    status: "Paused",
    budget: "$6,000",
    spent: "$2,100",
    impressions: "156,000",
    clicks: "1,200",
    conversions: "45",
    ctr: "0.77%",
    cpc: "$1.75",
    roas: "2.1x",
  },
]

type SortField = keyof (typeof campaignData)[0]
type SortDirection = "asc" | "desc"

export function DataTableSection() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState<SortField>("name")
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const filteredData = campaignData
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

  const getStatusBadge = (status: string) => {
    const variants = {
      Active: "default",
      Completed: "secondary",
      Paused: "outline",
    } as const

    return (
      <Badge
        variant={variants[status as keyof typeof variants]}
        className="transition-all duration-200 hover:scale-105"
      >
        {status}
      </Badge>
    )
  }

  return (
    <Card className="transition-all duration-300 hover:shadow-2xl border-0 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
      <CardHeader className="space-y-2">
        <CardTitle className="text-2xl font-semibold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          Campaign Performance
        </CardTitle>
        <CardDescription className="text-base">Detailed view of all your marketing campaigns</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between space-x-4 py-4">
          <div className="flex items-center space-x-3">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                placeholder="Search campaigns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 max-w-sm transition-all duration-200 focus:ring-2 focus:ring-primary/20 hover:shadow-md"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="transition-all duration-200 hover:scale-105 hover:shadow-md bg-transparent"
                >
                  <Filter className="mr-2 h-4 w-4" />
                  Status
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="animate-scale-in z-50">
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
            Showing {filteredData.length} of {campaignData.length} campaigns
          </div>
        </div>

        <div className="rounded-xl border border-border/50 overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/30">
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
                    className="hover:bg-muted/30 transition-all duration-200 group animate-fade-in"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <TableCell className="font-medium group-hover:text-primary transition-colors">
                      {campaign.name}
                    </TableCell>
                    <TableCell>{campaign.channel}</TableCell>
                    <TableCell>{getStatusBadge(campaign.status)}</TableCell>
                    <TableCell className="text-right font-mono">{campaign.budget}</TableCell>
                    <TableCell className="text-right font-mono">{campaign.spent}</TableCell>
                    <TableCell className="text-right font-mono">{campaign.impressions}</TableCell>
                    <TableCell className="text-right font-mono">{campaign.clicks}</TableCell>
                    <TableCell className="text-right font-mono">{campaign.conversions}</TableCell>
                    <TableCell className="text-right font-mono">{campaign.ctr}</TableCell>
                    <TableCell className="text-right font-mono">{campaign.cpc}</TableCell>
                    <TableCell className="text-right font-mono font-semibold text-green-600">{campaign.roas}</TableCell>
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
                        <DropdownMenuContent align="end" className="animate-scale-in z-50">
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
