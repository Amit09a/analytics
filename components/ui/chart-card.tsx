"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Download, RefreshCw } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface ChartCardProps {
  title: string
  description?: string
  children: React.ReactNode
  className?: string
  onRefresh?: () => void
  onExport?: () => void
}

export function ChartCard({ title, description, children, className = "", onRefresh, onExport }: ChartCardProps) {
  return (
    <Card
      className={`relative transition-all duration-300 hover:shadow-2xl border bg-card backdrop-blur-md shadow-lg ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-background/20 to-transparent rounded-lg" />
      <CardHeader className="pb-4 relative z-10">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-xl font-semibold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              {title}
            </CardTitle>
            {description && <CardDescription className="text-sm">{description}</CardDescription>}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="opacity-70 hover:opacity-100 transition-opacity">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="z-50 bg-background/95 backdrop-blur-md">
              {onRefresh && (
                <DropdownMenuItem onClick={onRefresh}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh Data
                </DropdownMenuItem>
              )}
              {onExport && (
                <DropdownMenuItem onClick={onExport}>
                  <Download className="mr-2 h-4 w-4" />
                  Export Chart
                </DropdownMenuItem>
              )}
              <DropdownMenuItem>View Details</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="p-6 relative z-10 bg-background/30 rounded-lg">{children}</CardContent>
    </Card>
  )
}
