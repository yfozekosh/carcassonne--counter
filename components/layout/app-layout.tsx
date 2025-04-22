"use client"
import { useState, useEffect } from "react"
import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, X, Home, GamepadIcon as GameController, Info, ChevronRight, ChevronLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import packageInfo from "@/package.json"
import { BUILD_TIMESTAMP } from "@/config/build-info"

interface AppLayoutProps {
  children: React.ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname()
  const [isMounted, setIsMounted] = useState(false)
  const [isOpen, setIsOpen] = useState(true)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  // Hydration fix
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileOpen(false)
  }, [pathname])

  if (!isMounted) {
    return <div className="min-h-screen">{children}</div>
  }

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar */}
      <div
        className={cn("hidden md:block border-r bg-background transition-all duration-300", isOpen ? "w-64" : "w-16")}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-14 items-center px-4 border-b">
            {isOpen ? (
              <div className="flex items-center justify-between w-full">
                <span className="font-semibold">Carcassonne Calculator</span>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>
          <ScrollArea className="flex-1">
            <nav className="flex flex-col gap-2 p-2">
              <NavItem href="/games" icon={<Home />} label="Games" isOpen={isOpen} isActive={pathname === "/games"} />
              <NavItem
                href="/current-game"
                icon={<GameController />}
                label="Current Game"
                isOpen={isOpen}
                isActive={pathname === "/current-game"}
              />
              <NavItem href="/about" icon={<Info />} label="About" isOpen={isOpen} isActive={pathname === "/about"} />
            </nav>
          </ScrollArea>
          {isOpen && (
            <div className="p-4 border-t text-xs text-gray-500">
              <div>Version: {packageInfo.version}</div>
              <div className="truncate">Built: {BUILD_TIMESTAMP}</div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile sidebar (Sheet) */}
      <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden absolute top-4 left-4 z-10">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex h-full flex-col">
            <div className="flex h-14 items-center px-4 border-b">
              <span className="font-semibold">Carcassonne Calculator</span>
              <Button variant="ghost" size="icon" className="ml-auto" onClick={() => setIsMobileOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <ScrollArea className="flex-1">
              <nav className="flex flex-col gap-2 p-2">
                <NavItem href="/games" icon={<Home />} label="Games" isOpen={true} isActive={pathname === "/games"} />
                <NavItem
                  href="/current-game"
                  icon={<GameController />}
                  label="Current Game"
                  isOpen={true}
                  isActive={pathname === "/current-game"}
                />
                <NavItem href="/about" icon={<Info />} label="About" isOpen={true} isActive={pathname === "/about"} />
              </nav>
            </ScrollArea>
            <div className="p-4 border-t text-xs text-gray-500">
              <div>Version: {packageInfo.version}</div>
              <div className="truncate">Built: {BUILD_TIMESTAMP}</div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <main className="pt-14 md:pt-0">{children}</main>
      </div>
    </div>
  )
}

interface NavItemProps {
  href: string
  icon: React.ReactNode
  label: string
  isOpen: boolean
  isActive: boolean
}

function NavItem({ href, icon, label, isOpen, isActive }: NavItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
        isActive ? "bg-accent text-accent-foreground" : "hover:bg-accent hover:text-accent-foreground",
        !isOpen && "justify-center",
      )}
    >
      {icon}
      {isOpen && <span>{label}</span>}
    </Link>
  )
}
