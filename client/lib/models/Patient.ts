
import mongoose, { Schema, Document } from 'mongoose';

export interface IPatient extends Document {
  name: string;
  phoneNumber: string;
  loginCode: string;
  age?: number;
  gender?: string;
  department?: string;
  doctor?: string;
  queueNumber?: number;
  status?: 'waiting' | 'called' | 'in-consultation' | 'completed';
  estimatedWaitTime?: number;
  checkInTime?: Date;
  registrationId?: string;
}

const PatientSchema: Schema = new Schema({
  name: { type: String, required: true },
  phoneNumber: { type: String, required: true, unique: true },
  loginCode: { type: String, required: true, unique: true },
  age: { type: Number },
  gender: { type: String },
  department: { type: String },
  doctor: { type: String },
  queueNumber: { type: Number },
  status: {
    type: String,
    enum: ['waiting', 'called', 'in-consultation', 'completed'],
    default: 'waiting'
  },
  estimatedWaitTime: { type: Number, default: 20 },
  checkInTime: { type: Date },
  registrationId: { type: String },
});

export default mongoose.models.Patient || mongoose.model<IPatient>('Patient', PatientSchema);
