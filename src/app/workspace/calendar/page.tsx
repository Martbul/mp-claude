import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { QUERIES } from "~/server/db/queries";
import CalendarPage from "./CalendarPage/CalendarPage";

export default async function Calendar() {

  const user = await auth();
  if (!user.userId) {
    redirect('/sign-in');
  }

  const calendarEvents = await QUERIES.getCalendarEvents(user.userId)
  console.log(calendarEvents)



  return (
    <CalendarPage userId={user.userId} calendarEvents={calendarEvents} ></CalendarPage>
  );
}



