"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"


export function VisaTypeSelector({ type, setVisaType }: { type:string, setVisaType: (visaType: string) => void }) { 
  const [position, setPosition] = React.useState("F1 Visa")

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className='border  shadow-xl border-teal-500 rounded-xl' variant="outline">{type} <ChevronDown /> </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 rounded-2xl">
        <DropdownMenuLabel>Visa Type</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
          <DropdownMenuRadioItem onClick={() => {setVisaType('F1 Visa')}} value="F1 Visa">F1</DropdownMenuRadioItem>
          <DropdownMenuRadioItem onClick={() => {setVisaType('B1/B2 Visa')}} value="B1/B2 Visa">B1/B2</DropdownMenuRadioItem>
          <DropdownMenuRadioItem onClick={() => {setVisaType('Schengen Visa')}} value="Schengen Visa">Schengen</DropdownMenuRadioItem>
          <DropdownMenuRadioItem onClick={() => {setVisaType('IELTS')}} value="IELTS">IELTS</DropdownMenuRadioItem>
          <DropdownMenuRadioItem onClick={() => {setVisaType('TOFEL')}} value="TOFEL">TOFEL</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
