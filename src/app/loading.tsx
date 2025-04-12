import { Bouncy } from "@/components/ui/Loaders"
export default function Loading() {
    return(
        <div className="flex items-center justify-center h-screen">
            <h1> <Bouncy color="#039BE5"/> </h1>
        </div>
    )
}