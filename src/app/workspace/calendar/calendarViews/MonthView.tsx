import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Button } from "~/components/ui/button"
import { formatDate, getEventTypeColor } from "../utils/utils";
import { type DB_CalendarrType } from "~/server/db/schema";
import { priorityColors } from "~/app/_constants/constants";



type MonthViewProps = {
  currentDate: Date;
  days: Date[];
  navigate: (direction: "prev" | "next") => void;
  setCurrentDate: React.Dispatch<React.SetStateAction<Date>>;
  setSelectedEvent: React.Dispatch<React.SetStateAction<DB_CalendarrType | null>>;
  getEventsForDate: (date: string) => DB_CalendarrType[],
}

const MonthView = ({
  currentDate,
  days,
  navigate,
  setCurrentDate,
  setSelectedEvent,
  getEventsForDate,
}: MonthViewProps) => {


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
          const dayEvents = getEventsForDate(dateStr!)
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
                    className={`text-xs p-1 rounded border-l-2 cursor-pointer ${getEventTypeColor(event.type)}  ${priorityColors[event.priority]} ${event.completed ? "opacity-50 line-through" : ""}`}


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


export default MonthView
