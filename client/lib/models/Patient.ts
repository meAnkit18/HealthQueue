
import mongoose, { Schema, Document } from 'mongoose';

export interface IPatient extends Document {
  name: string;
  phoneNumber: string;
  loginCode: string;
}

const PatientSchema: Schema = new Schema({
  name: { type: String, required: true },
  phoneNumber: { type: String, required: true, unique: true },
  loginCode: { type: String, required: true, unique: true },
});

export default mongoose.models.Patient || mongoose.model<IPatient>('Patient', PatientSchema);
