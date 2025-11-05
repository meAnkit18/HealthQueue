"use client"

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Header({ isLoggedIn }: { isLoggedIn: boolean }) {
  const handleLogout = async () => {
    try {
      await fetch("/api/logout");
      window.location.href = '/login';
    } catch (error) {
      console.error("Failed to logout");
    }
  };

  return (
     <header className="bg-card border-b">
    <div className="container mx-auto px-4 py-4 flex items-center justify-between">

      {/* Left: Logo */}
      <Link href="/" className="flex items-center gap-3">
        <img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgIkmHIKngARdQb_4wS3-vz-SmuNXTCMNjGhlGvLEpeaOj4AcAMSelOkzosqIC8jNfAPNAxjAYXk-gurYxoTtUxbANsSUZEPiIaaz9khojBo7so15xH8Xq4BJD3SnYxVKNLKL7atNlTulBIu_JlQY4VU50uNASRm_V9x45jhcXKw6bgWK9slqqcBQUNvDM/s570/WhatsApp%20Image%202025-11-05%20at%202.37.34%20PM%20-%20Edited.jpg"
          className='h-10 w-10'
          alt="InnoTech Logo"
        />
        <h1 className="text-2xl font-bold">HealthQueue</h1>
      </Link>

      {/* Center: Navigation */}
      <nav className="flex-1 flex justify-center gap-8 text-lg font-normal">
        <Link href="/" className="hover:underline">Home</Link>
        <Link href="/about" className="hover:underline">About</Link>
        <Link href="/contact" className="hover:underline">Contact</Link>
      </nav>

      {/* Right: Logout */}
      {isLoggedIn && (
        <Button onClick={handleLogout} variant="outline">
          Logout
        </Button>
      )}

    </div>
  </header>
  )
}
