
"use client"

import { useState } from "react"
import {
  Settings,
  User,
  Palette,
  Bell,
  Shield,
  Brain,
  BookOpen,
  Database,
  Plug,
  Accessibility,
  Zap,
  Moon,
  Sun,
  Monitor,
  Lock,
  Eye,
  EyeOff,
  Download,
  Upload,
  Trash2,
  RefreshCw,
  Save,
  Check,
  Camera,
  Mail,
  Volume2,
  Smartphone,
  Laptop,
  HelpCircle,
  FileText,
} from "lucide-react"

import { Button } from "~/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Textarea } from "~/components/ui/textarea"
import { Switch } from "~/components/ui/switch"
import { Slider } from "~/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { Badge } from "~/components/ui/badge"
import { Progress } from "~/components/ui/progress"
import { Separator } from "~/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { SignOutButton } from "@clerk/nextjs"
import { DB_SettingsType } from "~/server/db/schema"

// Types
interface UserProfile {
  name: string
  email: string
  phone: string
  bio: string
  institution: string
  major: string
  graduationYear: string
  location: string
  timezone: string
  avatar: string
}

interface AppearanceSettings {
  theme: "light" | "dark" | "system"
  accentColor: string
  fontSize: "small" | "medium" | "large"
  compactMode: boolean
  animations: boolean
  sidebarCollapsed: boolean
  showAvatars: boolean
  colorBlindMode: boolean
}

interface NotificationSettings {
  emailNotifications: boolean
  pushNotifications: boolean
  desktopNotifications: boolean
  studyReminders: boolean
  deadlineAlerts: boolean
  collaborationUpdates: boolean
  weeklyDigest: boolean
  marketingEmails: boolean
  soundEnabled: boolean
  vibrationEnabled: boolean
  quietHours: {
    enabled: boolean
    start: string
    end: string
  }
}

interface PrivacySettings {
  profileVisibility: "public" | "friends" | "private"
  showOnlineStatus: boolean
  allowDirectMessages: boolean
  shareStudyStats: boolean
  dataCollection: boolean
  analyticsOptIn: boolean
  twoFactorAuth: boolean
  sessionTimeout: number
}

interface AISettings {
  aiAssistantEnabled: boolean
  autoSuggestions: boolean
  smartNotifications: boolean
  learningAnalytics: boolean
  personalizedContent: boolean
  voiceInteraction: boolean
  creativityLevel: number
  responseLength: "short" | "medium" | "long"
  preferredLanguage: string
  contextAwareness: boolean
}

interface StudySettings {
  defaultStudyDuration: number
  breakDuration: number
  longBreakInterval: number
  focusMode: boolean
  backgroundSounds: boolean
  pomodoroEnabled: boolean
  goalTracking: boolean
  progressSharing: boolean
  studyStreaks: boolean
  difficultyAdaptation: boolean
  spacedRepetition: boolean
}
const accentColors = [
  { name: "Blue", value: "#3B82F6" },
  { name: "Purple", value: "#8B5CF6" },
  { name: "Green", value: "#10B981" },
  { name: "Orange", value: "#F59E0B" },
  { name: "Red", value: "#EF4444" },
  { name: "Pink", value: "#EC4899" },
  { name: "Indigo", value: "#6366F1" },
  { name: "Teal", value: "#14B8A6" },
]

const languages = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "zh", name: "Chinese" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "pt", name: "Portuguese" },
]

const timezones = [
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Asia/Tokyo",
  "Asia/Shanghai",
  "Australia/Sydney",
]

