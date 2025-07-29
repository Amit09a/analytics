"use client"

import { Bell, Calendar, Download, Search, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ThemeToggle } from "@/components/theme-toggle"
import { MetricsCards } from "@/components/metrics-cards"
import { ChartsSection } from "@/components/charts-section"
import { DataTableSection } from "@/components/data-table-section"

export function DashboardContent() {
  return (
    <SidebarInset className="flex-1">
      <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 transition-all duration-300">
        <SidebarTrigger className="-ml-1 transition-all duration-200 hover:scale-110" />
        <div className="flex flex-1 items-center gap-2">
          <div className="relative flex-1 max-w-md group">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
            <Input
              placeholder="Search campaigns, metrics..."
              className="pl-8 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="transition-all duration-200 hover:scale-105 hover:shadow-md bg-transparent"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Last 30 days
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="animate-scale-in z-50">
              <DropdownMenuItem>Last 7 days</DropdownMenuItem>
              <DropdownMenuItem>Last 30 days</DropdownMenuItem>
              <DropdownMenuItem>Last 90 days</DropdownMenuItem>
              <DropdownMenuItem>Custom range</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="outline"
            size="sm"
            className="transition-all duration-200 hover:scale-105 hover:shadow-md bg-transparent"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="ghost" size="sm" className="relative transition-all duration-200 hover:scale-110">
            <Bell className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full animate-pulse"></span>
          </Button>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 space-y-8 p-4 md:p-6 animate-fade-in overflow-x-hidden">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Dashboard Overview
            </h1>
            <Sparkles className="h-5 w-5 md:h-6 md:w-6 text-primary animate-pulse-subtle" />
          </div>
          <p className="text-base md:text-lg text-muted-foreground">
            Welcome back! Here's what's happening with your campaigns today.
          </p>
        </div>

        <section className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <MetricsCards />
        </section>

        <section className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <ChartsSection />
        </section>

        <section className="animate-slide-up" style={{ animationDelay: "0.3s" }}>
          <DataTableSection />
        </section>
      </main>
    </SidebarInset>
  )
}
