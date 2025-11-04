"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ChevronLeft, Smartphone, Clock, AlertCircle } from "lucide-react"
import { mockPatients } from "@/lib/data"

export default function PatientPage() {
  const [registrationId, setRegistrationId] = useState("")
  const [selectedPatient, setSelectedPatient] = useState<(typeof mockPatients)[0] | null>(null)

  const handleSearch = () => {
    const patient = mockPatients.find((p) => p.registrationId.toLowerCase() === registrationId.toLowerCase())
    setSelectedPatient(patient || null)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b">
        <div className="container mx-auto px-4 py-4 flex items-center gap-3">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ChevronLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Patient Portal</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {!selectedPatient ? (
          <>
            {/* Search Card */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Check Your Queue Status</CardTitle>
                <CardDescription>Enter your registration ID to see your position</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="e.g., REG-2024-001"
                    value={registrationId}
                    onChange={(e) => setRegistrationId(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                    className="flex-1"
                  />
                  <Button onClick={handleSearch}>Search</Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Your registration ID was provided during check-in at the reception desk.
                </p>
              </CardContent>
            </Card>

            {/* Sample Data Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" /> Demo Registration IDs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">Try searching with one of these:</p>
                <div className="space-y-2">
                  {mockPatients.slice(0, 3).map((p) => (
                    <div
                      key={p.id}
                      className="text-sm font-mono text-primary cursor-pointer hover:underline"
                      onClick={() => {
                        setRegistrationId(p.registrationId)
                        setSelectedPatient(p)
                      }}
                    >
                      {p.registrationId} - {p.name}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            {/* Back Button */}
            <Button
              variant="outline"
              onClick={() => {
                setSelectedPatient(null)
                setRegistrationId("")
              }}
              className="mb-6"
            >
              Search Another ID
            </Button>

            {/* Patient Info */}
            <Card className="mb-6 border-2 border-primary">
              <CardHeader>
                <CardTitle>Your Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Full Name</p>
                    <p className="text-lg font-semibold">{selectedPatient.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Registration ID</p>
                    <p className="text-lg font-mono font-semibold text-primary">{selectedPatient.registrationId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Age & Gender</p>
                    <p className="text-lg font-semibold">
                      {selectedPatient.age} years, {selectedPatient.gender}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="text-lg font-semibold">{selectedPatient.phone}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-muted-foreground">Department</p>
                    <p className="text-lg font-semibold">{selectedPatient.department}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Queue Status */}
            <Card
              className={`mb-6 border-2
              ${selectedPatient.status === "waiting" ? "border-yellow-500 bg-yellow-50 dark:bg-yellow-950" : ""}
              ${selectedPatient.status === "called" ? "border-blue-500 bg-blue-50 dark:bg-blue-950" : ""}
              ${selectedPatient.status === "in-consultation" ? "border-green-500 bg-green-50 dark:bg-green-950" : ""}
              ${selectedPatient.status === "completed" ? "border-gray-500 bg-gray-50 dark:bg-gray-950" : ""}
            `}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" /> Queue Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center py-4">
                    <p
                      className="text-6xl font-bold mb-2
                      ${selectedPatient.status === 'waiting' ? 'text-yellow-600 dark:text-yellow-400' : ''}
                      ${selectedPatient.status === 'called' ? 'text-blue-600 dark:text-blue-400' : ''}
                      ${selectedPatient.status === 'in-consultation' ? 'text-green-600 dark:text-green-400' : ''}
                      ${selectedPatient.status === 'completed' ? 'text-gray-600 dark:text-gray-400' : ''}
                    "
                    >
                      #{selectedPatient.queueNumber}
                    </p>
                    <p className="text-2xl font-semibold capitalize">{selectedPatient.status.replace("-", " ")}</p>
                  </div>

                  {selectedPatient.status === "waiting" && (
                    <div className="bg-white dark:bg-card p-4 rounded-lg border">
                      <p className="text-sm text-muted-foreground mb-1">Estimated Wait Time</p>
                      <p className="text-3xl font-bold text-accent">{selectedPatient.estimatedWaitTime} minutes</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Check the waiting area display screens for real-time updates.
                      </p>
                    </div>
                  )}

                  {selectedPatient.status === "called" && (
                    <div className="bg-white dark:bg-card p-4 rounded-lg border border-blue-300 dark:border-blue-700">
                      <p className="font-semibold text-blue-900 dark:text-blue-100">
                        Your number is being called! Please proceed to the consultation room.
                      </p>
                    </div>
                  )}

                  {selectedPatient.status === "in-consultation" && (
                    <div className="bg-white dark:bg-card p-4 rounded-lg border border-green-300 dark:border-green-700">
                      <p className="font-semibold text-green-900 dark:text-green-100">
                        Doctor is ready for you. Please proceed to the consultation room.
                      </p>
                    </div>
                  )}

                  {selectedPatient.status === "completed" && (
                    <div className="bg-white dark:bg-card p-4 rounded-lg border">
                      <p className="font-semibold">Your consultation has been completed.</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Please collect any documents at the reception desk. Thank you for visiting.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Additional Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Smartphone className="w-4 h-4" /> Helpful Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p>• Keep your registration ID handy for reference</p>
                <p>• Watch the waiting area display screens for your queue number</p>
                <p>• When your number is called, proceed to the designated consultation room</p>
                <p>• For assistance, contact the reception desk</p>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}
