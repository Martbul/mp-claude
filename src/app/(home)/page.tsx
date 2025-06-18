//there is not "us client" which make the page.tsx a server component
//
//"use server"  allows a functon that is defined on the server to be used in the client
//
//cause this is a server component every child that i has that is not expicitly said to be a client component will become a server component
import { ArrowRight, BookOpen, Brain, Calendar, FileText, Star } from "lucide-react"
import Link from "next/link"
import { Badge } from "~/components/ui/badge"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"

const features = [
  {
    icon: FileText,
    title: "Smart Document Management",
    description: "Upload, organize, and access all your study materials in one place with intelligent categorization.",
  },
  {
    icon: Brain,
    title: "AI-Powered Simplification",
    description: "Transform complex documents into easy-to-understand summaries and study guides automatically.",
  },
  {
    icon: Calendar,
    title: "Exam Deadline Tracking",
    description: "Never miss an exam again with smart calendar integration and deadline reminders.",
  },
  {
    icon: BookOpen,
    title: "Interactive Note Taking",
    description: "Create, organize, and link your notes with powerful editing tools and cross-references.",
  },
]

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Medical Student",
    content: "StudyHub transformed how I manage my coursework. The AI summaries saved me hours of reading time.",
    rating: 5,
  },
  {
    name: "Marcus Johnson",
    role: "Engineering Student",
    content: "The deadline tracking feature is a game-changer. I'm finally staying on top of all my assignments.",
    rating: 5,
  },
  {
    name: "Emma Rodriguez",
    role: "Law Student",
    content: "Being able to simplify complex legal documents with AI has made studying so much more efficient.",
    rating: 5,
  },
]

const stats = [
  { value: "50K+", label: "Active Students" },
  { value: "1M+", label: "Documents Processed" },
  { value: "95%", label: "Improved Grades" },
  { value: "4.9/5", label: "User Rating" },
]

export default function HomePage() {
  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="w-full max-w-7xl px-6 mx-auto py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">StudyHub</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-gray-600 hover:text-gray-900">
              Features
            </a>
            <a href="#testimonials" className="text-gray-600 hover:text-gray-900">
              Reviews
            </a>
            <a href="#pricing" className="text-gray-600 hover:text-gray-900">
              Pricing
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <Button asChild>
              <Link href="/sign-in">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="w-full px-6 py-20 md:min-h-screen flex flex-col justify-center items-center text-center">
        <Badge variant="secondary" className="mb-4">
          🎉 Now with AI-powered study assistance
        </Badge>
        <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
          Your Ultimate
          <br />
          Study Companion
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl">
          Transform your study experience with AI-powered document simplification, smart note-taking, and intelligent
          deadline management. Everything you need to excel academically.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button size="lg" className="text-lg px-8" asChild>
            <Link href="/onboarding">
              Start Free Trial <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="text-lg px-8">
            Watch Demo
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl font-bold text-blue-600">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50 w-full px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Everything You Need to Succeed</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful tools designed specifically for students to organize, understand, and excel in their studies.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="py-20 w-full px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">See It In Action</h2>
            <p className="text-xl text-gray-600">Get a glimpse of your future study dashboard</p>
          </div>
          <div className="relative max-w-6xl mx-auto">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-1">
              <div className="bg-white rounded-xl overflow-hidden">
                <div className="aspect-video bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <BookOpen className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Interactive Dashboard Preview</h3>
                    <p className="text-gray-600 mb-6">Experience the full power of StudyHub</p>
                    <Button size="lg" asChild>
                      <Link href="/onboarding">Try It Now</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-gray-50 w-full px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Loved by Students Worldwide</h2>
            <p className="text-xl text-gray-600">Join thousands of students who have transformed their study habits</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4">"{testimonial.content}"</p>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 w-full px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Studies?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of students who are already using StudyHub to achieve better grades and reduce study stress.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8" asChild>
              <Link href="/onboarding">
                Start Your Free Trial <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8">
              Schedule Demo
            </Button>
          </div>
          <p className="text-sm text-gray-500 mt-4">No credit card required • 14-day free trial • Cancel anytime</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 w-full px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">StudyHub</span>
              </div>
              <p className="text-gray-400">Your ultimate study companion for academic success.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Features</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
                <li><a href="#" className="hover:text-white">Status</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 StudyHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