export default function SettingsPage(props:{userId:string,userSettings: DB_SettingsType}) {
  const { userSettings } = props

  const [profile, setProfile] = useState<UserProfile>({
    name: userSettings.name ?? "",
    email: userSettings.email ?? "",
    phone: userSettings.phone ?? "",
    bio: userSettings.bio ?? "",
    institution: userSettings.institution ?? "",
    major: userSettings.major ?? "",
    graduationYear: userSettings.graduationYear ?? "",
    location: userSettings.location ?? "",
    timezone: userSettings.timezone ?? "America/New_York",
    avatar: userSettings.avatar ?? "/placeholder.svg?height=100&width=100",
  })

const [appearance, setAppearance] = useState<AppearanceSettings>({
    theme: (userSettings.theme as AppearanceSettings["theme"]) ?? "system",
    accentColor: userSettings.accentColor ?? "#3B82F6",
    fontSize: (userSettings.fontSize as AppearanceSettings["fontSize"]) ?? "medium",
    compactMode: userSettings.compactMode ?? false,
    animations: userSettings.animations ?? true,
    sidebarCollapsed: userSettings.sidebarCollapsed ?? false,
    showAvatars: userSettings.showAvatars ?? true,
    colorBlindMode: userSettings.colorBlindMode ?? false,
  })

  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailNotifications: userSettings.emailNotifications ?? true,
    pushNotifications: userSettings.pushNotifications ?? true,
    desktopNotifications: userSettings.desktopNotifications ?? false,
    studyReminders: userSettings.studyReminders ?? true,
    deadlineAlerts: userSettings.deadlineAlerts ?? true,
    collaborationUpdates: userSettings.collaborationUpdates ?? true,
    weeklyDigest: userSettings.weeklyDigest ?? true,
    marketingEmails: userSettings.marketingEmails ?? false,
    soundEnabled: userSettings.soundEnabled ?? true,
    vibrationEnabled: userSettings.vibrationEnabled ?? true,
    quietHours: userSettings.quietHours ?? {
      enabled: false,
      start: "22:00",
      end: "08:00",
    },
  })

  const [privacy, setPrivacy] = useState<PrivacySettings>({
    profileVisibility: (userSettings.profileVisibility as PrivacySettings["profileVisibility"]) ?? "friends",
    showOnlineStatus: userSettings.showOnlineStatus ?? true,
    allowDirectMessages: userSettings.allowDirectMessages ?? true,
    shareStudyStats: userSettings.shareStudyStats ?? false,
    dataCollection: userSettings.dataCollection ?? true,
    analyticsOptIn: userSettings.analyticsOptIn ?? true,
    twoFactorAuth: userSettings.twoFactorAuth ?? false,
    sessionTimeout: userSettings.sessionTimeout ?? 30,
  })

  const [aiSettings, setAISettings] = useState<AISettings>({
    aiAssistantEnabled: userSettings.aiAssistantEnabled ?? true,
    autoSuggestions: userSettings.autoSuggestions ?? true,
    smartNotifications: userSettings.smartNotifications ?? true,
    learningAnalytics: userSettings.learningAnalytics ?? true,
    personalizedContent: userSettings.personalizedContent ?? true,
    voiceInteraction: userSettings.voiceInteraction ?? false,
    creativityLevel: userSettings.creativityLevel ?? 70,
    responseLength: (userSettings.responseLength as AISettings["responseLength"]) ?? "medium",
    preferredLanguage: userSettings.preferredLanguage ?? "en",
    contextAwareness: userSettings.contextAwareness ?? true,
  })

  const [studySettings, setStudySettings] = useState<StudySettings>({
    defaultStudyDuration: userSettings.defaultStudyDuration ?? 25,
    breakDuration: userSettings.breakDuration ?? 5,
    longBreakInterval: userSettings.longBreakInterval ?? 4,
    focusMode: userSettings.focusMode ?? true,
    backgroundSounds: userSettings.backgroundSounds ?? false,
    pomodoroEnabled: userSettings.pomodoroEnabled ?? true,
    goalTracking: userSettings.goalTracking ?? true,
    progressSharing: userSettings.progressSharing ?? false,
    studyStreaks: userSettings.studyStreaks ?? true,
    difficultyAdaptation: userSettings.difficultyAdaptation ?? true,
    spacedRepetition: userSettings.spacedRepetition ?? true,
  })

  const [activeTab, setActiveTab] = useState("profile")
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [storageUsed] = useState(8.2) // GB
  const [storageLimit] = useState(15) // GB

  const handleSaveSettings = () => {
    // Simulate saving settings
    setHasUnsavedChanges(false)
    // Show success toast or notification
  }

  const handleResetSettings = () => {
    // Reset to default values
    setHasUnsavedChanges(false)
  }

  const handleExportData = () => {
    // Simulate data export
    const data = {
      profile,
      appearance,
      notifications,
      privacy,
      aiSettings,
      studySettings,
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "studyhub-settings.json"
    a.click()
  }

if (userSettings instanceof Error) {
  return <div>Error loading settings: {userSettings.message}</div>
}
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Settings className="w-8 h-8 text-gray-700" />
              Settings
            </h1>
            {hasUnsavedChanges && (
              <Badge variant="secondary" className="text-sm">
                Unsaved changes
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleResetSettings}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Reset
            </Button>
            <Button onClick={handleSaveSettings} disabled={!hasUnsavedChanges}>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>

        {/* Settings Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="space-y-2">
            <Card>
              <CardContent className="p-4">
                <nav className="space-y-1">
                  {[
                    { id: "profile", label: "Profile", icon: User },
                    { id: "appearance", label: "Appearance", icon: Palette },
                    { id: "notifications", label: "Notifications", icon: Bell },
                    { id: "privacy", label: "Privacy & Security", icon: Shield },
                    { id: "ai", label: "AI Assistant", icon: Brain },
                    { id: "study", label: "Study Preferences", icon: BookOpen },
                    { id: "data", label: "Data & Storage", icon: Database },
                    { id: "integrations", label: "Integrations", icon: Plug },
                    { id: "accessibility", label: "Accessibility", icon: Accessibility },
                    { id: "advanced", label: "Advanced", icon: Zap },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg transition-colors ${activeTab === item.id
                        ? "bg-blue-100 text-blue-700 font-medium"
                        : "text-gray-600 hover:bg-gray-100"
                        }`}
                    >
                      <item.icon className="w-4 h-4" />
                      {item.label}
                    </button>
                  ))}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Profile Settings */}
            {activeTab === "profile" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Profile Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center gap-6">
                      <Avatar className="w-24 h-24">
                        <AvatarImage src={profile.avatar || "/placeholder.svg"} />
                        <AvatarFallback className="text-2xl">
                          {profile.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-2">
                        <Button variant="outline">
                          <Camera className="w-4 h-4 mr-2" />
                          Change Photo
                        </Button>
                        <p className="text-sm text-gray-500">JPG, PNG or GIF. Max size 5MB.</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={profile.name}
                          onChange={(e) => {
                            setProfile((prev) => ({ ...prev, name: e.target.value }))
                            setHasUnsavedChanges(true)
                          }}
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          value={profile.email}
                          onChange={(e) => {
                            setProfile((prev) => ({ ...prev, email: e.target.value }))
                            setHasUnsavedChanges(true)
                          }}
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          value={profile.phone}
                          onChange={(e) => {
                            setProfile((prev) => ({ ...prev, phone: e.target.value }))
                            setHasUnsavedChanges(true)
                          }}
                        />
                      </div>
                      <div>
                        <Label htmlFor="institution">Institution</Label>
                        <Input
                          id="institution"
                          value={profile.institution}
                          onChange={(e) => {
                            setProfile((prev) => ({ ...prev, institution: e.target.value }))
                            setHasUnsavedChanges(true)
                          }}
                        />
                      </div>
                      <div>
                        <Label htmlFor="major">Major/Field of Study</Label>
                        <Input
                          id="major"
                          value={profile.major}
                          onChange={(e) => {
                            setProfile((prev) => ({ ...prev, major: e.target.value }))
                            setHasUnsavedChanges(true)
                          }}
                        />
                      </div>
                      <div>
                        <Label htmlFor="graduation">Graduation Year</Label>
                        <Input
                          id="graduation"
                          value={profile.graduationYear}
                          onChange={(e) => {
                            setProfile((prev) => ({ ...prev, graduationYear: e.target.value }))
                            setHasUnsavedChanges(true)
                          }}
                        />
                      </div>
                      <div>
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          value={profile.location}
                          onChange={(e) => {
                            setProfile((prev) => ({ ...prev, location: e.target.value }))
                            setHasUnsavedChanges(true)
                          }}
                        />
                      </div>
                      <div>
                        <Label htmlFor="timezone">Timezone</Label>
                        <Select
                          value={profile.timezone}
                          onValueChange={(value) => {
                            setProfile((prev) => ({ ...prev, timezone: value }))
                            setHasUnsavedChanges(true)
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {timezones.map((tz) => (
                              <SelectItem key={tz} value={tz}>
                                {tz}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={profile.bio}
                        onChange={(e) => {
                          setProfile((prev) => ({ ...prev, bio: e.target.value }))
                          setHasUnsavedChanges(true)
                        }}
                        placeholder="Tell us about yourself..."
                        className="min-h-[100px]"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lock className="w-5 h-5" />
                      Account Security
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Password</h4>
                        <p className="text-sm text-gray-500">Last changed 3 months ago</p>
                      </div>
                      <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
                        <DialogTrigger asChild>
                          <Button variant="outline">Change Password</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Change Password</DialogTitle>
                            <DialogDescription>Enter your current password and choose a new one.</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="current-password">Current Password</Label>
                              <div className="relative">
                                <Input
                                  id="current-password"
                                  type={showPassword ? "text" : "password"}
                                  placeholder="Enter current password"
                                />
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="absolute right-2 top-1/2 -translate-y-1/2"
                                  onClick={() => setShowPassword(!showPassword)}
                                >
                                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </Button>
                              </div>
                            </div>
                            <div>
                              <Label htmlFor="new-password">New Password</Label>
                              <Input id="new-password" type="password" placeholder="Enter new password" />
                            </div>
                            <div>
                              <Label htmlFor="confirm-password">Confirm New Password</Label>
                              <Input id="confirm-password" type="password" placeholder="Confirm new password" />
                            </div>
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setIsPasswordDialogOpen(false)}>
                              Cancel
                            </Button>
                            <Button>Update Password</Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Two-Factor Authentication</h4>
                        <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                      </div>
                      <Switch
                        checked={privacy.twoFactorAuth}
                        onCheckedChange={(checked) => {
                          setPrivacy((prev) => ({ ...prev, twoFactorAuth: checked }))
                          setHasUnsavedChanges(true)
                        }}
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Session Timeout</h4>
                        <p className="text-sm text-gray-500">Automatically log out after inactivity</p>
                      </div>
                      <Select
                        value={privacy.sessionTimeout.toString()}
                        onValueChange={(value) => {
                          setPrivacy((prev) => ({ ...prev, sessionTimeout: Number.parseInt(value) }))
                          setHasUnsavedChanges(true)
                        }}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15 minutes</SelectItem>
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="60">1 hour</SelectItem>
                          <SelectItem value="240">4 hours</SelectItem>
                          <SelectItem value="0">Never</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Appearance Settings */}
            {activeTab === "appearance" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Palette className="w-5 h-5" />
                      Theme & Display
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <Label className="text-base font-medium">Theme</Label>
                      <p className="text-sm text-gray-500 mb-3">Choose your preferred color scheme</p>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { value: "light", label: "Light", icon: Sun },
                          { value: "dark", label: "Dark", icon: Moon },
                          { value: "system", label: "System", icon: Monitor },
                        ].map((theme) => (
                          <button
                            key={theme.value}
                            onClick={() => {
                              setAppearance((prev) => ({ ...prev, theme: theme.value as any }))
                              setHasUnsavedChanges(true)
                            }}
                            className={`p-4 border rounded-lg flex flex-col items-center gap-2 transition-colors ${appearance.theme === theme.value
                              ? "border-blue-500 bg-blue-50 text-blue-700"
                              : "border-gray-200 hover:border-gray-300"
                              }`}
                          >
                            <theme.icon className="w-6 h-6" />
                            <span className="text-sm font-medium">{theme.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <Label className="text-base font-medium">Accent Color</Label>
                      <p className="text-sm text-gray-500 mb-3">Customize the primary color used throughout the app</p>
                      <div className="grid grid-cols-4 gap-3">
                        {accentColors.map((color) => (
                          <button
                            key={color.value}
                            onClick={() => {
                              setAppearance((prev) => ({ ...prev, accentColor: color.value }))
                              setHasUnsavedChanges(true)
                            }}
                            className={`p-3 border rounded-lg flex flex-col items-center gap-2 transition-colors ${appearance.accentColor === color.value
                              ? "border-gray-800 ring-2 ring-gray-300"
                              : "border-gray-200 hover:border-gray-300"
                              }`}
                          >
                            <div className="w-8 h-8 rounded-full" style={{ backgroundColor: color.value }} />
                            <span className="text-xs font-medium">{color.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label className="text-base font-medium">Font Size</Label>
                        <p className="text-sm text-gray-500 mb-3">Adjust text size for better readability</p>
                        <Select
                          value={appearance.fontSize}
                          onValueChange={(value) => {
                            setAppearance((prev) => ({ ...prev, fontSize: value as any }))
                            setHasUnsavedChanges(true)
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="small">Small</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="large">Large</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-sm font-medium">Compact Mode</Label>
                            <p className="text-xs text-gray-500">Reduce spacing for more content</p>
                          </div>
                          <Switch
                            checked={appearance.compactMode}
                            onCheckedChange={(checked) => {
                              setAppearance((prev) => ({ ...prev, compactMode: checked }))
                              setHasUnsavedChanges(true)
                            }}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-sm font-medium">Animations</Label>
                            <p className="text-xs text-gray-500">Enable smooth transitions</p>
                          </div>
                          <Switch
                            checked={appearance.animations}
                            onCheckedChange={(checked) => {
                              setAppearance((prev) => ({ ...prev, animations: checked }))
                              setHasUnsavedChanges(true)
                            }}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-sm font-medium">Show Avatars</Label>
                            <p className="text-xs text-gray-500">Display profile pictures</p>
                          </div>
                          <Switch
                            checked={appearance.showAvatars}
                            onCheckedChange={(checked) => {
                              setAppearance((prev) => ({ ...prev, showAvatars: checked }))
                              setHasUnsavedChanges(true)
                            }}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-sm font-medium">Color Blind Mode</Label>
                            <p className="text-xs text-gray-500">Enhanced color accessibility</p>
                          </div>
                          <Switch
                            checked={appearance.colorBlindMode}
                            onCheckedChange={(checked) => {
                              setAppearance((prev) => ({ ...prev, colorBlindMode: checked }))
                              setHasUnsavedChanges(true)
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Notifications Settings */}
            {activeTab === "notifications" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="w-5 h-5" />
                      Notification Preferences
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <Label className="text-base font-medium">Delivery Methods</Label>
                      <p className="text-sm text-gray-500 mb-4">Choose how you want to receive notifications</p>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Mail className="w-5 h-5 text-gray-600" />
                            <div>
                              <Label className="text-sm font-medium">Email Notifications</Label>
                              <p className="text-xs text-gray-500">Receive notifications via email</p>
                            </div>
                          </div>
                          <Switch
                            checked={notifications.emailNotifications}
                            onCheckedChange={(checked) => {
                              setNotifications((prev) => ({ ...prev, emailNotifications: checked }))
                              setHasUnsavedChanges(true)
                            }}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Smartphone className="w-5 h-5 text-gray-600" />
                            <div>
                              <Label className="text-sm font-medium">Push Notifications</Label>
                              <p className="text-xs text-gray-500">Mobile app notifications</p>
                            </div>
                          </div>
                          <Switch
                            checked={notifications.pushNotifications}
                            onCheckedChange={(checked) => {
                              setNotifications((prev) => ({ ...prev, pushNotifications: checked }))
                              setHasUnsavedChanges(true)
                            }}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Laptop className="w-5 h-5 text-gray-600" />
                            <div>
                              <Label className="text-sm font-medium">Desktop Notifications</Label>
                              <p className="text-xs text-gray-500">Browser notifications on desktop</p>
                            </div>
                          </div>
                          <Switch
                            checked={notifications.desktopNotifications}
                            onCheckedChange={(checked) => {
                              setNotifications((prev) => ({ ...prev, desktopNotifications: checked }))
                              setHasUnsavedChanges(true)
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <Label className="text-base font-medium">Notification Types</Label>
                      <p className="text-sm text-gray-500 mb-4">Control what notifications you receive</p>
                      <div className="space-y-4">
                        {[
                          {
                            key: "studyReminders",
                            label: "Study Reminders",
                            description: "Reminders for scheduled study sessions",
                          },
                          {
                            key: "deadlineAlerts",
                            label: "Deadline Alerts",
                            description: "Alerts for upcoming assignment deadlines",
                          },
                          {
                            key: "collaborationUpdates",
                            label: "Collaboration Updates",
                            description: "Updates on shared documents and projects",
                          },
                          {
                            key: "weeklyDigest",
                            label: "Weekly Digest",
                            description: "Summary of your weekly study progress",
                          },
                          {
                            key: "marketingEmails",
                            label: "Marketing Emails",
                            description: "Product updates and promotional content",
                          },
                        ].map((item) => (
                          <div key={item.key} className="flex items-center justify-between">
                            <div>
                              <Label className="text-sm font-medium">{item.label}</Label>
                              <p className="text-xs text-gray-500">{item.description}</p>
                            </div>
                            <Switch
                              checked={notifications[item.key as keyof NotificationSettings] as boolean}
                              onCheckedChange={(checked) => {
                                setNotifications((prev) => ({ ...prev, [item.key]: checked }))
                                setHasUnsavedChanges(true)
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <Label className="text-base font-medium">Sound & Vibration</Label>
                      <p className="text-sm text-gray-500 mb-4">Customize notification sounds and vibration</p>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Volume2 className="w-5 h-5 text-gray-600" />
                            <div>
                              <Label className="text-sm font-medium">Sound Enabled</Label>
                              <p className="text-xs text-gray-500">Play sound for notifications</p>
                            </div>
                          </div>
                          <Switch
                            checked={notifications.soundEnabled}
                            onCheckedChange={(checked) => {
                              setNotifications((prev) => ({ ...prev, soundEnabled: checked }))
                              setHasUnsavedChanges(true)
                            }}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Smartphone className="w-5 h-5 text-gray-600" />
                            <div>
                              <Label className="text-sm font-medium">Vibration</Label>
                              <p className="text-xs text-gray-500">Vibrate for mobile notifications</p>
                            </div>
                          </div>
                          <Switch
                            checked={notifications.vibrationEnabled}
                            onCheckedChange={(checked) => {
                              setNotifications((prev) => ({ ...prev, vibrationEnabled: checked }))
                              setHasUnsavedChanges(true)
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <Label className="text-base font-medium">Quiet Hours</Label>
                          <p className="text-sm text-gray-500">Disable notifications during specific hours</p>
                        </div>
                        <Switch
                          checked={notifications.quietHours.enabled}
                          onCheckedChange={(checked) => {
                            setNotifications((prev) => ({
                              ...prev,
                              quietHours: { ...prev.quietHours, enabled: checked },
                            }))
                            setHasUnsavedChanges(true)
                          }}
                        />
                      </div>

                      {notifications.quietHours.enabled && (
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="quiet-start">Start Time</Label>
                            <Input
                              id="quiet-start"
                              type="time"
                              value={notifications.quietHours.start}
                              onChange={(e) => {
                                setNotifications((prev) => ({
                                  ...prev,
                                  quietHours: { ...prev.quietHours, start: e.target.value },
                                }))
                                setHasUnsavedChanges(true)
                              }}
                            />
                          </div>
                          <div>
                            <Label htmlFor="quiet-end">End Time</Label>
                            <Input
                              id="quiet-end"
                              type="time"
                              value={notifications.quietHours.end}
                              onChange={(e) => {
                                setNotifications((prev) => ({
                                  ...prev,
                                  quietHours: { ...prev.quietHours, end: e.target.value },
                                }))
                                setHasUnsavedChanges(true)
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Privacy & Security Settings */}
            {activeTab === "privacy" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      Privacy Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <Label className="text-base font-medium">Profile Visibility</Label>
                      <p className="text-sm text-gray-500 mb-3">Control who can see your profile information</p>
                      <Select
                        value={privacy.profileVisibility}
                        onValueChange={(value) => {
                          setPrivacy((prev) => ({ ...prev, profileVisibility: value as any }))
                          setHasUnsavedChanges(true)
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="public">Public - Anyone can see</SelectItem>
                          <SelectItem value="friends">Friends - Only connections</SelectItem>
                          <SelectItem value="private">Private - Only you</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-sm font-medium">Show Online Status</Label>
                          <p className="text-xs text-gray-500">Let others see when you're active</p>
                        </div>
                        <Switch
                          checked={privacy.showOnlineStatus}
                          onCheckedChange={(checked) => {
                            setPrivacy((prev) => ({ ...prev, showOnlineStatus: checked }))
                            setHasUnsavedChanges(true)
                          }}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-sm font-medium">Allow Direct Messages</Label>
                          <p className="text-xs text-gray-500">Receive messages from other users</p>
                        </div>
                        <Switch
                          checked={privacy.allowDirectMessages}
                          onCheckedChange={(checked) => {
                            setPrivacy((prev) => ({ ...prev, allowDirectMessages: checked }))
                            setHasUnsavedChanges(true)
                          }}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-sm font-medium">Share Study Statistics</Label>
                          <p className="text-xs text-gray-500">Include your stats in leaderboards</p>
                        </div>
                        <Switch
                          checked={privacy.shareStudyStats}
                          onCheckedChange={(checked) => {
                            setPrivacy((prev) => ({ ...prev, shareStudyStats: checked }))
                            setHasUnsavedChanges(true)
                          }}
                        />
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <Label className="text-base font-medium">Data Collection</Label>
                      <p className="text-sm text-gray-500 mb-4">Control how your data is used to improve the service</p>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-sm font-medium">Usage Analytics</Label>
                            <p className="text-xs text-gray-500">Help improve the app with anonymous usage data</p>
                          </div>
                          <Switch
                            checked={privacy.analyticsOptIn}
                            onCheckedChange={(checked) => {
                              setPrivacy((prev) => ({ ...prev, analyticsOptIn: checked }))
                              setHasUnsavedChanges(true)
                            }}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-sm font-medium">Data Collection</Label>
                            <p className="text-xs text-gray-500">
                              Allow collection of study patterns for personalization
                            </p>
                          </div>
                          <Switch
                            checked={privacy.dataCollection}
                            onCheckedChange={(checked) => {
                              setPrivacy((prev) => ({ ...prev, dataCollection: checked }))
                              setHasUnsavedChanges(true)
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Data Management</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Export Your Data</h4>
                        <p className="text-sm text-gray-500">Download a copy of all your data</p>
                      </div>
                      <Button variant="outline" onClick={handleExportData}>
                        <Download className="w-4 h-4 mr-2" />
                        Export
                      </Button>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-red-600">Log out</h4>
                        <p className="text-sm text-gray-500">Log out of your current account</p>
                      </div>



                      <AlertDialog>
                        <AlertDialogTrigger asChild>

                          <SignOutButton>
                            <button>Custom sign out button</button>
                          </SignOutButton>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction className="bg-red-600 hover:bg-red-700">
                              Yes, log out of my account
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>


                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-red-600">Delete Account</h4>
                        <p className="text-sm text-gray-500">Permanently delete your account and all data</p>
                      </div>



                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Account
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete your account and remove all
                              your data from our servers.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction className="bg-red-600 hover:bg-red-700">
                              Yes, delete my account
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* AI Assistant Settings */}
            {activeTab === "ai" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="w-5 h-5" />
                      AI Assistant Configuration
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base font-medium">Enable AI Assistant</Label>
                        <p className="text-sm text-gray-500">Turn on AI-powered features and suggestions</p>
                      </div>
                      <Switch
                        checked={aiSettings.aiAssistantEnabled}
                        onCheckedChange={(checked) => {
                          setAISettings((prev) => ({ ...prev, aiAssistantEnabled: checked }))
                          setHasUnsavedChanges(true)
                        }}
                      />
                    </div>

                    {aiSettings.aiAssistantEnabled && (
                      <>
                        <Separator />

                        <div>
                          <Label className="text-base font-medium">Response Settings</Label>
                          <p className="text-sm text-gray-500 mb-4">Customize how the AI responds to you</p>
                          <div className="space-y-4">
                            <div>
                              <Label className="text-sm font-medium">Creativity Level</Label>
                              <p className="text-xs text-gray-500 mb-2">
                                Higher values make responses more creative and varied
                              </p>
                              <Slider
                                value={[aiSettings.creativityLevel]}
                                onValueChange={([value]) => {
                                  setAISettings((prev) => ({ ...prev, creativityLevel: value }))
                                  setHasUnsavedChanges(true)
                                }}
                                max={1}
                                min={0}
                                step={0.1}
                                className="w-full"
                              />
                              <div className="flex justify-between text-xs text-gray-500 mt-1">
                                <span>Conservative</span>
                                <span>Balanced</span>
                                <span>Creative</span>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="response-length">Response Length</Label>
                                <Select
                                  value={aiSettings.responseLength}
                                  onValueChange={(value) => {
                                    setAISettings((prev) => ({ ...prev, responseLength: value as any }))
                                    setHasUnsavedChanges(true)
                                  }}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="short">Short & Concise</SelectItem>
                                    <SelectItem value="medium">Medium Detail</SelectItem>
                                    <SelectItem value="long">Detailed & Comprehensive</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              <div>
                                <Label htmlFor="ai-language">Preferred Language</Label>
                                <Select
                                  value={aiSettings.preferredLanguage}
                                  onValueChange={(value) => {
                                    setAISettings((prev) => ({ ...prev, preferredLanguage: value }))
                                    setHasUnsavedChanges(true)
                                  }}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {languages.map((lang) => (
                                      <SelectItem key={lang.code} value={lang.code}>
                                        {lang.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </div>
                        </div>

                        <Separator />

                        <div>
                          <Label className="text-base font-medium">AI Features</Label>
                          <p className="text-sm text-gray-500 mb-4">Enable or disable specific AI capabilities</p>
                          <div className="space-y-4">
                            {[
                              {
                                key: "autoSuggestions",
                                label: "Auto Suggestions",
                                description: "Get smart suggestions while typing",
                              },
                              {
                                key: "smartNotifications",
                                label: "Smart Notifications",
                                description: "AI-powered notification timing",
                              },
                              {
                                key: "learningAnalytics",
                                label: "Learning Analytics",
                                description: "Analyze your study patterns and progress",
                              },
                              {
                                key: "personalizedContent",
                                label: "Personalized Content",
                                description: "Customize content based on your preferences",
                              },
                              {
                                key: "voiceInteraction",
                                label: "Voice Interaction",
                                description: "Interact with AI using voice commands",
                              },
                              {
                                key: "contextAwareness",
                                label: "Context Awareness",
                                description: "AI remembers conversation context",
                              },
                            ].map((feature) => (
                              <div key={feature.key} className="flex items-center justify-between">
                                <div>
                                  <Label className="text-sm font-medium">{feature.label}</Label>
                                  <p className="text-xs text-gray-500">{feature.description}</p>
                                </div>
                                <Switch
                                  checked={aiSettings[feature.key as keyof AISettings] as boolean}
                                  onCheckedChange={(checked) => {
                                    setAISettings((prev) => ({ ...prev, [feature.key]: checked }))
                                    setHasUnsavedChanges(true)
                                  }}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Study Preferences */}
            {activeTab === "study" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5" />
                      Study Session Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <Label className="text-base font-medium">Pomodoro Timer</Label>
                      <p className="text-sm text-gray-500 mb-4">Configure your study and break intervals</p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="study-duration">Study Duration (minutes)</Label>
                          <Input
                            id="study-duration"
                            type="number"
                            value={studySettings.defaultStudyDuration}
                            onChange={(e) => {
                              setStudySettings((prev) => ({
                                ...prev,
                                defaultStudyDuration: Number.parseInt(e.target.value),
                              }))
                              setHasUnsavedChanges(true)
                            }}
                            min="5"
                            max="120"
                          />
                        </div>
                        <div>
                          <Label htmlFor="break-duration">Break Duration (minutes)</Label>
                          <Input
                            id="break-duration"
                            type="number"
                            value={studySettings.breakDuration}
                            onChange={(e) => {
                              setStudySettings((prev) => ({ ...prev, breakDuration: Number.parseInt(e.target.value) }))
                              setHasUnsavedChanges(true)
                            }}
                            min="1"
                            max="30"
                          />
                        </div>
                        <div>
                          <Label htmlFor="long-break">Long Break Interval</Label>
                          <Input
                            id="long-break"
                            type="number"
                            value={studySettings.longBreakInterval}
                            onChange={(e) => {
                              setStudySettings((prev) => ({
                                ...prev,
                                longBreakInterval: Number.parseInt(e.target.value),
                              }))
                              setHasUnsavedChanges(true)
                            }}
                            min="2"
                            max="10"
                          />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <Label className="text-base font-medium">Study Environment</Label>
                      <p className="text-sm text-gray-500 mb-4">Customize your study environment preferences</p>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-sm font-medium">Focus Mode</Label>
                            <p className="text-xs text-gray-500">Block distracting websites during study sessions</p>
                          </div>
                          <Switch
                            checked={studySettings.focusMode}
                            onCheckedChange={(checked) => {
                              setStudySettings((prev) => ({ ...prev, focusMode: checked }))
                              setHasUnsavedChanges(true)
                            }}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-sm font-medium">Background Sounds</Label>
                            <p className="text-xs text-gray-500">Play ambient sounds during study sessions</p>
                          </div>
                          <Switch
                            checked={studySettings.backgroundSounds}
                            onCheckedChange={(checked) => {
                              setStudySettings((prev) => ({ ...prev, backgroundSounds: checked }))
                              setHasUnsavedChanges(true)
                            }}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-sm font-medium">Pomodoro Timer</Label>
                            <p className="text-xs text-gray-500">Enable automatic study/break cycles</p>
                          </div>
                          <Switch
                            checked={studySettings.pomodoroEnabled}
                            onCheckedChange={(checked) => {
                              setStudySettings((prev) => ({ ...prev, pomodoroEnabled: checked }))
                              setHasUnsavedChanges(true)
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <Label className="text-base font-medium">Learning Features</Label>
                      <p className="text-sm text-gray-500 mb-4">Advanced features to enhance your learning</p>
                      <div className="space-y-4">
                        {[
                          {
                            key: "goalTracking",
                            label: "Goal Tracking",
                            description: "Track and visualize your study goals",
                          },
                          {
                            key: "progressSharing",
                            label: "Progress Sharing",
                            description: "Share achievements with friends",
                          },
                          {
                            key: "studyStreaks",
                            label: "Study Streaks",
                            description: "Maintain daily study streaks",
                          },
                          {
                            key: "difficultyAdaptation",
                            label: "Difficulty Adaptation",
                            description: "Automatically adjust content difficulty",
                          },
                          {
                            key: "spacedRepetition",
                            label: "Spaced Repetition",
                            description: "Optimize review timing for better retention",
                          },
                        ].map((feature) => (
                          <div key={feature.key} className="flex items-center justify-between">
                            <div>
                              <Label className="text-sm font-medium">{feature.label}</Label>
                              <p className="text-xs text-gray-500">{feature.description}</p>
                            </div>
                            <Switch
                              checked={studySettings[feature.key as keyof StudySettings] as boolean}
                              onCheckedChange={(checked) => {
                                setStudySettings((prev) => ({ ...prev, [feature.key]: checked }))
                                setHasUnsavedChanges(true)
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Data & Storage */}
            {activeTab === "data" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="w-5 h-5" />
                      Storage Usage
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Storage Used</span>
                        <span className="text-sm text-gray-600">
                          {storageUsed} GB of {storageLimit} GB
                        </span>
                      </div>
                      <Progress value={(storageUsed / storageLimit) * 100} className="h-2" />
                      <p className="text-xs text-gray-500 mt-2">
                        {(storageLimit - storageUsed).toFixed(1)} GB remaining
                      </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <FileText className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                        <p className="text-sm font-medium">Documents</p>
                        <p className="text-xs text-gray-600">3.2 GB</p>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <Camera className="w-8 h-8 text-green-600 mx-auto mb-2" />
                        <p className="text-sm font-medium">Images</p>
                        <p className="text-xs text-gray-600">2.1 GB</p>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <Volume2 className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                        <p className="text-sm font-medium">Audio</p>
                        <p className="text-xs text-gray-600">1.8 GB</p>
                      </div>
                      <div className="text-center p-4 bg-orange-50 rounded-lg">
                        <Database className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                        <p className="text-sm font-medium">Other</p>
                        <p className="text-xs text-gray-600">1.1 GB</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">Upgrade Storage</h4>
                        <p className="text-sm text-gray-500">Get more space for your study materials</p>
                      </div>
                      <Button>Upgrade Plan</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Data Management</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Backup Data</h4>
                        <p className="text-sm text-gray-500">Create a backup of all your data</p>
                      </div>
                      <Button variant="outline">
                        <Upload className="w-4 h-4 mr-2" />
                        Create Backup
                      </Button>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Import Data</h4>
                        <p className="text-sm text-gray-500">Import data from other study apps</p>
                      </div>
                      <Button variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Import
                      </Button>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Clear Cache</h4>
                        <p className="text-sm text-gray-500">Free up space by clearing temporary files</p>
                      </div>
                      <Button variant="outline">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Clear Cache
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Integrations */}
            {activeTab === "integrations" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Plug className="w-5 h-5" />
                      Connected Services
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        {
                          name: "Google Drive",
                          description: "Sync documents and files",
                          connected: true,
                          icon: "🔗",
                        },
                        {
                          name: "Notion",
                          description: "Import notes and databases",
                          connected: false,
                          icon: "📝",
                        },
                        {
                          name: "Spotify",
                          description: "Background music for studying",
                          connected: true,
                          icon: "🎵",
                        },
                        {
                          name: "Zoom",
                          description: "Schedule study sessions",
                          connected: false,
                          icon: "📹",
                        },
                        {
                          name: "Canvas LMS",
                          description: "Import assignments and grades",
                          connected: true,
                          icon: "🎓",
                        },
                        {
                          name: "Slack",
                          description: "Study group notifications",
                          connected: false,
                          icon: "💬",
                        },
                      ].map((service) => (
                        <Card key={service.name} className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{service.icon}</span>
                              <div>
                                <h4 className="font-medium">{service.name}</h4>
                                <p className="text-sm text-gray-500">{service.description}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {service.connected ? (
                                <>
                                  <Badge variant="secondary" className="text-xs">
                                    <Check className="w-3 h-3 mr-1" />
                                    Connected
                                  </Badge>
                                  <Button variant="outline" size="sm">
                                    Disconnect
                                  </Button>
                                </>
                              ) : (
                                <Button size="sm">Connect</Button>
                              )}
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>API Access</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Developer API</h4>
                        <p className="text-sm text-gray-500">Access your data programmatically</p>
                      </div>
                      <Button variant="outline">Generate API Key</Button>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Webhooks</h4>
                        <p className="text-sm text-gray-500">Receive real-time notifications</p>
                      </div>
                      <Button variant="outline">Configure</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Accessibility */}
            {activeTab === "accessibility" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Accessibility className="w-5 h-5" />
                      Accessibility Options
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <Label className="text-base font-medium">Visual Accessibility</Label>
                      <p className="text-sm text-gray-500 mb-4">Customize visual elements for better accessibility</p>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-sm font-medium">High Contrast Mode</Label>
                            <p className="text-xs text-gray-500">Increase contrast for better visibility</p>
                          </div>
                          <Switch />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-sm font-medium">Large Text</Label>
                            <p className="text-xs text-gray-500">Increase text size throughout the app</p>
                          </div>
                          <Switch />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-sm font-medium">Reduce Motion</Label>
                            <p className="text-xs text-gray-500">Minimize animations and transitions</p>
                          </div>
                          <Switch />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-sm font-medium">Focus Indicators</Label>
                            <p className="text-xs text-gray-500">Enhanced keyboard navigation indicators</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <Label className="text-base font-medium">Audio Accessibility</Label>
                      <p className="text-sm text-gray-500 mb-4">Configure audio and sound settings</p>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-sm font-medium">Screen Reader Support</Label>
                            <p className="text-xs text-gray-500">Optimize for screen reader compatibility</p>
                          </div>
                          <Switch defaultChecked />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-sm font-medium">Audio Descriptions</Label>
                            <p className="text-xs text-gray-500">Provide audio descriptions for visual content</p>
                          </div>
                          <Switch />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-sm font-medium">Sound Alerts</Label>
                            <p className="text-xs text-gray-500">Use sound cues for important notifications</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <Label className="text-base font-medium">Motor Accessibility</Label>
                      <p className="text-sm text-gray-500 mb-4">Customize interaction methods</p>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-sm font-medium">Sticky Keys</Label>
                            <p className="text-xs text-gray-500">Enable modifier key combinations</p>
                          </div>
                          <Switch />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-sm font-medium">Click Delay</Label>
                            <p className="text-xs text-gray-500">Add delay to prevent accidental clicks</p>
                          </div>
                          <Switch />
                        </div>

                        <div>
                          <Label className="text-sm font-medium">Mouse Sensitivity</Label>
                          <p className="text-xs text-gray-500 mb-2">Adjust mouse movement sensitivity</p>
                          <Slider defaultValue={[50]} max={100} min={10} step={10} className="w-full" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Advanced Settings */}
            {activeTab === "advanced" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="w-5 h-5" />
                      Advanced Configuration
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <Label className="text-base font-medium">Performance</Label>
                      <p className="text-sm text-gray-500 mb-4">Optimize app performance for your device</p>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-sm font-medium">Hardware Acceleration</Label>
                            <p className="text-xs text-gray-500">Use GPU for better performance</p>
                          </div>
                          <Switch defaultChecked />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-sm font-medium">Preload Content</Label>
                            <p className="text-xs text-gray-500">Load content in advance for faster access</p>
                          </div>
                          <Switch defaultChecked />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-sm font-medium">Background Sync</Label>
                            <p className="text-xs text-gray-500">Sync data when app is in background</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <Label className="text-base font-medium">Developer Options</Label>
                      <p className="text-sm text-gray-500 mb-4">Advanced options for developers and power users</p>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-sm font-medium">Debug Mode</Label>
                            <p className="text-xs text-gray-500">Enable detailed logging and debug information</p>
                          </div>
                          <Switch />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-sm font-medium">Beta Features</Label>
                            <p className="text-xs text-gray-500">Access experimental features</p>
                          </div>
                          <Switch />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-sm font-medium">Console Access</Label>
                            <p className="text-xs text-gray-500">Enable browser console for debugging</p>
                          </div>
                          <Switch />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <Label className="text-base font-medium">Reset Options</Label>
                      <p className="text-sm text-gray-500 mb-4">Reset various aspects of the application</p>
                      <div className="space-y-3">
                        <Button variant="outline" className="w-full justify-start">
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Reset All Settings
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Clear All Data
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <Download className="w-4 h-4 mr-2" />
                          Factory Reset
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>System Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <Label className="font-medium">App Version</Label>
                        <p className="text-gray-600">v2.1.4</p>
                      </div>
                      <div>
                        <Label className="font-medium">Last Updated</Label>
                        <p className="text-gray-600">January 15, 2024</p>
                      </div>
                      <div>
                        <Label className="font-medium">Platform</Label>
                        <p className="text-gray-600">Web Application</p>
                      </div>
                      <div>
                        <Label className="font-medium">Browser</Label>
                        <p className="text-gray-600">Chrome 120.0.0</p>
                      </div>
                      <div>
                        <Label className="font-medium">User ID</Label>
                        <p className="text-gray-600 font-mono">usr_1234567890</p>
                      </div>
                      <div>
                        <Label className="font-medium">Server Region</Label>
                        <p className="text-gray-600">US West (Oregon)</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>

        {/* Help Section */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <HelpCircle className="w-6 h-6 text-blue-600" />
                <div>
                  <h3 className="font-medium">Need Help?</h3>
                  <p className="text-sm text-gray-500">Check our documentation or contact support for assistance</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline">Documentation</Button>
                <Button variant="outline">Contact Support</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
