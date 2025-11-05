"use client"

import { useEffect, useState } from "react"
import { PatientQueue } from "@/lib/types"

export default function DisplayPage() {
  const [time, setTime] = useState<string>("")
  const [patients, setPatients] = useState<PatientQueue[]>([])

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch('/api/queue');
        if (!response.ok) {
          throw new Error('Failed to fetch patients');
        }
        const data = await response.json();
        setPatients(data);
      } catch (error) {
        console.error('Error fetching patients:', error);
      }
    };

    fetchPatients();
    // Update data every 10 seconds
    const interval = setInterval(fetchPatients, 10000);
    return () => clearInterval(interval);
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString("en-IN"))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const currentPatient = patients.find((p) => p.status === "called" || p.status === "in-consultation")
  const departmentGroups = patients.reduce(
    (acc, patient) => {
      if (!acc[patient.department]) {
        acc[patient.department] = []
      }
      acc[patient.department].push(patient)
      return acc
    },
    {} as Record<string, typeof patients>,
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary to-primary/80 text-white overflow-hidden">
      {/* Header with Time */}
      <div className="bg-black/20 backdrop-blur-sm p-6">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold">HEALTHQUEUE</h1>
          <div className="text-right">
            <p className="text-sm opacity-90">Current Time</p>
            <p className="text-3xl font-mono font-bold">{time}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-3 gap-6 h-[calc(100vh-120px)]">
          {/* Left: Current Patient */}
          <div className="col-span-2 space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 h-full flex flex-col justify-center">
              {currentPatient ? (
                <div className="text-center">
                  <p className="text-2xl opacity-90 mb-4">Now Serving</p>
                  <div className="mb-8">
                    <div className="text-9xl font-bold mb-6 text-yellow-300">#{currentPatient.queueNumber}</div>
                    <h2 className="text-5xl font-bold mb-2">{currentPatient.name}</h2>
                    <p className="text-2xl opacity-80">{currentPatient.department}</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4 inline-block">
                    <p className="text-lg">Registration: {currentPatient.registrationId}</p>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-5xl opacity-75">Waiting for next patient...</p>
                </div>
              )}
            </div>
          </div>

          {/* Right: Department Queues */}
          <div className="space-y-4 max-h-full overflow-y-auto">
            {Object.entries(departmentGroups).map(([department, deptPatients]) => (
              <div key={department} className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                <h3 className="text-lg font-bold mb-3 text-yellow-300">{department}</h3>
                <div className="space-y-2">
                  {deptPatients.slice(0, 5).map((patient) => (
                    <div
                      key={patient._id}
                      className={`p-2 rounded text-sm font-semibold text-center
                        ${patient.status === "in-consultation" ? "bg-green-500" : ""}
                        ${patient.status === "called" ? "bg-blue-500" : ""}
                        ${patient.status === "waiting" ? "bg-yellow-500" : ""}
                      `}
                    >
                      #{patient.queueNumber} - {patient.name}
                    </div>
                  ))}
                  {deptPatients.length > 5 && (
                    <p className="text-sm opacity-75 text-center py-2">+{deptPatients.length - 5} more waiting</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
