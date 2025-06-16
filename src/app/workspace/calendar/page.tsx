
"use client"

import { useState, useMemo } from "react"
import {
  CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  Filter,
  Download,
  Bell,
  BookOpen,
  FileText,
  Clock,
  MapPin,
  LinkIcon,
  Edit,
  Trash2,
  MoreHorizontal,
} from "lucide-react"

import { Button } from "~/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Textarea } from "~/components/ui/textarea"
import { Badge } from "~/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "~/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { Checkbox } from "~/components/ui/checkbox"

// Types
interface CalendarEvent {
  id: string
  title: string
  description?: string
  date: string
  startTime?: string
  endTime?: string
  type: "exam" | "assignment" | "reminder" | "study" | "meeting" | "other"
  priority: "low" | "medium" | "high"
  location?: string
  fileLinks?: string[]
  recurring?: "none" | "daily" | "weekly" | "monthly"
  reminderMinutes?: number
  completed?: boolean
}

type ViewMode = "month" | "week" | "day"

// Sample events data
const sampleEvents: CalendarEvent[] = [
  {
    id: "1",
    title: "Calculus Final Exam",
    description: "Final examination covering chapters 1-12",
    date: "2024-01-15",
    startTime: "09:00",
    endTime: "11:00",
    type: "exam",
    priority: "high",
    location: "Room 101",
    reminderMinutes: 60,
  },
  {
    id: "2",
    title: "Physics Lab Report Due",
    description: "Submit quantum mechanics lab report",
    date: "2024-01-18",
    startTime: "23:59",
    type: "assignment",
    priority: "high",
    fileLinks: ["physics-lab-template.pdf"],
  },
  {
    id: "3",
    title: "Study Group - Chemistry",
    description: "Organic chemistry study session",
    date: "2024-01-20",
    startTime: "14:00",
    endTime: "16:00",
    type: "study",
    priority: "medium",
    location: "Library Room 205",
    recurring: "weekly",
  },
  {
    id: "4",
    title: "Office Hours - Prof. Smith",
    description: "Discuss midterm questions",
    date: "2024-01-22",
    startTime: "10:00",
    endTime: "11:00",
    type: "meeting",
    priority: "medium",
    location: "Office 304",
  },
]

const eventTypeColors = {
  exam: "bg-red-100 text-red-800 border-red-200",
  assignment: "bg-blue-100 text-blue-800 border-blue-200",
  reminder: "bg-yellow-100 text-yellow-800 border-yellow-200",
  study: "bg-green-100 text-green-800 border-green-200",
  meeting: "bg-purple-100 text-purple-800 border-purple-200",
  other: "bg-gray-100 text-gray-800 border-gray-200",
}

