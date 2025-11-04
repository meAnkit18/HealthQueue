// Mock database for HealthQueue system
export interface Patient {
  id: string
  registrationId: string
  name: string
  age: number
  gender: string
  phone: string
  department: string
  doctor: string
  checkInTime: Date
  queueNumber: number
  status: "waiting" | "called" | "in-consultation" | "completed"
  estimatedWaitTime: number
}

export interface DoctorSlot {
  id: string
  doctorId: string
  doctorName: string
  department: string
  startTime: Date
  endTime: Date
  capacity: number
  currentPatients: number
  averageConsultationTime: number
}

export interface Department {
  id: string
  name: string
  activePatients: number
  totalPatients: number
  averageWaitTime: number
}

export interface QueueMetrics {
  totalPatients: number
  waitingPatients: number
  completedToday: number
  averageWaitTime: number
  peakHour: string
}

// Mock data
export const mockPatients: Patient[] = [
  {
    id: "1",
    registrationId: "REG-2024-001",
    name: "Rajesh Kumar",
    age: 45,
    gender: "Male",
    phone: "98765-43210",
    department: "General Medicine",
    doctor: "Dr. Patel",
    checkInTime: new Date(Date.now() - 15 * 60000),
    queueNumber: 1,
    status: "in-consultation",
    estimatedWaitTime: 0,
  },
  {
    id: "2",
    registrationId: "REG-2024-002",
    name: "Priya Singh",
    age: 32,
    gender: "Female",
    phone: "98765-43211",
    department: "General Medicine",
    doctor: "Dr. Patel",
    checkInTime: new Date(Date.now() - 5 * 60000),
    queueNumber: 2,
    status: "called",
    estimatedWaitTime: 8,
  },
  {
    id: "3",
    registrationId: "REG-2024-003",
    name: "Amit Sharma",
    age: 55,
    gender: "Male",
    phone: "98765-43212",
    department: "General Medicine",
    doctor: "Dr. Patel",
    checkInTime: new Date(Date.now() + 5 * 60000),
    queueNumber: 3,
    status: "waiting",
    estimatedWaitTime: 18,
  },
  {
    id: "4",
    registrationId: "REG-2024-004",
    name: "Neha Gupta",
    age: 28,
    gender: "Female",
    phone: "98765-43213",
    department: "Cardiology",
    doctor: "Dr. Verma",
    checkInTime: new Date(Date.now() - 20 * 60000),
    queueNumber: 1,
    status: "in-consultation",
    estimatedWaitTime: 0,
  },
  {
    id: "5",
    registrationId: "REG-2024-005",
    name: "Vikram Malhotra",
    age: 38,
    gender: "Male",
    phone: "98765-43214",
    department: "Cardiology",
    doctor: "Dr. Verma",
    checkInTime: new Date(Date.now() + 10 * 60000),
    queueNumber: 2,
    status: "waiting",
    estimatedWaitTime: 25,
  },
]

export const mockDepartments: Department[] = [
  { id: "1", name: "General Medicine", activePatients: 3, totalPatients: 45, averageWaitTime: 18 },
  { id: "2", name: "Cardiology", activePatients: 2, totalPatients: 28, averageWaitTime: 22 },
  { id: "3", name: "Orthopedics", activePatients: 1, totalPatients: 15, averageWaitTime: 12 },
]

export const mockDoctorSlots: DoctorSlot[] = [
  {
    id: "1",
    doctorId: "doc-1",
    doctorName: "Dr. Patel",
    department: "General Medicine",
    startTime: new Date(Date.now()),
    endTime: new Date(Date.now() + 8 * 60 * 60000),
    capacity: 25,
    currentPatients: 3,
    averageConsultationTime: 10,
  },
  {
    id: "2",
    doctorId: "doc-2",
    doctorName: "Dr. Verma",
    department: "Cardiology",
    startTime: new Date(Date.now()),
    endTime: new Date(Date.now() + 8 * 60 * 60000),
    capacity: 20,
    currentPatients: 2,
    averageConsultationTime: 15,
  },
]

export const mockQueueMetrics: QueueMetrics = {
  totalPatients: 88,
  waitingPatients: 45,
  completedToday: 43,
  averageWaitTime: 22,
  peakHour: "10:00 - 11:00 AM",
}
