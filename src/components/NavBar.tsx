import React from 'react'
import Link from 'next/link'

function NavBar() {
  return (
    <nav className="flex items-center gap-6 p-4 border-b">
      <Link href="/">Home</Link>
      <Link href="/analyse">Analyse</Link>
      <Link href="/about">About</Link>
    </nav>
  )
}

export default NavBar