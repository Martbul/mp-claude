"use client"

import { useState } from "react"
import { ArrowRight, ArrowLeft, BookOpen, Calendar, FileText, Brain, CheckCircle } from "lucide-react"
import { Button } from "~/components/ui/button"
import { Card, CardContent } from "~/components/ui/card"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Checkbox } from "~/components/ui/checkbox"
import { Progress } from "~/components/ui/progress"
import { Badge } from "~/components/ui/badge"
import Link from "next/link"

const steps = [
  { id: 1, title: "Welcome", description: "Let's get you started" },
  { id: 2, title: "Profile", description: "Tell us about yourself" },
  { id: 3, title: "Subjects", description: "What are you studying?" },
  { id: 4, title: "Goals", description: "Set your study goals" },
  { id: 5, title: "Complete", description: "You're all set!" },
]

const subjects = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "Computer Science",
  "Engineering",
  "Medicine",
  "Law",
  "Business",
  "Psychology",
  "History",
  "Literature",
  "Economics",
  "Philosophy",
  "Art",
]

const studyGoals = [
  { id: "grades", label: "Improve my grades", icon: "📈" },
  { id: "organization", label: "Better organization", icon: "📋" },
  { id: "time", label: "Save study time", icon: "⏰" },
  { id: "understanding", label: "Understand complex topics", icon: "🧠" },
  { id: "exams", label: "Prepare for exams", icon: "📝" },
  { id: "research", label: "Research assistance", icon: "🔍" },
]

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    institution: "",
    level: "",
    subjects: [] as string[],
    goals: [] as string[],
  })

  const progress = (currentStep / steps.length) * 100

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubjectToggle = (subject: string) => {
    setFormData((prev) => ({
      ...prev,
      subjects: prev.subjects.includes(subject)
        ? prev.subjects.filter((s) => s !== subject)
        : [...prev.subjects, subject],
    }))
  }

  const handleGoalToggle = (goalId: string) => {
    setFormData((prev) => ({
      ...prev,
      goals: prev.goals.includes(goalId) ? prev.goals.filter((g) => g !== goalId) : [...prev.goals, goalId],
    }))
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto">
              <BookOpen className="w-10 h-10 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-4">Welcome to StudyHub!</h2>
              <p className="text-xl text-gray-600 max-w-md mx-auto">
                Let's set up your personalized study dashboard in just a few steps.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <FileText className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="text-sm font-medium">Smart Documents</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <Brain className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <div className="text-sm font-medium">AI Assistant</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <Calendar className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <div className="text-sm font-medium">Deadline Tracking</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <BookOpen className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                <div className="text-sm font-medium">Note Taking</div>
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-2">Tell us about yourself</h2>
              <p className="text-gray-600">This helps us personalize your experience</p>
            </div>
            <div className="space-y-4 max-w-md mx-auto">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <Label htmlFor="institution">School/University</Label>
                <Input
                  id="institution"
                  value={formData.institution}
                  onChange={(e) => setFormData((prev) => ({ ...prev, institution: e.target.value }))}
                  placeholder="Enter your institution"
                />
              </div>
              <div>
                <Label htmlFor="level">Academic Level</Label>
                <select
                  id="level"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={formData.level}
                  onChange={(e) => setFormData((prev) => ({ ...prev, level: e.target.value }))}
                >
                  <option value="">Select your level</option>
                  <option value="high-school">High School</option>
                  <option value="undergraduate">Undergraduate</option>
                  <option value="graduate">Graduate</option>
                  <option value="phd">PhD</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-2">What are you studying?</h2>
              <p className="text-gray-600">Select all subjects that apply to you</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-4xl mx-auto">
              {subjects.map((subject) => (
                <div
                  key={subject}
                  className={`p-3 border rounded-lg cursor-pointer transition-all ${formData.subjects.includes(subject)
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-200 hover:border-gray-300"
                    }`}
                  onClick={() => handleSubjectToggle(subject)}
                >
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={formData.subjects.includes(subject)}
                      onChange={() => handleSubjectToggle(subject)}
                    />
                    <span className="text-sm font-medium">{subject}</span>
                  </div>
                </div>
              ))}
            </div>
            {formData.subjects.length > 0 && (
              <div className="text-center">
                <Badge variant="secondary">
                  {formData.subjects.length} subject{formData.subjects.length !== 1 ? "s" : ""} selected
                </Badge>
              </div>
            )}
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-2">What are your study goals?</h2>
              <p className="text-gray-600">Help us understand how StudyHub can best support you</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              {studyGoals.map((goal) => (
                <div
                  key={goal.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${formData.goals.includes(goal.id)
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                    }`}
                  onClick={() => handleGoalToggle(goal.id)}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{goal.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          checked={formData.goals.includes(goal.id)}
                          onChange={() => handleGoalToggle(goal.id)}
                        />
                        <span className="font-medium">{goal.label}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case 5:
        return (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-4">You're all set, {formData.name}!</h2>
              <p className="text-xl text-gray-600 max-w-md mx-auto">
                Your personalized StudyHub dashboard is ready. Let's start your academic journey!
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-6 max-w-md mx-auto">
              <h3 className="font-semibold mb-3">Your Setup Summary:</h3>
              <div className="space-y-2 text-sm text-left">
                <div>
                  📚 <strong>{formData.subjects.length}</strong> subjects selected
                </div>
                <div>
                  🎯 <strong>{formData.goals.length}</strong> study goals set
                </div>
                <div>
                  🏫 Studying at <strong>{formData.institution}</strong>
                </div>
                <div>
                  🎓 <strong>{formData.level}</strong> level
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <Button size="lg" className="w-full max-w-sm" asChild>
                <Link href="/dashboard">
                  Go to Dashboard <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <p className="text-sm text-gray-500">You can always update these settings later in your profile.</p>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">StudyHub</span>
          </Link>
          <div className="text-sm text-gray-500">
            Step {currentStep} of {steps.length}
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between mt-2">
            {steps.map((step) => (
              <div
                key={step.id}
                className={`text-xs ${step.id <= currentStep ? "text-blue-600 font-medium" : "text-gray-400"}`}
              >
                {step.title}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <Card className="max-w-4xl mx-auto border-0 shadow-lg">
          <CardContent className="p-8 md:p-12">{renderStepContent()}</CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between max-w-4xl mx-auto mt-8">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </Button>
          <Button onClick={handleNext} disabled={currentStep === steps.length} className="flex items-center gap-2">
            {currentStep === steps.length ? "Complete" : "Next"}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </main>
    </div>
  )
}
