"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { PatientQueue } from "@/lib/types"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, Plus, Search } from "lucide-react"
import { mockPatients, mockDepartments } from "@/lib/data"

export default function ReceptionPage() {
  const [patients, setPatients] = useState<PatientQueue[]>([])

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch('/api/queue');
        if (!response.ok) {
          throw new Error('Failed to fetch patients');
        }
        const data = await response.json();
        // convert checkInTime strings to Date objects for rendering
        const normalized = data.map((p: any) => ({ ...p, checkInTime: p.checkInTime ? new Date(p.checkInTime) : new Date() }));
        setPatients(normalized);
      } catch (error) {
        console.error('Error fetching patients:', error);
      }
    };

    fetchPatients();
    // Set up polling to refresh the data every 30 seconds
    const interval = setInterval(fetchPatients, 30000);
    return () => clearInterval(interval);
  }, [])
  const [searchTerm, setSearchTerm] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    phone: "",
    department: "",
    doctor: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddPatient = async () => {
    if (formData.name && formData.age && formData.phone && formData.department) {
      try {
        const response = await fetch('/api/queue', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        const resBody = await response.json();
        if (!response.ok) {
          // if server sent an error message, surface it
          throw new Error(resBody?.error || 'Failed to add patient');
        }

        // Normalize server response
        const newPatient = { ...resBody, checkInTime: resBody.checkInTime ? new Date(resBody.checkInTime) : new Date() };
        setPatients([...patients, newPatient]);
        setFormData({ name: "", age: "", gender: "", phone: "", department: "", doctor: "" });
        setShowForm(false);
      } catch (error) {
        console.error('Error adding patient:', error);
        // Show a basic alert in the UI for now so receptionist sees the message
        alert((error as any).message || 'Failed to add patient');
        // You might want to show an error message to the user here
      }
    }
  }

  const filteredPatients = patients.filter(
    (p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.registrationId.includes(searchTerm),
  )

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
            <h1 className="text-2xl font-bold">Reception Desk</h1>
          </div>
          <Button onClick={() => setShowForm(true)} className="gap-2">
            <Plus className="w-4 h-4" /> New Check-in
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search */}
        <div className="mb-6 relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search by name or registration ID..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* New Check-in Form */}
        {showForm && (
          <Card className="mb-6 border-primary/50 bg-primary/5">
            <CardHeader>
              <CardTitle>New Patient Check-in</CardTitle>
              <CardDescription>Register a new patient for consultation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <Input placeholder="Full Name" name="name" value={formData.name} onChange={handleInputChange} />
                <Input placeholder="Age" name="age" type="number" value={formData.age} onChange={handleInputChange} />
                <Select value={formData.gender} onValueChange={(value) => handleSelectChange("gender", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <Input placeholder="Phone Number" name="phone" value={formData.phone} onChange={handleInputChange} />
                <Select value={formData.department} onValueChange={(value) => handleSelectChange("department", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Department" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockDepartments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.name}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Doctor Name (optional)"
                  name="doctor"
                  value={formData.doctor}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex gap-3">
                <Button onClick={handleAddPatient} className="flex-1">
                  Confirm Check-in
                </Button>
                <Button variant="outline" onClick={() => setShowForm(false)} className="flex-1">
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Patients Table */}
        <Card>
          <CardHeader>
            <CardTitle>Today's Check-ins</CardTitle>
            <CardDescription>{filteredPatients.length} patients registered</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold">Registration ID</th>
                    <th className="text-left py-3 px-4 font-semibold">Patient Name</th>
                    <th className="text-left py-3 px-4 font-semibold">Age/Gender</th>
                    <th className="text-left py-3 px-4 font-semibold">Department</th>
                    <th className="text-left py-3 px-4 font-semibold">Check-in Time</th>
                    <th className="text-left py-3 px-4 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPatients.map((patient) => (
                    <tr key={patient._id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4 font-mono text-primary">{patient.registrationId}</td>
                      <td className="py-3 px-4">{patient.name}</td>
                      <td className="py-3 px-4">
                        {patient.age}/{patient.gender[0]}
                      </td>
                      <td className="py-3 px-4">{patient.department}</td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {patient.checkInTime ? new Date(patient.checkInTime).toLocaleTimeString("en-IN") : "-"}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold
                          ${patient.status === "waiting" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100" : ""}
                          ${patient.status === "called" ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100" : ""}
                          ${patient.status === "in-consultation" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100" : ""}
                          ${patient.status === "completed" ? "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100" : ""}
                        `}
                        >
                          {patient.status.charAt(0).toUpperCase() + patient.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
