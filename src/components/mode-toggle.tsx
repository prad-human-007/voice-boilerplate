"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"


export function ModeToggle() {
  const { theme, setTheme } = useTheme()

  function themeFlip() {
    if(theme !== "light") setTheme("light")
    else setTheme("dark")
  }
  
  return (
    <Button variant="outline" size="icon" onClick={themeFlip}>
      <Sun className=" rotate-0 scale-100  transition-transform duration-500 dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute  rotate-90 scale-0 transition-transform duration-500 dark:rotate-0 dark:scale-100" />
    </Button>
  )
}
