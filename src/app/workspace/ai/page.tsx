"use client"

import { useState, useRef, useEffect } from "react"
import {
  Brain,
  Send,
  Mic,
  MicOff,
  ImageIcon,
  FileText,
  Upload,
  Download,
  Copy,
  Share2,
  Bookmark,
  Settings,
  Zap,
  Activity,
  Clock,
  User,
  Lightbulb,
  BookOpen,
  Calculator,
  Globe,
  Code,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Search,
  Plus,
} from "lucide-react"

import { Button } from "~/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Textarea } from "~/components/ui/textarea"
import { Badge } from "~/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { Slider } from "~/components/ui/slider"
import { Switch } from "~/components/ui/switch"

// Types
interface Message {
  id: string
  type: "user" | "assistant"
  content: string
  timestamp: Date
  attachments?: Attachment[]
  reactions?: Reaction[]
  isBookmarked?: boolean
  isStarred?: boolean
  metadata?: MessageMetadata
}

interface Attachment {
  id: string
  name: string
  type: "image" | "document" | "audio" | "video" | "code"
  url: string
  size: number
}

interface Reaction {
  type: "like" | "dislike" | "helpful" | "not-helpful"
  timestamp: Date
}

interface MessageMetadata {
  processingTime?: number
  confidence?: number
  sources?: string[]
  tokens?: number
  model?: string
}

interface AITool {
  id: string
  name: string
  description: string
  icon: any
  category: string
  isActive: boolean
  usage: number
  rating: number
}

interface Conversation {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
  tags: string[]
  isBookmarked: boolean
  summary?: string
}

// Sample data
const aiTools: AITool[] = [
  {
    id: "summarizer",
    name: "Document Summarizer",
    description: "Extract key points and create concise summaries",
    icon: FileText,
    category: "Text Processing",
    isActive: true,
    usage: 89,
    rating: 4.8,
  },
  {
    id: "explainer",
    name: "Concept Explainer",
    description: "Break down complex topics into simple explanations",
    icon: Lightbulb,
    category: "Education",
    isActive: true,
    usage: 76,
    rating: 4.9,
  },
  {
    id: "calculator",
    name: "Math Solver",
    description: "Solve equations and mathematical problems",
    icon: Calculator,
    category: "Mathematics",
    isActive: true,
    usage: 65,
    rating: 4.7,
  },
  {
    id: "translator",
    name: "Language Translator",
    description: "Translate text between multiple languages",
    icon: Globe,
    category: "Language",
    isActive: false,
    usage: 43,
    rating: 4.6,
  },
  {
    id: "coder",
    name: "Code Assistant",
    description: "Help with programming and code review",
    icon: Code,
    category: "Programming",
    isActive: true,
    usage: 58,
    rating: 4.8,
  },
  {
    id: "writer",
    name: "Writing Assistant",
    description: "Improve grammar, style, and clarity",
    icon: BookOpen,
    category: "Writing",
    isActive: true,
    usage: 72,
    rating: 4.7,
  },
]

const sampleConversations: Conversation[] = [
  {
    id: "1",
    title: "Calculus Integration Help",
    messages: [],
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-01-20"),
    tags: ["math", "calculus", "integration"],
    isBookmarked: true,
    summary: "Discussion about integration techniques and applications",
  },
  {
    id: "2",
    title: "Physics Quantum Mechanics",
    messages: [],
    createdAt: new Date("2024-01-19"),
    updatedAt: new Date("2024-01-19"),
    tags: ["physics", "quantum", "mechanics"],
    isBookmarked: false,
    summary: "Explanation of quantum mechanical principles",
  },
  {
    id: "3",
    title: "Chemistry Organic Compounds",
    messages: [],
    createdAt: new Date("2024-01-18"),
    updatedAt: new Date("2024-01-18"),
    tags: ["chemistry", "organic", "compounds"],
    isBookmarked: true,
    summary: "Analysis of organic compound structures",
  },
]

