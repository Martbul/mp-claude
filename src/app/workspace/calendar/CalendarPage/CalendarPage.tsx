"use client"

import { useState, useMemo } from "react"
import {
  CalendarIcon,
  Plus,
  Search,
  Filter,
  Bell,
  BookOpen,
  FileText,
  Clock,
  MapPin,
  Edit,
  Trash2,
  ShareIcon,
  RulerIcon,
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { Checkbox } from "~/components/ui/checkbox"
import type { DB_CalendarrType } from "~/server/db/schema"
import { createCalendarEventAction, deleteCalendarEventAction, toggleCalendarEventCompletionAction } from "~/server/actions"
import MonthView from "../calendarViews/MonthView"
import WeekView from "../calendarViews/WeekView"
import DayView from "../calendarViews/DayView"
import { priorityColors } from "~/app/_constants/constants"
import type { CalendarViewMode } from "~/app/_types/types"
import { getEventTypeColor } from "../utils/utils"

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



export default function CalendarPage(props: { userId: string, calendarEvents: DB_CalendarrType[] }) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<CalendarViewMode>("month")
  const [events, setEvents] = useState<DB_CalendarrType[]>(Array.isArray(props.calendarEvents) ? props.calendarEvents : [])
  const [selectedEvent, setSelectedEvent] = useState<DB_CalendarrType | null>(null)
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<string>("all")
  const [newEvent, setNewEvent] = useState<Partial<DB_CalendarrType>>({
    type: "other",
    priority: "medium",
    recurring: "none",
  })

  const monthDays = (() => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())

    return Array.from({ length: 42 }, (_, i) => {
      const day = new Date(startDate)
      day.setDate(startDate.getDate() + i)
      return day
    })
  })()

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const startOfWeek = new Date(currentDate)
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay() + i)
    return startOfWeek
  })

  const timeSlots = Array.from({ length: 24 * 2 }, (_, i) => {
    const hour = Math.floor(i / 2)
    const minutes = i % 2 === 0 ? "00" : "30"
    return `${hour.toString().padStart(2, "0")}:${minutes}`
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

  const handleAddEvent = async () => {
    const prevEvents = events;

    if (newEvent.title && newEvent.date) {
      const tempId = Date.now();
      const eventForDB = {
        id: tempId, // Temporary ID
        createdAt: new Date(),

        ownerId: props.userId,
        title: newEvent.title,
        description: newEvent.description ?? null,
        date: newEvent.date,

        startTime: newEvent.startTime ?? null,
        endTime: newEvent.endTime ?? null,

        type: newEvent.type ?? "other",
        priority: newEvent.priority ?? "medium",

        location: newEvent.location ?? null,

        fileLinks: Array.isArray(newEvent.fileLinks) ? newEvent.fileLinks : [],

        recurring: newEvent.recurring ?? "none",
        reminderMinutes: newEvent.reminderMinutes ?? null,
        completed: false,
      };

      // Optimistic update
      setEvents((prev) => [...prev, eventForDB]);
      setIsEventDialogOpen(false);

      setNewEvent({
        type: "other",
        priority: "medium",
        recurring: "none",
      });

      try {
        const result = await createCalendarEventAction(props.userId, eventForDB);

        if (!result.success) {
          // Revert on failure
          setEvents(prevEvents);
          setIsEventDialogOpen(true);
          console.error("Failed to create new calendar event", result.error);
          return;
        }

        if (result.data) {
          // Replace the optimistic event with the actual one from the backend
          setEvents((prev) =>
            prev.map((event) => (event.id === tempId ? result.data : event))
          );
        }

      } catch (error) {
        // Revert on exception
        setEvents(prevEvents);
        setIsEventDialogOpen(true);
        console.error("Error to create new calendar event", error);
      }
    }
  };



  const handleDeleteEvent = async (eventId: number) => {
    const prevEvents = events;
    const updatedEvents = events.filter((event) => event.id !== eventId);

    // Optimistically update UI
    setEvents(updatedEvents);
    setSelectedEvent(null);

    try {
      const result = await deleteCalendarEventAction(props.userId, eventId);

      if (!result.success) {
        // Revert on failure
        setEvents(prevEvents);
        console.error("Failed to delete calendar event", result.error);
      }
    } catch (error) {
      // Revert on exception
      setEvents(prevEvents);
      console.error("Error deleting calendar event", error);
    }
  };


  const toggleEventCompletion = async (eventId: number) => {
    const prevEvents = events;
    const eventToToggle = events.find((event) => event.id === eventId);

    if (!eventToToggle) return;

    const newCompleted = !eventToToggle.completed;

    // Optimistically update
    setEvents(events.map((event) =>
      event.id === eventId ? { ...event, completed: newCompleted } : event
    ));

    setSelectedEvent(null);
    try {
      const result = await toggleCalendarEventCompletionAction(props.userId, eventId, newCompleted);

      if (!result.success) {
        setEvents(prevEvents);
        console.error("Failed to toggle completion", result.error);
      } else if (result.data) {
        setEvents(events =>
          events.map((event) =>
            event.id === eventId ? result.data : event
          )
        );
      }
    } catch (error) {
      setEvents(prevEvents);
      console.error("Error toggling event completion", error);
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
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
              <ShareIcon className="w-4 h-4 mr-2" />
              Share
            </Button>

            <Button>
              <RulerIcon className="w-4 h-4 mr-2" />
              Customize
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
                        value={newEvent.title ?? ""}
                        onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                        placeholder="Event title"
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={newEvent.description ?? ""}
                        onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                        placeholder="Event description"
                      />
                    </div>
                    <div>
                      <Label htmlFor="date">Date *</Label>
                      <Input
                        id="date"
                        type="date"
                        value={newEvent.date ?? ""}
                        onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label htmlFor="startTime">Start Time</Label>
                        <Input
                          id="startTime"
                          type="time"
                          value={newEvent.startTime ?? ""}
                          onChange={(e) => setNewEvent({ ...newEvent, startTime: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="endTime">End Time</Label>
                        <Input
                          id="endTime"
                          type="time"
                          value={newEvent.endTime ?? ""}
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
                        value={newEvent.location ?? ""}
                        onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                        placeholder="Event location"
                      />
                    </div>
                    <div>
                      <Label htmlFor="recurring">Recurring</Label>
                      <Select
                        value={newEvent.recurring!}
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
                        value={newEvent.reminderMinutes ?? ""}
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

        <Card>
          <CardContent className="p-6">
            {viewMode === "month" && <MonthView currentDate={currentDate} days={monthDays} navigate={navigate} setCurrentDate={setCurrentDate} setSelectedEvent={setSelectedEvent} getEventsForDate={getEventsForDate} />}
            {viewMode === "week" && <WeekView days={weekDays} timeSlots={timeSlots} navigate={navigate} setCurrentDate={setCurrentDate} setSelectedEvent={setSelectedEvent} getEventsForDate={getEventsForDate} />}
            {viewMode === "day" && <DayView currentDate={currentDate} timeSlots={timeSlots} navigate={navigate} setCurrentDate={setCurrentDate} setSelectedEvent={setSelectedEvent} getEventsForDate={getEventsForDate} toggleEventCompletion={toggleEventCompletion} handleDeleteEvent={handleDeleteEvent} />}
          </CardContent>
        </Card>



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
                  <Badge className={getEventTypeColor(selectedEvent.type)}>
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


                {Array.isArray(selectedEvent.fileLinks) && selectedEvent.fileLinks.length > 0 && (
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
                      checked={selectedEvent.completed!}
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

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3"></div>
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
                        className={`p-3 rounded border-l-4 cursor-pointer ${getEventTypeColor(event.type)} ${priorityColors[event.priority]
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
