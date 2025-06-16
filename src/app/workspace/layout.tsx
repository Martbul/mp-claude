import { Separator } from "@radix-ui/react-separator"
import {
  BookOpen,
  Calendar,
  FileText,
  Brain,
  Home,
  Settings,
  Search,
  Plus,
  Bell,
} from "lucide-react"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "~/components/ui/breadcrumb"
import { Button } from "~/components/ui/button"

import { Label } from "~/components/ui/label"
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarInput, SidebarInset, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarRail, SidebarTrigger } from "~/components/ui/sidebar"


const navigationItems = [
  {
    title: "Dashboard",
    url: "/workspace",
    icon: Home,
    isActive: true,
  },
  {
    title: "Documents",
    url: "workspace/documents",
    icon: FileText,
  },
  {
    title: "Notes",
    url: "workspace/notes",
    icon: BookOpen,
  },
  {
    title: "AI Assistant",
    url: "/workspace/ai",
    icon: Brain,
  },
  {
    title: "Calendar",
    url: "/workspace/calendar",
    icon: Calendar,
  },
  {
    title: "Settings",
    url: "/workspace/settings",
    icon: Settings,
  },
]

export default function WorkspaceLayout(props: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <BookOpen className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">StudyHub</span>
                  <span className="text-xs">Your Study Companion</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          <form>
            <SidebarGroup className="py-0">
              <SidebarGroupContent className="relative">
                <Label htmlFor="search" className="sr-only">
                  Search
                </Label>
                <SidebarInput id="search" placeholder="Search documents, notes..." className="pl-8" />
                <Search className="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 select-none opacity-50" />
              </SidebarGroupContent>
            </SidebarGroup>
          </form>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navigationItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={item.isActive}>
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>Quick Actions</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href="#">
                      <Plus />
                      <span>Upload Document</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href="#">
                      <FileText />
                      <span>Create Note</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href="#">
                      <Brain />
                      <span>AI Simplify</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Dashboard</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="outline" size="icon">
              <Bell className="h-4 w-4" />
            </Button>
          </div>
        </header>



        <main className="text-center">{props.children}</main>
      </SidebarInset>
    </SidebarProvider >
  )
}
