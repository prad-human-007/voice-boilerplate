'use client'

import type {} from 'ldrs'
import { useEffect } from 'react'

interface LoaderProps {
    color? : string
}

function SpiralLoader( {color}: LoaderProps) {
    useEffect(() => {
    async function getLoader() {
        const { spiral } = await import('ldrs')
        spiral.register()
    }
    getLoader()
    }, [])

    return <l-spiral color={color}></l-spiral>
}

function DotStream( {color} : LoaderProps) {
    useEffect(() => {
    async function getLoader() {
        const { dotStream } = await import('ldrs')
        dotStream.register()
    }
    getLoader()
    }, [])
    
    return <l-dot-stream color={color}></l-dot-stream>
}

function HourGlass( {color} : LoaderProps) {
    useEffect(() => {
    async function getLoader() {
        const { hourglass } = await import('ldrs')
        hourglass.register()
    }
    getLoader()
    }, [])
    
    return <l-hourglass color={color}></l-hourglass>
}

function Bouncy( {color} : LoaderProps) {
    useEffect(() => {
    async function getLoader() {
        const { bouncy } = await import('ldrs')
        bouncy.register()
    }
    getLoader()
    }, [])
    
    return <l-bouncy color={color}></l-bouncy>
}

function DotPulse( {color} : LoaderProps) {
    useEffect(() => {
    async function getLoader() {
        const { dotPulse } = await import('ldrs')
        dotPulse.register()
    }
    getLoader()
    }, [])
    
    return <l-dot-pulse color={color}></l-dot-pulse>
}



export { SpiralLoader, DotStream, HourGlass, Bouncy, DotPulse }