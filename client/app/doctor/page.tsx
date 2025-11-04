"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft, Phone, CheckCircle, Clock } from "lucide-react"
import { mockPatients, mockDoctorSlots } from "@/lib/data"

export default function DoctorPage() {
  const [patients, setPatients] = useState(mockPatients.filter((p) => p.status !== "completed"))
  const doctorSlot = mockDoctorSlots[0]

  const handleCallPatient = () => {
    const waitingPatient = patients.find((p) => p.status === "waiting")
    if (waitingPatient) {
      setPatients(patients.map((p) => (p.id === waitingPatient.id ? { ...p, status: "called" as const } : p)))
    }
  }

  const handleStartConsultation = () => {
    const calledPatient = patients.find((p) => p.status === "called")
    if (calledPatient) {
      setPatients(patients.map((p) => (p.id === calledPatient.id ? { ...p, status: "in-consultation" as const } : p)))
    }
  }

  const handleCompleteConsultation = () => {
    const inConsultationPatient = patients.find((p) => p.status === "in-consultation")
    if (inConsultationPatient) {
      setPatients(patients.map((p) => (p.id === inConsultationPatient.id ? { ...p, status: "completed" as const } : p)))
    }
  }

  const currentPatient = patients.find((p) => p.status === "called" || p.status === "in-consultation")
  const queueList = patients.filter((p) => p.status !== "completed").sort((a, b) => a.queueNumber - b.queueNumber)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ChevronLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Doctor Dashboard</h1>
              <p className="text-sm text-muted-foreground">
                {doctorSlot.doctorName} - {doctorSlot.department}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Queue Management */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Patient */}
            <Card className="border-secondary bg-secondary/5">
              <CardHeader>
                <CardTitle className="text-lg">Current Patient</CardTitle>
              </CardHeader>
              <CardContent>
                {currentPatient ? (
                  <div className="space-y-4">
                    <div className="bg-white dark:bg-card p-4 rounded-lg border-2 border-secondary">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="text-sm text-muted-foreground">Queue #</p>
                          <p className="text-3xl font-bold text-secondary">{currentPatient.queueNumber}</p>
                        </div>
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 rounded text-sm font-semibold">
                          {currentPatient.status === "in-consultation" ? "In Consultation" : "Called"}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold mb-1">{currentPatient.name}</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        {currentPatient.age} years old • {currentPatient.gender}
                      </p>
                      <p className="text-sm">
                        <span className="font-semibold">Registration ID:</span> {currentPatient.registrationId}
                      </p>
                      <p className="text-sm">
                        <span className="font-semibold">Phone:</span> {currentPatient.phone}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {currentPatient.status === "called" && (
                        <Button onClick={handleStartConsultation} className="flex-1 gap-2">
                          <CheckCircle className="w-4 h-4" /> Start Consultation
                        </Button>
                      )}
                      {currentPatient.status === "in-consultation" && (
                        <Button
                          onClick={handleCompleteConsultation}
                          className="flex-1 bg-green-600 hover:bg-green-700 gap-2"
                        >
                          <CheckCircle className="w-4 h-4" /> Complete Consultation
                        </Button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">No patient currently selected</p>
                    <Button onClick={handleCallPatient} className="gap-2">
                      <Phone className="w-4 h-4" /> Call Next Patient
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Queue List */}
            <Card>
              <CardHeader>
                <CardTitle>Patient Queue</CardTitle>
                <CardDescription>
                  Waiting patients: {patients.filter((p) => p.status === "waiting").length}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {queueList.length > 0 ? (
                    queueList.map((patient) => (
                      <div
                        key={patient.id}
                        className={`p-3 rounded-lg border flex justify-between items-center
                          ${patient.status === "in-consultation" ? "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800" : ""}
                          ${patient.status === "called" ? "bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800" : ""}
                          ${patient.status === "waiting" ? "bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800" : ""}
                        `}
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <div className="text-2xl font-bold text-secondary w-12 text-center">
                            {patient.queueNumber}
                          </div>
                          <div>
                            <p className="font-semibold">{patient.name}</p>
                            <p className="text-xs text-muted-foreground">{patient.registrationId}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span
                            className={`text-xs font-semibold px-2 py-1 rounded
                            ${patient.status === "waiting" ? "bg-yellow-200 text-yellow-900 dark:bg-yellow-800 dark:text-yellow-100" : ""}
                            ${patient.status === "called" ? "bg-blue-200 text-blue-900 dark:bg-blue-800 dark:text-blue-100" : ""}
                            ${patient.status === "in-consultation" ? "bg-green-200 text-green-900 dark:bg-green-800 dark:text-green-100" : ""}
                          `}
                          >
                            {patient.status.charAt(0).toUpperCase() + patient.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground py-4">No patients in queue</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar - Statistics */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Slot Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Patients Today</p>
                  <p className="text-2xl font-bold">
                    {doctorSlot.currentPatients} / {doctorSlot.capacity}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg Consultation Time</p>
                  <p className="text-lg font-semibold">{doctorSlot.averageConsultationTime} mins</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Waiting Patients</p>
                  <p className="text-lg font-bold text-accent">
                    {patients.filter((p) => p.status === "waiting").length}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Clock className="w-4 h-4" /> Next Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={handleCallPatient}
                  disabled={!patients.find((p) => p.status === "waiting")}
                  className="w-full"
                  variant={patients.find((p) => p.status === "waiting") ? "default" : "secondary"}
                >
                  Call Next Patient
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
