import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

import { Button } from "~/components/ui/button"
import type { DB_CalendarrType } from "~/server/db/schema";
import { formatDate, getEventTypeColor } from "../utils/utils";
import { priorityColors } from "~/app/_constants/constants";


type WeekViewProps = {
  days: Date[];
  timeSlots: string[];
  navigate: (direction: "prev" | "next") => void;
  setCurrentDate: React.Dispatch<React.SetStateAction<Date>>;
  setSelectedEvent: React.Dispatch<React.SetStateAction<DB_CalendarrType | null>>;
  getEventsForDate: (date: string) => DB_CalendarrType[];
}

const WeekView = ({
  days,
  timeSlots,
  navigate,
  setCurrentDate,
  setSelectedEvent,
  getEventsForDate,
}: WeekViewProps) => {



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
            <div key={time}>
              <div key={time} className="p-2 text-sm text-gray-500 border-t">
                {time}
              </div>
              {days.map((day) => {
                const dateStr = formatDate(day)
                const dayEvents = getEventsForDate(dateStr!).filter((event) =>
                  event.startTime?.startsWith(time.split(":")[0]!),
                )

                return (
                  <div key={`${day.toISOString()}-${time}`} className="p-1 border-t min-h-[60px]">
                    {dayEvents.map((event) => (
                      <div
                        key={event.id}
                        className={`text-xs p-1 rounded mb-1 cursor-pointer border-l-2 ${getEventTypeColor(event.type)} ${priorityColors[event.priority]
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
            </div>
          ))}
      </div>
    </div>
  )
}

export default WeekView
