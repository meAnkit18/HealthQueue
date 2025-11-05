"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, ClipboardList, Monitor, BarChart3, User } from "lucide-react"

const roles = [
  {
    id: "reception",
    title: "Reception Desk",
    description: "Check-in new patients and manage registrations",
    icon: ClipboardList,
    href: "/reception",
    color: "bg-blue-50 dark:bg-blue-950",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  {
    id: "doctor",
    title: "Doctor Dashboard",
    description: "View queue and manage patient consultations",
    icon: Users,
    href: "/doctor",
    color: "bg-emerald-50 dark:bg-emerald-950",
    iconColor: "text-emerald-600 dark:text-emerald-400",
  },
  {
    id: "display",
    title: "Waiting Area Display",
    description: "Large screen display for patient queue (TV)",
    icon: Monitor,
    href: "/display",
    color: "bg-purple-50 dark:bg-purple-950",
    iconColor: "text-purple-600 dark:text-purple-400",
  },
  {
    id: "admin",
    title: "Admin Analytics",
    description: "Hospital-wide analytics and reporting",
    icon: BarChart3,
    href: "/admin",
    color: "bg-orange-50 dark:bg-orange-950",
    iconColor: "text-orange-600 dark:text-orange-400",
  },
  {
    id: "patient",
    title: "Patient Portal",
    description: "Check your queue position and wait time",
    icon: User,
    href: "/patient",
    color: "bg-pink-50 dark:bg-pink-950",
    iconColor: "text-pink-600 dark:text-pink-400",
  },
]

export default function HomePage() {
  const router = useRouter()

  return (
    <main className="min-h-screen bg-gradient-to-br from-background to-muted">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          {/* <h1 className="text-4xl font-bold tracking-tight text-foreground mb-3">HealthQueue</h1> */}
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Intelligent hospital queue management system designed for seamless patient flow and improved healthcare
            delivery
          </p>
        </div>

        {/* Role Selection Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {roles.map((role) => {
            const Icon = role.icon
            return (
              <Card
                key={role.id}
                className="hover:shadow-lg transition-shadow cursor-pointer h-full"
                onClick={() => router.push(role.href)}
              >
                <CardHeader>
                  <div className={`${role.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                    <Icon className={`w-6 h-6 ${role.iconColor}`} />
                  </div>
                  <CardTitle className="text-xl">{role.title}</CardTitle>
                  <CardDescription>{role.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation()
                      router.push(role.href)
                    }}
                    className="w-full"
                  >
                    Open
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Footer Info */}
        <div className="mt-16 text-center text-sm text-muted-foreground">
          <p>HealthQueue v1.0 | Modern Queue Management for Government Hospitals</p>
        </div>
      </div>
    </main>
  )
}
