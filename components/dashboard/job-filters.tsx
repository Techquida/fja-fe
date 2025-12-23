"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, SlidersHorizontal, X } from "lucide-react"
import { useState } from "react"

interface JobFiltersProps {
  onFilter?: (filters: {
    search: string
    location: string
    type: string
    source: string
  }) => void
}

export function JobFilters({ onFilter }: JobFiltersProps) {
  const [search, setSearch] = useState("")
  const [location, setLocation] = useState("")
  const [type, setType] = useState("")
  const [source, setSource] = useState("")
  const [showFilters, setShowFilters] = useState(false)

  const handleFilter = () => {
    onFilter?.({ search, location, type, source })
  }

  const clearFilters = () => {
    setSearch("")
    setLocation("")
    setType("")
    setSource("")
    onFilter?.({ search: "", location: "", type: "", source: "" })
  }

  const hasActiveFilters = search || location || type || source

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search jobs, companies, keywords..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-11 bg-secondary/50"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="bg-transparent gap-2" onClick={() => setShowFilters(!showFilters)}>
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {hasActiveFilters && <span className="w-2 h-2 rounded-full bg-primary" />}
          </Button>
          <Button onClick={handleFilter} className="bg-primary hover:bg-primary/90">
            Search
          </Button>
        </div>
      </div>

      {showFilters && (
        <div className="p-4 rounded-lg bg-card border border-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-foreground">Filters</h3>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
              >
                <X className="w-4 h-4" />
                Clear all
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Location</Label>
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger className="bg-secondary/50">
                  <SelectValue placeholder="Any location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="remote">Remote</SelectItem>
                  <SelectItem value="us">United States</SelectItem>
                  <SelectItem value="uk">United Kingdom</SelectItem>
                  <SelectItem value="eu">Europe</SelectItem>
                  <SelectItem value="asia">Asia</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Job Type</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger className="bg-secondary/50">
                  <SelectValue placeholder="Any type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full-time">Full Time</SelectItem>
                  <SelectItem value="part-time">Part Time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="internship">Internship</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Source</Label>
              <Select value={source} onValueChange={setSource}>
                <SelectTrigger className="bg-secondary/50">
                  <SelectValue placeholder="Any source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                  <SelectItem value="indeed">Indeed</SelectItem>
                  <SelectItem value="glassdoor">Glassdoor</SelectItem>
                  <SelectItem value="company">Company Website</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
