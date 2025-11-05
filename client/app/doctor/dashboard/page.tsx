"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { updatePatientStatus } from "./actions"

interface Patient {
  _id: string;
  name: string;
  phoneNumber: string;
  status: string;
  createdAt: string;
}

export default function DoctorDashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [patients, setPatients] = useState<Patient[]>([])
  const [error, setError] = useState("")
  const [updating, setUpdating] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'waiting' | 'in-consultation' | 'completed'>('all')

  const fetchPatients = async () => {
    try {
      const res = await fetch('/api/patient/list', { 
        credentials: 'include',
        cache: 'no-store' // Disable caching to ensure fresh data
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        // Handle specific HTTP status codes
        switch (res.status) {
          case 401:
            throw new Error('Please login again to continue');
          case 403:
            throw new Error('Access denied. Only doctors can view patient list');
          default:
            throw new Error(data.error || 'Failed to fetch patients');
        }
      }
      
      // Check if data has the expected structure
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid response received');
      }

      // If data.patients is undefined, treat it as an empty array
      const patientList = data.patients || [];
      
      // Verify it's an array even if empty
      if (!Array.isArray(patientList)) {
        throw new Error('Invalid patient data format');
      }
      
      setPatients(patientList);
      setError(''); // Clear any previous errors
    } catch (e) {
      console.error('Error fetching patients:', e);
      setError(e instanceof Error ? e.message : 'Failed to load patient registrations');
      setPatients([]); // Reset patients list on error
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
  const res = await fetch('/api/user', { credentials: 'include' })
        if (!res.ok) {
          // Not authenticated or other error
          router.replace('/login')
          return
        }
        const data = await res.json()
        if (data.userType !== 'doctor') {
          // Not a doctor
          router.replace('/login')
          return
        }
        setUser(data.user);
        // After successfully getting user data, fetch patients
        await fetchPatients();
      } catch (e) {
        console.error('Error fetching user:', e)
        setError('Failed to load user data. Please try logging in again.')
        router.replace('/login')
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [router])

  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="text-red-500 mb-4">{error}</div>
        <div className="space-x-4">
          <button 
            onClick={() => fetchPatients()}
            className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2"
          >
            Try Again
          </button>
          <button 
            onClick={() => router.push('/login')}
            className="border border-input bg-background hover:bg-accent hover:text-accent-foreground inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2"
          >
            Back to Login
          </button>
        </div>
      </div>
    )
  }

  if (loading) return <div className="p-8">Loading...</div>

  if (!user) return null

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Doctor Dashboard</h1>
        <div className="bg-card border p-6 rounded-md mb-6">
          <p className="text-lg">Welcome, <strong>{user.name}</strong></p>
          <p className="text-sm text-muted-foreground">Phone: {user.phoneNumber}</p>
          <div className="mt-6">
            <h2 className="text-xl font-semibold">Actions</h2>
            <div className="mt-3 flex gap-3">
              <button className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2" onClick={() => router.push('/doctor')}>My Profile</button>
              <button className="border border-input bg-background hover:bg-accent hover:text-accent-foreground inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2" onClick={() => alert('Feature coming soon')}>Call next patient</button>
              <button className="border border-input bg-background hover:bg-accent hover:text-accent-foreground inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2" onClick={() => alert('Feature coming soon')}>Complete consultation</button>
            </div>
          </div>
        </div>

        <div className="bg-card border rounded-md">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Patient Registrations</h2>
            {patients.length === 0 ? (
              <p className="text-muted-foreground">No patient registrations yet.</p>
            ) : (
              <div className="grid gap-4">
                {patients
                  .filter(patient => filter === 'all' || patient.status === filter)
                  .map((patient) => (
                  <div key={patient._id} className="border rounded-lg p-4 bg-background">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{patient.name}</h3>
                        <p className="text-sm text-muted-foreground">Phone: {patient.phoneNumber}</p>
                        <p className="text-sm text-muted-foreground">
                          Registered: {new Date(patient.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          patient.status === 'waiting' ? 'bg-yellow-100 text-yellow-800' :
                          patient.status === 'in-consultation' ? 'bg-blue-100 text-blue-800' :
                          patient.status === 'completed' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {patient.status || 'registered'}
                        </span>
                        {patient.status === 'waiting' && (
                          <button
                            disabled={updating === patient._id}
                            onClick={async () => {
                              try {
                                setUpdating(patient._id);
                                await updatePatientStatus(patient._id, 'in-consultation');
                                await fetchPatients();
                              } catch (err) {
                                console.error('Failed to update status:', err);
                              } finally {
                                setUpdating(null);
                              }
                            }}
                            className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-2 py-1 rounded"
                          >
                            {updating === patient._id ? 'Updating...' : 'Start Consultation'}
                          </button>
                        )}
                        {patient.status === 'in-consultation' && (
                          <button
                            disabled={updating === patient._id}
                            onClick={async () => {
                              try {
                                setUpdating(patient._id);
                                await updatePatientStatus(patient._id, 'completed');
                                await fetchPatients();
                              } catch (err) {
                                console.error('Failed to update status:', err);
                              } finally {
                                setUpdating(null);
                              }
                            }}
                            className="bg-green-500 hover:bg-green-600 text-white text-xs px-2 py-1 rounded"
                          >
                            {updating === patient._id ? 'Updating...' : 'Complete Consultation'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