const quickPrompts = [
  "Explain this concept in simple terms",
  "Summarize the key points",
  "Create a study guide",
  "Generate practice questions",
  "Find connections to other topics",
  "Provide real-world examples",
  "Break down the problem step by step",
  "Compare and contrast these ideas",
]

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedTools, setSelectedTools] = useState<string[]>(["summarizer", "explainer", "calculator"])
  const [conversations, setConversations] = useState<Conversation[]>(sampleConversations)
  const [currentConversation, setCurrentConversation] = useState<string | null>(null)
  const [showSettings, setShowSettings] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(false)
  const [autoSave, setAutoSave] = useState(true)
  const [creativityLevel, setCreativityLevel] = useState([0.7])
  const [responseLength, setResponseLength] = useState("medium")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputMessage,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsProcessing(true)

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: generateAIResponse(inputMessage),
        timestamp: new Date(),
        metadata: {
          processingTime: Math.random() * 2000 + 500,
          confidence: Math.random() * 0.3 + 0.7,
          tokens: Math.floor(Math.random() * 500 + 100),
          model: "GPT-4",
        },
      }
      setMessages((prev) => [...prev, aiResponse])
      setIsProcessing(false)
    }, 1500)
  }

  const generateAIResponse = (input: string): string => {
    const responses = [
      "I'd be happy to help you with that! Let me break this down into manageable parts...",
      "That's a great question! Here's what I understand and how we can approach it...",
      "Based on your input, I can provide several insights and explanations...",
      "Let me analyze this step by step and provide you with a comprehensive answer...",
      "This is an interesting topic! Here are the key concepts you should understand...",
    ]
    return responses[Math.floor(Math.random() * responses.length)]
  }

  const handleFileUpload = (files: FileList) => {
    Array.from(files).forEach((file) => {
      const attachment: Attachment = {
        id: Date.now().toString(),
        name: file.name,
        type: getFileType(file.name),
        url: URL.createObjectURL(file),
        size: file.size,
      }

      const message: Message = {
        id: Date.now().toString(),
        type: "user",
        content: `Uploaded file: ${file.name}`,
        timestamp: new Date(),
        attachments: [attachment],
      }

      setMessages((prev) => [...prev, message])
    })
  }

  const getFileType = (filename: string): Attachment["type"] => {
    const ext = filename.split(".").pop()?.toLowerCase()
    if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext || "")) return "image"
    if (["mp4", "avi", "mov", "webm"].includes(ext || "")) return "video"
    if (["mp3", "wav", "ogg"].includes(ext || "")) return "audio"
    if (["js", "ts", "py", "java", "cpp", "html", "css"].includes(ext || "")) return "code"
    return "document"
  }

  const toggleMessageReaction = (messageId: string, reactionType: Reaction["type"]) => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id === messageId) {
          const reactions = msg.reactions || []
          const existingReaction = reactions.find((r) => r.type === reactionType)

          if (existingReaction) {
            return {
              ...msg,
              reactions: reactions.filter((r) => r.type !== reactionType),
            }
          } else {
            return {
              ...msg,
              reactions: [...reactions, { type: reactionType, timestamp: new Date() }],
            }
          }
        }
        return msg
      }),
    )
  }

  const toggleMessageBookmark = (messageId: string) => {
    setMessages((prev) => prev.map((msg) => (msg.id === messageId ? { ...msg, isBookmarked: !msg.isBookmarked } : msg)))
  }

  const copyMessageContent = (content: string) => {
    navigator.clipboard.writeText(content)
  }

  const filteredTools = aiTools.filter((tool) => {
    const matchesSearch =
      tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || tool.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categories = Array.from(new Set(aiTools.map((tool) => tool.category)))

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Brain className="w-8 h-8 text-purple-600" />
              AI Study Assistant
            </h1>
            <Badge variant="secondary" className="text-sm">
              {selectedTools.length} tools active
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setShowSettings(!showSettings)}>
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Chat
            </Button>
          </div>
        </div>

        {/* AI Tools Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Tools</p>
                  <p className="text-2xl font-bold">{selectedTools.length}</p>
                </div>
                <Zap className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Conversations</p>
                  <p className="text-2xl font-bold">{conversations.length}</p>
                </div>
                <MessageSquare className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Messages Today</p>
                  <p className="text-2xl font-bold">{messages.length}</p>
                </div>
                <Activity className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg Response</p>
                  <p className="text-2xl font-bold">1.2s</p>
                </div>
                <Clock className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                AI Assistant Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Response Settings</h4>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm">Creativity Level</Label>
                      <Slider
                        value={creativityLevel}
                        onValueChange={setCreativityLevel}
                        max={1}
                        min={0}
                        step={0.1}
                        className="mt-2"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Conservative</span>
                        <span>Creative</span>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm">Response Length</Label>
                      <Select value={responseLength} onValueChange={setResponseLength}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="short">Short</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="long">Long</SelectItem>
                          <SelectItem value="detailed">Very Detailed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-medium">Features</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Voice Input</Label>
                      <Switch checked={voiceEnabled} onCheckedChange={setVoiceEnabled} />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Auto-save Conversations</Label>
                      <Switch checked={autoSave} onCheckedChange={setAutoSave} />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Show Processing Time</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Enable Notifications</Label>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-medium">Privacy</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Store Conversations</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Analytics</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Share Usage Data</Label>
                      <Switch />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="space-y-4">
            {/* AI Tools */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">AI Tools</CardTitle>
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search tools..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="text-sm"
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {filteredTools.map((tool) => (
                    <div
                      key={tool.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${selectedTools.includes(tool.id)
                        ? "border-purple-500 bg-purple-50"
                        : "border-gray-200 hover:border-gray-300"
                        }`}
                      onClick={() => {
                        setSelectedTools((prev) =>
                          prev.includes(tool.id) ? prev.filter((id) => id !== tool.id) : [...prev, tool.id],
                        )
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <ImageIcon className="w-5 h-5 text-purple-600 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-sm">{tool.name}</h4>
                            <Badge variant="outline" className="text-xs">
                              {tool.rating}★
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-600 mt-1">{tool.description}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-1">
                              <div className="bg-purple-600 h-1 rounded-full" style={{ width: `${tool.usage}%` }} />
                            </div>
                            <span className="text-xs text-gray-500">{tool.usage}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Conversations */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Conversations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {conversations.map((conv) => (
                    <div
                      key={conv.id}
                      className={`p-3 rounded-lg cursor-pointer transition-all ${currentConversation === conv.id ? "bg-blue-50 border border-blue-200" : "hover:bg-gray-50"
                        }`}
                      onClick={() => setCurrentConversation(conv.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">{conv.title}</h4>
                          <p className="text-xs text-gray-500 mt-1">{conv.summary}</p>
                          <div className="flex items-center gap-1 mt-2">
                            <Clock className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-500">{conv.updatedAt.toLocaleDateString()}</span>
                          </div>
                        </div>
                        {conv.isBookmarked && <Bookmark className="w-4 h-4 text-yellow-600" />}
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {conv.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start text-sm">
                    <FileText className="w-4 h-4 mr-2" />
                    Analyze Document
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-sm">
                    <Calculator className="w-4 h-4 mr-2" />
                    Solve Math Problem
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-sm">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Create Study Guide
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-sm">
                    <Lightbulb className="w-4 h-4 mr-2" />
                    Explain Concept
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chat Interface */}
          <div className="lg:col-span-3">
            <Card className="h-[800px] flex flex-col">
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                      <Brain className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold">AI Study Assistant</h3>
                      <p className="text-sm text-gray-500">Ready to help with your studies</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center py-12">
                    <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Welcome to AI Study Assistant</h3>
                    <p className="text-gray-500 mb-6">
                      I'm here to help you learn, understand, and excel in your studies.
                    </p>
                    <div className="grid grid-cols-2 gap-2 max-w-md mx-auto">
                      {quickPrompts.slice(0, 4).map((prompt, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          className="text-xs"
                          onClick={() => setInputMessage(prompt)}
                        >
                          {prompt}
                        </Button>
                      ))}
                    </div>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${message.type === "user" ? "justify-end" : "justify-start"}`}
                    >
                      {message.type === "assistant" && (
                        <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <Brain className="w-5 h-5 text-white" />
                        </div>
                      )}
                      <div
                        className={`max-w-[80%] rounded-lg p-4 ${message.type === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
                          }`}
                      >
                        <div className="space-y-2">
                          <p className="text-sm">{message.content}</p>
                          {message.attachments && (
                            <div className="space-y-2">
                              {message.attachments.map((attachment) => (
                                <div key={attachment.id} className="flex items-center gap-2 p-2 bg-white/10 rounded">
                                  <FileText className="w-4 h-4" />
                                  <span className="text-xs">{attachment.name}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/20">
                          <div className="flex items-center gap-2">
                            <span className="text-xs opacity-75">
                              {message.timestamp.toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                            {message.metadata?.processingTime && (
                              <span className="text-xs opacity-75">
                                • {Math.round(message.metadata.processingTime)}ms
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            {message.type === "assistant" && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                  onClick={() => toggleMessageReaction(message.id, "like")}
                                >
                                  <ThumbsUp className="w-3 h-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                  onClick={() => toggleMessageReaction(message.id, "dislike")}
                                >
                                  <ThumbsDown className="w-3 h-3" />
                                </Button>
                              </>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => copyMessageContent(message.content)}
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => toggleMessageBookmark(message.id)}
                            >
                              <Bookmark
                                className={`w-3 h-3 ${message.isBookmarked ? "fill-yellow-400 text-yellow-400" : ""}`}
                              />
                            </Button>
                          </div>
                        </div>
                      </div>
                      {message.type === "user" && (
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="w-5 h-5 text-white" />
                        </div>
                      )}
                    </div>
                  ))
                )}
                {isProcessing && (
                  <div className="flex gap-3 justify-start">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                      <Brain className="w-5 h-5 text-white" />
                    </div>
                    <div className="bg-gray-100 rounded-lg p-4">
                      <div className="flex items-center gap-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          />
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          />
                        </div>
                        <span className="text-sm text-gray-600">Thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="border-t p-4">
                <div className="space-y-3">
                  {/* Quick Prompts */}
                  <div className="flex flex-wrap gap-2">
                    {quickPrompts.slice(0, 4).map((prompt, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="text-xs"
                        onClick={() => setInputMessage(prompt)}
                      >
                        {prompt}
                      </Button>
                    ))}
                  </div>

                  {/* Input */}
                  <div className="flex items-end gap-2">
                    <div className="flex-1 space-y-2">
                      <Textarea
                        placeholder="Ask me anything about your studies..."
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault()
                            handleSendMessage()
                          }
                        }}
                        className="min-h-[60px] resize-none"
                      />
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                            <Upload className="w-4 h-4 mr-2" />
                            Attach
                          </Button>
                          <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            className="hidden"
                            onChange={(e) => {
                              if (e.target.files) {
                                handleFileUpload(e.target.files)
                              }
                            }}
                          />
                          {voiceEnabled && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setIsRecording(!isRecording)}
                              className={isRecording ? "bg-red-50 border-red-200" : ""}
                            >
                              {isRecording ? <MicOff className="w-4 h-4 mr-2" /> : <Mic className="w-4 h-4 mr-2" />}
                              {isRecording ? "Stop" : "Voice"}
                            </Button>
                          )}
                        </div>
                        <div className="text-xs text-gray-500">{inputMessage.length}/2000 characters</div>
                      </div>
                    </div>
                    <Button
                      onClick={handleSendMessage}
                      disabled={!inputMessage.trim() || isProcessing}
                      className="h-[60px] px-6"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
