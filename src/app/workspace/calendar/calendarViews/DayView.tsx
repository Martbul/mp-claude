import {
  ChevronRight,
  MapPin,
  LinkIcon,
  Edit,
  Trash2,
  MoreHorizontal,
  ChevronLeft,
} from "lucide-react"

import { Button } from "~/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Badge } from "~/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "~/components/ui/dropdown-menu"
import { Checkbox } from "~/components/ui/checkbox"
import { formatDate, formatDisplayDate, getEventTypeColor } from "../utils/utils"
import type { DB_CalendarrType } from "~/server/db/schema"
import { priorityColors } from "~/app/_constants/constants"


type DayViewProps = {
  currentDate: Date;
  timeSlots: string[];
  navigate: (direction: "prev" | "next") => void;
  setCurrentDate: React.Dispatch<React.SetStateAction<Date>>;
  setSelectedEvent: React.Dispatch<React.SetStateAction<DB_CalendarrType | null>>;
  getEventsForDate: (date: string) => DB_CalendarrType[];
  toggleEventCompletion: (eventId: number) => void;
  handleDeleteEvent: (eventId: number) => void;
}

const DayView = ({
  currentDate,
  timeSlots,
  navigate,
  setCurrentDate,
  setSelectedEvent,
  getEventsForDate,
  toggleEventCompletion,
  handleDeleteEvent,
}: DayViewProps) => {



  const dateStr = formatDate(currentDate)
  const dayEvents = getEventsForDate(dateStr!)

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
              const hourEvents = dayEvents.filter((event) => event.startTime?.startsWith(time.split(":")[0]!))

              return (
                <div key={time} className="flex border-t">
                  <div className="w-20 p-2 text-sm text-gray-500">{time}</div>
                  <div className="flex-1 p-2 min-h-[60px]">
                    {hourEvents.map((event) => (
                      <div
                        key={event.id}
                        className={`p-2 rounded mb-1 cursor-pointer border-l-4 ${getEventTypeColor(event.type)} ${priorityColors[event.priority]
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
              <CardTitle className="text-lg">{"Today's Events"}</CardTitle>
            </CardHeader>
            <CardContent>
              {dayEvents.length === 0 ? (
                <p className="text-gray-500">No events scheduled for today</p>
              ) : (
                <div className="space-y-2">
                  {dayEvents.map((event) => (
                    <div
                      key={event.id}
                      className={`p-3 rounded border-l-4 ${getEventTypeColor(event.type)} ${priorityColors[event.priority]
                        } ${event.completed ? "opacity-50" : ""}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Checkbox
                            checked={event.completed!}
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

                      {Array.isArray(event.fileLinks) && event.fileLinks.length > 0 && (
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

export default DayView