const priorityColors = {
  low: "border-l-gray-400",
  medium: "border-l-yellow-400",
  high: "border-l-red-400",
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<ViewMode>("month")
  const [events, setEvents] = useState<CalendarEvent[]>(sampleEvents)
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<string>("all")
  const [newEvent, setNewEvent] = useState<Partial<CalendarEvent>>({
    type: "other",
    priority: "medium",
    recurring: "none",
  })

  // Calendar navigation
  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const navigateWeek = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      const days = direction === "prev" ? -7 : 7
      newDate.setDate(prev.getDate() + days)
      return newDate
    })
  }

  const navigateDay = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      const days = direction === "prev" ? -1 : 1
      newDate.setDate(prev.getDate() + days)
      return newDate
    })
  }

  const navigate = (direction: "prev" | "next") => {
    switch (viewMode) {
      case "month":
        navigateMonth(direction)
        break
      case "week":
        navigateWeek(direction)
        break
      case "day":
        navigateDay(direction)
        break
    }
  }

  // Get events for a specific date
  const getEventsForDate = (date: string) => {
    return events.filter((event) => event.date === date)
  }

  // Filter events based on search and type
  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesSearch =
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesType = filterType === "all" || event.type === filterType
      return matchesSearch && matchesType
    })
  }, [events, searchTerm, filterType])

  // Generate calendar days for month view
  const generateMonthDays = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())

    const days = []
    const current = new Date(startDate)

    for (let i = 0; i < 42; i++) {
      days.push(new Date(current))
      current.setDate(current.getDate() + 1)
    }

    return days
  }

  // Generate week days
  const generateWeekDays = () => {
    const startOfWeek = new Date(currentDate)
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay())

    const days = []
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek)
      day.setDate(startOfWeek.getDate() + i)
      days.push(day)
    }
    return days
  }

  // Generate time slots for day/week view
  const generateTimeSlots = () => {
    const slots = []
    for (let hour = 0; hour < 24; hour++) {
      slots.push(`${hour.toString().padStart(2, "0")}:00`)
      slots.push(`${hour.toString().padStart(2, "0")}:30`)
    }
    return slots
  }

  // Add new event
  const handleAddEvent = () => {
    if (newEvent.title && newEvent.date) {
      const event: CalendarEvent = {
        id: Date.now().toString(),
        title: newEvent.title,
        description: newEvent.description,
        date: newEvent.date,
        startTime: newEvent.startTime,
        endTime: newEvent.endTime,
        type: newEvent.type as CalendarEvent["type"],
        priority: newEvent.priority as CalendarEvent["priority"],
        location: newEvent.location,
        fileLinks: newEvent.fileLinks,
        recurring: newEvent.recurring as CalendarEvent["recurring"],
        reminderMinutes: newEvent.reminderMinutes,
        completed: false,
      }
      setEvents([...events, event])
      setNewEvent({
        type: "other",
        priority: "medium",
        recurring: "none",
      })
      setIsEventDialogOpen(false)
    }
  }

  // Delete event
  const handleDeleteEvent = (eventId: string) => {
    setEvents(events.filter((event) => event.id !== eventId))
  }

  // Toggle event completion
  const toggleEventCompletion = (eventId: string) => {
    setEvents(events.map((event) => (event.id === eventId ? { ...event, completed: !event.completed } : event)))
  }

  const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0]
  }

  const formatDisplayDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const renderMonthView = () => {
    const days = generateMonthDays()
    const monthYear = currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">{monthYear}</h2>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => navigate("prev")}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
              Today
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigate("next")}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="p-2 text-center font-medium text-gray-500 bg-gray-50">
              {day}
            </div>
          ))}
          {days.map((day, index) => {
            const dateStr = formatDate(day)
            const dayEvents = getEventsForDate(dateStr)
            const isCurrentMonth = day.getMonth() === currentDate.getMonth()
            const isToday = formatDate(day) === formatDate(new Date())

            return (
              <div
                key={index}
                className={`min-h-[120px] p-2 border border-gray-200 ${isCurrentMonth ? "bg-white" : "bg-gray-50"
                  } ${isToday ? "ring-2 ring-blue-500" : ""}`}
              >
                <div className={`text-sm font-medium mb-1 ${isCurrentMonth ? "text-gray-900" : "text-gray-400"}`}>
                  {day.getDate()}
                </div>
                <div className="space-y-1">
                  {dayEvents.slice(0, 3).map((event) => (
                    <div
                      key={event.id}
                      className={`text-xs p-1 rounded border-l-2 cursor-pointer ${eventTypeColors[event.type]} ${priorityColors[event.priority]
                        } ${event.completed ? "opacity-50 line-through" : ""}`}
                      onClick={() => setSelectedEvent(event)}
                    >
                      <div className="font-medium truncate">{event.title}</div>
                      {event.startTime && <div className="text-xs opacity-75">{event.startTime}</div>}
                    </div>
                  ))}
                  {dayEvents.length > 3 && <div className="text-xs text-gray-500">+{dayEvents.length - 3} more</div>}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const renderWeekView = () => {
    const days = generateWeekDays()
    const timeSlots = generateTimeSlots()

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            {days[0]!.toLocaleDateString("en-US", { month: "long", day: "numeric" })} -{" "}
            {days[6]!.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </h2>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => navigate("prev")}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
              Today
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigate("next")}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-8 gap-1">
          <div className="p-2"></div>
          {days.map((day) => (
            <div key={day.toISOString()} className="p-2 text-center">
              <div className="font-medium">{day.toLocaleDateString("en-US", { weekday: "short" })}</div>
              <div
                className={`text-2xl ${formatDate(day) === formatDate(new Date()) ? "text-blue-600 font-bold" : ""}`}
              >
                {day.getDate()}
              </div>
            </div>
          ))}

          {timeSlots
            .filter((_, index) => index % 2 === 0)
            .map((time) => (
              <>
                <div key={time} className="p-2 text-sm text-gray-500 border-t">
                  {time}
                </div>
                {days.map((day) => {
                  const dateStr = formatDate(day)
                  const dayEvents = getEventsForDate(dateStr).filter((event) =>
                    event.startTime?.startsWith(time.split(":")[0]),
                  )

                  return (
                    <div key={`${day.toISOString()}-${time}`} className="p-1 border-t min-h-[60px]">
                      {dayEvents.map((event) => (
                        <div
                          key={event.id}
                          className={`text-xs p-1 rounded mb-1 cursor-pointer border-l-2 ${eventTypeColors[event.type]} ${priorityColors[event.priority]
                            } ${event.completed ? "opacity-50 line-through" : ""}`}
                          onClick={() => setSelectedEvent(event)}
                        >
                          <div className="font-medium">{event.title}</div>
                          <div className="opacity-75">
                            {event.startTime} - {event.endTime}
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                })}
              </>
            ))}
        </div>
      </div>
    )
  }

  const renderDayView = () => {
    const timeSlots = generateTimeSlots()
    const dateStr = formatDate(currentDate)
    const dayEvents = getEventsForDate(dateStr)

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">{formatDisplayDate(currentDate)}</h2>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => navigate("prev")}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
              Today
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigate("next")}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            {timeSlots
              .filter((_, index) => index % 2 === 0)
              .map((time) => {
                const hourEvents = dayEvents.filter((event) => event.startTime?.startsWith(time.split(":")[0]))

                return (
                  <div key={time} className="flex border-t">
                    <div className="w-20 p-2 text-sm text-gray-500">{time}</div>
                    <div className="flex-1 p-2 min-h-[60px]">
                      {hourEvents.map((event) => (
                        <div
                          key={event.id}
                          className={`p-2 rounded mb-1 cursor-pointer border-l-4 ${eventTypeColors[event.type]} ${priorityColors[event.priority]
                            } ${event.completed ? "opacity-50 line-through" : ""}`}
                          onClick={() => setSelectedEvent(event)}
                        >
                          <div className="font-medium">{event.title}</div>
                          <div className="text-sm opacity-75">
                            {event.startTime} - {event.endTime}
                          </div>
                          {event.location && (
                            <div className="text-sm opacity-75 flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {event.location}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Today's Events</CardTitle>
              </CardHeader>
              <CardContent>
                {dayEvents.length === 0 ? (
                  <p className="text-gray-500">No events scheduled for today</p>
                ) : (
                  <div className="space-y-2">
                    {dayEvents.map((event) => (
                      <div
                        key={event.id}
                        className={`p-3 rounded border-l-4 ${eventTypeColors[event.type]} ${priorityColors[event.priority]
                          } ${event.completed ? "opacity-50" : ""}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Checkbox
                              checked={event.completed}
                              onCheckedChange={() => toggleEventCompletion(event.id)}
                            />
                            <div>
                              <div className={`font-medium ${event.completed ? "line-through" : ""}`}>
                                {event.title}
                              </div>
                              <div className="text-sm opacity-75">
                                {event.startTime} - {event.endTime}
                              </div>
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem onClick={() => setSelectedEvent(event)}>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDeleteEvent(event.id)}>
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        {event.description && <p className="text-sm mt-1 opacity-75">{event.description}</p>}
                        {event.location && (
                          <div className="text-sm mt-1 opacity-75 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {event.location}
                          </div>
                        )}
                        {event.fileLinks && event.fileLinks.length > 0 && (
                          <div className="mt-2">
                            {event.fileLinks.map((link, index) => (
                              <Badge key={index} variant="outline" className="mr-1">
                                <LinkIcon className="w-3 h-3 mr-1" />
                                {link}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <CalendarIcon className="w-8 h-8" />
              Study Calendar
            </h1>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "month" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("month")}
              >
                Month
              </Button>
              <Button
                variant={viewMode === "week" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("week")}
              >
                Week
              </Button>
              <Button variant={viewMode === "day" ? "default" : "outline"} size="sm" onClick={() => setViewMode("day")}>
                Day
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-32">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="exam">Exams</SelectItem>
                <SelectItem value="assignment">Assignments</SelectItem>
                <SelectItem value="study">Study</SelectItem>
                <SelectItem value="meeting">Meetings</SelectItem>
                <SelectItem value="reminder">Reminders</SelectItem>
              </SelectContent>
            </Select>
            <Button>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Dialog open={isEventDialogOpen} onOpenChange={setIsEventDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Event
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Event</DialogTitle>
                  <DialogDescription>Create a new calendar event with all the details.</DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title">Title *</Label>
                      <Input
                        id="title"
                        value={newEvent.title || ""}
                        onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                        placeholder="Event title"
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={newEvent.description || ""}
                        onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                        placeholder="Event description"
                      />
                    </div>
                    <div>
                      <Label htmlFor="date">Date *</Label>
                      <Input
                        id="date"
                        type="date"
                        value={newEvent.date || ""}
                        onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label htmlFor="startTime">Start Time</Label>
                        <Input
                          id="startTime"
                          type="time"
                          value={newEvent.startTime || ""}
                          onChange={(e) => setNewEvent({ ...newEvent, startTime: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="endTime">End Time</Label>
                        <Input
                          id="endTime"
                          type="time"
                          value={newEvent.endTime || ""}
                          onChange={(e) => setNewEvent({ ...newEvent, endTime: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="type">Event Type</Label>
                      <Select
                        value={newEvent.type}
                        onValueChange={(value) => setNewEvent({ ...newEvent, type: value as CalendarEvent["type"] })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="exam">Exam</SelectItem>
                          <SelectItem value="assignment">Assignment</SelectItem>
                          <SelectItem value="study">Study Session</SelectItem>
                          <SelectItem value="meeting">Meeting</SelectItem>
                          <SelectItem value="reminder">Reminder</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="priority">Priority</Label>
                      <Select
                        value={newEvent.priority}
                        onValueChange={(value) =>
                          setNewEvent({ ...newEvent, priority: value as CalendarEvent["priority"] })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={newEvent.location || ""}
                        onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                        placeholder="Event location"
                      />
                    </div>
                    <div>
                      <Label htmlFor="recurring">Recurring</Label>
                      <Select
                        value={newEvent.recurring}
                        onValueChange={(value) =>
                          setNewEvent({ ...newEvent, recurring: value as CalendarEvent["recurring"] })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="reminder">Reminder (minutes before)</Label>
                      <Input
                        id="reminder"
                        type="number"
                        value={newEvent.reminderMinutes || ""}
                        onChange={(e) => setNewEvent({ ...newEvent, reminderMinutes: Number.parseInt(e.target.value) })}
                        placeholder="15"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" onClick={() => setIsEventDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddEvent}>Add Event</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Calendar Views */}
        <Card>
          <CardContent className="p-6">
            {viewMode === "month" && renderMonthView()}
            {viewMode === "week" && renderWeekView()}
            {viewMode === "day" && renderDayView()}
          </CardContent>
        </Card>

        {/* Event Details Dialog */}
        {selectedEvent && (
          <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {selectedEvent.type === "exam" && <BookOpen className="w-5 h-5" />}
                  {selectedEvent.type === "assignment" && <FileText className="w-5 h-5" />}
                  {selectedEvent.type === "reminder" && <Bell className="w-5 h-5" />}
                  {selectedEvent.type === "study" && <BookOpen className="w-5 h-5" />}
                  {selectedEvent.type === "meeting" && <Clock className="w-5 h-5" />}
                  {selectedEvent.title}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge className={eventTypeColors[selectedEvent.type]}>
                    {selectedEvent.type.charAt(0).toUpperCase() + selectedEvent.type.slice(1)}
                  </Badge>
                  <Badge variant={selectedEvent.priority === "high" ? "destructive" : "secondary"}>
                    {selectedEvent.priority} priority
                  </Badge>
                </div>
                {selectedEvent.description && (
                  <div>
                    <h4 className="font-medium mb-1">Description</h4>
                    <p className="text-gray-600">{selectedEvent.description}</p>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-1">Date & Time</h4>
                    <p className="text-gray-600">
                      {new Date(selectedEvent.date).toLocaleDateString()}
                      {selectedEvent.startTime && ` at ${selectedEvent.startTime}`}
                      {selectedEvent.endTime && ` - ${selectedEvent.endTime}`}
                    </p>
                  </div>
                  {selectedEvent.location && (
                    <div>
                      <h4 className="font-medium mb-1">Location</h4>
                      <p className="text-gray-600 flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {selectedEvent.location}
                      </p>
                    </div>
                  )}
                </div>
                {selectedEvent.fileLinks && selectedEvent.fileLinks.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Attached Files</h4>
                    <div className="space-y-1">
                      {selectedEvent.fileLinks.map((link, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                          <FileText className="w-4 h-4" />
                          <span className="text-sm">{link}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {selectedEvent.reminderMinutes && (
                  <div>
                    <h4 className="font-medium mb-1">Reminder</h4>
                    <p className="text-gray-600 flex items-center gap-1">
                      <Bell className="w-4 h-4" />
                      {selectedEvent.reminderMinutes} minutes before
                    </p>
                  </div>
                )}
                <div className="flex justify-between items-center pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={selectedEvent.completed}
                      onCheckedChange={() => toggleEventCompletion(selectedEvent.id)}
                    />
                    <span className="text-sm">Mark as completed</span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDeleteEvent(selectedEvent.id)}>
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Upcoming Events Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">{/* Main calendar content is above */}</div>
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Upcoming Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {filteredEvents
                    .filter((event) => new Date(event.date) >= new Date())
                    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                    .slice(0, 5)
                    .map((event) => (
                      <div
                        key={event.id}
                        className={`p-3 rounded border-l-4 cursor-pointer ${eventTypeColors[event.type]} ${priorityColors[event.priority]
                          } ${event.completed ? "opacity-50" : ""}`}
                        onClick={() => setSelectedEvent(event)}
                      >
                        <div className={`font-medium text-sm ${event.completed ? "line-through" : ""}`}>
                          {event.title}
                        </div>
                        <div className="text-xs opacity-75">
                          {new Date(event.date).toLocaleDateString()}
                          {event.startTime && ` at ${event.startTime}`}
                        </div>
                        {event.location && (
                          <div className="text-xs opacity-75 flex items-center gap-1 mt-1">
                            <MapPin className="w-3 h-3" />
                            {event.location}
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Total Events</span>
                    <span className="font-medium">{events.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Completed</span>
                    <span className="font-medium">{events.filter((e) => e.completed).length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">High Priority</span>
                    <span className="font-medium">{events.filter((e) => e.priority === "high").length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">This Week</span>
                    <span className="font-medium">
                      {
                        events.filter((e) => {
                          const eventDate = new Date(e.date)
                          const now = new Date()
                          const weekStart = new Date(now.setDate(now.getDate() - now.getDay()))
                          const weekEnd = new Date(weekStart)
                          weekEnd.setDate(weekStart.getDate() + 6)
                          return eventDate >= weekStart && eventDate <= weekEnd
                        }).length
                      }
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
