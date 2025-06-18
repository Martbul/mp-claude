import { auth, currentUser } from "@clerk/nextjs/server"
import {
  FileText,
  Brain,
  Plus,
  Clock,
  Target,
  TrendingUp,
} from "lucide-react"
import { redirect } from "next/navigation"

import { Button } from "~/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Progress } from "~/components/ui/progress"
import { SidebarInset } from "~/components/ui/sidebar"
const upcomingDeadlines = [
  { subject: "Mathematics", exam: "Calculus Final", date: "2024-01-15", daysLeft: 3 },
  { subject: "Physics", exam: "Quantum Mechanics", date: "2024-01-20", daysLeft: 8 },
  { subject: "Chemistry", exam: "Organic Chemistry", date: "2024-01-25", daysLeft: 13 },
]

const recentDocuments = [
  { name: "Linear Algebra Notes", type: "PDF", lastModified: "2 hours ago" },
  { name: "Physics Lab Report", type: "DOC", lastModified: "1 day ago" },
  { name: "Chemistry Formulas", type: "PDF", lastModified: "3 days ago" },
]

const studyStats = [
  { label: "Documents Uploaded", value: 24, change: "+12%" },
  { label: "Notes Created", value: 156, change: "+8%" },
  { label: "AI Summaries", value: 42, change: "+23%" },
  { label: "Study Hours", value: 87, change: "+15%" },
]

export default async function StudyDashboard() {

  const user = await auth();
  if (!user) {
    redirect('/sign-in');
  }

  const currUser = await currentUser()
  return (
    <SidebarInset>
      <div className="flex flex-1 flex-col gap-4 p-4">
        {/* Welcome Section */}
        <div className="rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
          <h1 className="text-2xl font-bold">Welcome back, {currUser?.fullName}!</h1>
          <p className="mt-2 opacity-90">You have 3 upcoming exams this month. Stay focused!</p>
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
          {/* Upcoming Deadlines */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Upcoming Exam Deadlines
              </CardTitle>
              <CardDescription>Stay on track with your exam schedule</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingDeadlines.map((deadline, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <h4 className="font-medium">{deadline.exam}</h4>
                      <p className="text-sm text-muted-foreground">{deadline.subject}</p>
                      <p className="text-xs text-muted-foreground">{deadline.date}</p>
                    </div>
                    <div className="text-right">
                      <div
                        className={`text-sm font-medium ${deadline.daysLeft <= 5 ? "text-red-600" : "text-blue-600"}`}
                      >
                        {deadline.daysLeft} days left
                      </div>
                      <Progress value={Math.max(0, 100 - deadline.daysLeft * 5)} className="w-20 mt-1" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Documents */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Recent Documents
              </CardTitle>
              <CardDescription>Your latest study materials</CardDescription>
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
                      <p className="text-xs text-muted-foreground">{doc.lastModified}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                View All Documents
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* AI Assistant & Quick Actions */}
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
                Today's Schedule
              </CardTitle>
              <CardDescription>Your study plan for today</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-2 rounded-lg bg-blue-50">
                  <div className="w-2 h-8 bg-blue-500 rounded"></div>
                  <div>
                    <p className="text-sm font-medium">Mathematics Review</p>
                    <p className="text-xs text-muted-foreground">9:00 AM - 11:00 AM</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2 rounded-lg bg-green-50">
                  <div className="w-2 h-8 bg-green-500 rounded"></div>
                  <div>
                    <p className="text-sm font-medium">Physics Lab Prep</p>
                    <p className="text-xs text-muted-foreground">2:00 PM - 4:00 PM</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2 rounded-lg bg-purple-50">
                  <div className="w-2 h-8 bg-purple-500 rounded"></div>
                  <div>
                    <p className="text-sm font-medium">Chemistry Notes</p>
                    <p className="text-xs text-muted-foreground">7:00 PM - 9:00 PM</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </SidebarInset>
  )
}
