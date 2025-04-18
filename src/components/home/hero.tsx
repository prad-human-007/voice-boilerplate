'use client'

export function Hero() {
    return (
    <div className="flex flex-col items-center justify-center overflow-y-auto p-2 py-4 gap-4 w-full h-screen">
      <h1 className="text-4xl text-blue-500"> Survey Monk</h1>
      <a href="/voice" className="border border-gray-500 px-4 py-2 rounded-lg bg-white shadow-xl hover:bg-gray-50 transition-all duration-300 ease-in-out">
        Go to Demo page
      </a>
    </div>
    )
}