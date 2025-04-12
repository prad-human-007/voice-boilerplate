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
          <DropdownMenuRadioItem onClick={() => {setVisaType('McDonalds')}} value="McDonalds">McDonalds</DropdownMenuRadioItem>
          <DropdownMenuRadioItem onClick={() => {setVisaType('Nike')}} value="Nike">Nike</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
