'use client'

export async function updatePatientStatus(patientId: string, status: string) {
  try {
    const res = await fetch('/api/queue', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ patientId, status }),
    });

    if (!res.ok) {
      throw new Error('Failed to update patient status');
    }

    return await res.json();
  } catch (error) {
    console.error('Error updating patient status:', error);
    throw error;
  }
}