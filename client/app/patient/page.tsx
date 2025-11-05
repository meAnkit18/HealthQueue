"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function PatientRegistrationPage() {
  const [name, setName] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [loginCode, setLoginCode] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoginCode("")

    if (!name || !phoneNumber) {
      setError("Name and phone number are required")
      return
    }

    try {
      const res = await fetch("/api/patient", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, phoneNumber }),
      })

      const data = await res.json()

      if (res.ok) {
        setLoginCode(data.loginCode)
      } else {
        setError(data.error || "Something went wrong")
      }
    } catch (error) {
      setError("Something went wrong")
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Patient Registration</CardTitle>
          <CardDescription>Enter your details to get a login code.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="1234567890"
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Get Login Code
            </Button>
          </form>
          {loginCode && (
            <div className="mt-4 p-4 bg-green-100 text-green-800 rounded-md">
              <p className="font-semibold">Your login code is: {loginCode}</p>
              <p>Use this code and your phone number to log in.</p>
            </div>
          )}
          {error && (
            <div className="mt-4 p-4 bg-red-100 text-red-800 rounded-md">
              <p className="font-semibold">{error}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}