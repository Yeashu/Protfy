"use client"
import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

function NavBar() {
  const pathname = usePathname();
  
  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <span className="text-blue-600 text-xl font-bold">Protfy</span>
            </Link>
          </div>
          <div className="flex space-x-4 sm:space-x-8">
            <Link 
              href="/" 
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150
                ${isActive('/') 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-gray-700 hover:bg-gray-100'}`}
            >
              Home
            </Link>
            <Link 
              href="/analyse" 
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150
                ${isActive('/analyse') 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-gray-700 hover:bg-gray-100'}`}
            >
              Analyse
            </Link>
            <Link 
              href="/about" 
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150
                ${isActive('/about') 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-gray-700 hover:bg-gray-100'}`}
            >
              About
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default NavBar