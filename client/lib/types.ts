export interface PatientQueue {
  _id: string;
  name: string;
  age: number;
  gender: string;
  phoneNumber: string;
  department: string;
  doctor: string;
  checkInTime: Date;
  queueNumber: number;
  registrationId: string;
  status: 'waiting' | 'called' | 'in-consultation' | 'completed';
  estimatedWaitTime: number;
}