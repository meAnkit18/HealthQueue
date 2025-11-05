
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import Link from "next/link"

export default function LoginPage() {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [loginCode, setLoginCode] = useState("")
  const [userType, setUserType] = useState("patient")
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!phoneNumber || !loginCode) {
      setError("Phone number and login code are required")
      return
    }

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phoneNumber, loginCode, userType }),
      })

      const data = await res.json()

      if (res.ok) {
        window.location.href = '/'
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
          <CardTitle>Login</CardTitle>
          <CardDescription>Enter your phone number and login code.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Are you a patient or a doctor?</Label>
              <RadioGroup
                defaultValue="patient"
                onValueChange={setUserType}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="patient" id="patient" />
                  <Label htmlFor="patient">Patient</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="doctor" id="doctor" />
                  <Label htmlFor="doctor">Doctor</Label>
                </div>
              </RadioGroup>
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
            <div className="space-y-2">
              <Label htmlFor="loginCode">Login Code</Label>
              <Input
                id="loginCode"
                value={loginCode}
                onChange={(e) => setLoginCode(e.target.value)}
                placeholder="123456"
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
          {error && (
            <div className="mt-4 p-4 bg-red-100 text-red-800 rounded-md">
              <p className="font-semibold">{error}</p>
            </div>
          )}
          <div className="mt-4 text-center text-sm">
            Don't have an account?{" "}
            <Link href="/patient" className="underline">
              Register as a patient
            </Link>
            {" or "}
            <Link href="/doctor" className="underline">
              register as a doctor
            </Link>
            .
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
