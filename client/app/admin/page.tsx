"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft, TrendingUp, Users, Clock, CheckCircle } from "lucide-react"
import { mockDepartments, mockQueueMetrics } from "@/lib/data"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

const chartData = [
  { time: "9:00 AM", patients: 12, completed: 5 },
  { time: "10:00 AM", patients: 28, completed: 15 },
  { time: "11:00 AM", patients: 35, completed: 22 },
  { time: "12:00 PM", patients: 32, completed: 28 },
  { time: "1:00 PM", patients: 18, completed: 30 },
  { time: "2:00 PM", patients: 22, completed: 18 },
]

const departmentData = mockDepartments.map((dept) => ({
  name: dept.name,
  value: dept.totalPatients,
}))

const COLORS = ["hsl(var(--color-chart-1))", "hsl(var(--color-chart-2))", "hsl(var(--color-chart-3))"]

export default function AdminPage() {
  const metrics = mockQueueMetrics

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
          <h1 className="text-2xl font-bold">Admin Analytics Dashboard</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Key Metrics */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Users className="w-4 h-4" /> Total Patients
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{metrics.totalPatients}</p>
              <p className="text-xs text-muted-foreground mt-1">Today's registrations</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Clock className="w-4 h-4" /> Waiting
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-accent">{metrics.waitingPatients}</p>
              <p className="text-xs text-muted-foreground mt-1">Currently waiting</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <CheckCircle className="w-4 h-4" /> Completed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-secondary">{metrics.completedToday}</p>
              <p className="text-xs text-muted-foreground mt-1">Completed today</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <TrendingUp className="w-4 h-4" /> Avg Wait Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{metrics.averageWaitTime}m</p>
              <p className="text-xs text-muted-foreground mt-1">Peak: {metrics.peakHour}</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Patient Flow */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Patient Flow Today</CardTitle>
              <CardDescription>Registrations vs Completions by hour</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="patients" fill="hsl(var(--color-chart-1))" name="Registered" />
                  <Bar dataKey="completed" fill="hsl(var(--color-chart-2))" name="Completed" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Department Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Departments</CardTitle>
              <CardDescription>Patient distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={departmentData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {COLORS.map((color, index) => (
                      <Cell key={`cell-${index}`} fill={color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Department Details */}
        <Card>
          <CardHeader>
            <CardTitle>Department Summary</CardTitle>
            <CardDescription>Current queue status by department</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold">Department</th>
                    <th className="text-left py-3 px-4 font-semibold">Active Patients</th>
                    <th className="text-left py-3 px-4 font-semibold">Total Today</th>
                    <th className="text-left py-3 px-4 font-semibold">Avg Wait Time</th>
                    <th className="text-left py-3 px-4 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {mockDepartments.map((dept) => (
                    <tr key={dept.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4 font-semibold">{dept.name}</td>
                      <td className="py-3 px-4">
                        <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 px-2 py-1 rounded text-xs font-semibold">
                          {dept.activePatients}
                        </span>
                      </td>
                      <td className="py-3 px-4">{dept.totalPatients}</td>
                      <td className="py-3 px-4">{dept.averageWaitTime} min</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold
                          ${dept.averageWaitTime > 25 ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100" : ""}
                          ${dept.averageWaitTime > 15 && dept.averageWaitTime <= 25 ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100" : ""}
                          ${dept.averageWaitTime <= 15 ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100" : ""}
                        `}
                        >
                          {dept.averageWaitTime > 25 ? "High" : dept.averageWaitTime > 15 ? "Medium" : "Normal"}
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
