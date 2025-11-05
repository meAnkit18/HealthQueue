
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
        <Link href="/">
          <h1 className="text-2xl font-bold">InnoTech Health</h1>
        </Link>
        {isLoggedIn && (
          <div className="flex items-center gap-4">
            <Button onClick={handleLogout} variant="outline">
              Logout
            </Button>
          </div>
        )}
      </div>
    </header>
  )
}
