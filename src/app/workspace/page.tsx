import { auth, currentUser } from "@clerk/nextjs/server"
import {
  FileText,
  Brain,
  Plus,
  Clock,
  Target,
  TrendingUp,
} from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"

import { Button } from "~/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Progress } from "~/components/ui/progress"
import { SidebarInset } from "~/components/ui/sidebar"
import { MUTATIONS, QUERIES } from "~/server/db/queries"
export default async function StudyDashboard() {

  const user = await auth();
  if (!user.userId) {
    redirect('/sign-in');
  }

  const currUser = await currentUser()
  if (!currUser) {
    redirect('/sign-in');
  }

  //INFO: onboardFolder is folder used to signal that the user is not new and it has been onboarded
  const onboardFolder = await QUERIES.getRootFolderForUser(user.userId);

  if (!onboardFolder) {
    await MUTATIONS.onboardUser(user.userId);


  }




  const [recentDocuments, upcommingCalendarEvents, recentNotes, dashboardStats, dailyCalEvents] = await Promise.all([

    QUERIES.getMax5Documents(user.userId),
    QUERIES.getCalEvents(user.userId),
    QUERIES.getNotes(user.userId),
    QUERIES.getDashboardStats(user.userId),
    QUERIES.getDailyCalEvents(user.userId)
  ]);

  const studyStats = [
    { label: "Documents Uploaded", value: dashboardStats.allTimeDocuments, change: dashboardStats.percentageOfDocumentsCreatedLastMonth },
    { label: "Notes Created", value: dashboardStats.allTimeNotes, change: dashboardStats.percentageOfNotesCreatedLastMonth },
    { label: "AI Summaries", value: 42, change: "+23%" },
    { label: "Study Hours", value: 87, change: "+15%" },
  ]


  return (
    <SidebarInset>
      <div className="flex flex-1 flex-col gap-4 p-4">
        {/* Welcome Section */}
        <div className="rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
          <h1 className="text-2xl font-bold">Welcome back, {currUser?.fullName}!</h1>
          <p className="mt-2 opacity-90">You have {upcommingCalendarEvents.length} upcoming exams this month. Stay focused!</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {studyStats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-green-600">{stat.change} from last month</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">


          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Upcoming Exam Deadlines
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcommingCalendarEvents.map((event, index) => {
                  // Calculate days left
                  const eventDate = new Date(event.date); // assuming event.date is a date string
                  const now = new Date();
                  // Calculate difference in milliseconds, then convert to full days
                  const diffMs = eventDate.getTime() - now.getTime();
                  const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

                  return (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                      <div>
                        <h4 className="font-medium">{event.type}</h4>
                        <p className="text-xs text-muted-foreground">{event.date}</p>
                      </div>
                      <div className="text-right">
                        <div
                          className={`text-sm font-medium ${new Date(event.startTime).getTime() - Date.now() <= 5 * 60 * 1000
                            ? "text-red-600"
                            : "text-blue-600"
                            }`}
                        >
                          {daysLeft} day{daysLeft !== 1 ? "s" : ""} left
                        </div>
                        <Progress value={Math.max(0, 100 - daysLeft * 5)} className="w-20 mt-1" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Recent Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentDocuments.map((doc, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded bg-blue-100 flex items-center justify-center">
                      <FileText className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{doc.name}</p>
                      <p className="text-xs text-muted-foreground">{doc.dateModified.toString()}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                <Link href="/workspace/documents" className="w-full h-full">
                  View All Documents
                </Link>
              </Button>

            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                AI Study Assistant
              </CardTitle>
              <CardDescription>Simplify and summarize your documents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Upload Document to Simplify
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Brain className="mr-2 h-4 w-4" />
                  Generate Study Summary
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <FileText className="mr-2 h-4 w-4" />
                  Create Practice Questions
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Todays Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>


              <div className="space-y-3">
                {dailyCalEvents && dailyCalEvents.length > 0 ? (
                  dailyCalEvents.map((event) => (
                    <div key={event.id} className="flex items-center gap-3 p-2 rounded-lg bg-blue-50">
                      <div className="w-2 h-8 bg-blue-500 rounded"></div>
                      <div>
                        <p className="text-sm font-medium">{event.title || "Untitled Event"}</p>
                        <p className="text-xs text-muted-foreground">
                          {event.startTime} - {event.endTime}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">Nothing to do for today.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </SidebarInset>
  )
}
