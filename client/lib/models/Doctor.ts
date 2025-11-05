
import mongoose, { Schema, Document } from 'mongoose';

export interface IDoctor extends Document {
  name: string;
  phoneNumber: string;
  loginCode: string;
  department?: string;
  status?: 'available' | 'busy' | 'offline';
  averageConsultationTime?: number;
  currentPatient?: string;
  availableSlots?: {
    startTime: Date;
    endTime: Date;
    maxPatients: number;
  }[];
}

const DoctorSchema: Schema = new Schema({
  name: { type: String, required: true },
  phoneNumber: { type: String, required: true, unique: true },
  loginCode: { type: String, required: true, unique: true },
  department: { type: String },
  status: { 
    type: String,
    enum: ['available', 'busy', 'offline'],
    default: 'offline'
  },
  averageConsultationTime: { type: Number, default: 15 },
  currentPatient: { type: Schema.Types.ObjectId, ref: 'Patient' },
  availableSlots: [{
    startTime: { type: Date },
    endTime: { type: Date },
    maxPatients: { type: Number }
  }]
});

export default mongoose.models.Doctor || mongoose.model<IDoctor>('Doctor', DoctorSchema);
