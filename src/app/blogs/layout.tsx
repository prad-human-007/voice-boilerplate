import React from 'react';
import Image from 'next/image';

export default function BlogsLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className='w-full '>
            {/* NAVBAR */}
            <div className="w-full">
                    <div className="flex justify-center w-full px-2">
                      <div className="flex flex-row shadow-xl border border-gray-200 rounded-2xl mt-3 w-full max-w-7xl justify-between items-center gap-3 p-3 bg-white bg-opacity-50"> 
                        <a href="/" className="flex items-center font-extrabold italic text-2xl"> 
                        <Image 
                          src='/images/headerImg.png'
                          alt="Logo"
                          width={40}
                          height={40}
                          className="mr-1"
                        />
                        Visa<div className="text-blue-500">Prep</div>AI
                        </a>
  
                      </div>
                    </div>
                  </div>

            {children}
        </div>
    );
}