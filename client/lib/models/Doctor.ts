
import mongoose, { Schema, Document } from 'mongoose';

export interface IDoctor extends Document {
  name: string;
  phoneNumber: string;
  loginCode: string;
}

const DoctorSchema: Schema = new Schema({
  name: { type: String, required: true },
  phoneNumber: { type: String, required: true, unique: true },
  loginCode: { type: String, required: true, unique: true },
});

export default mongoose.models.Doctor || mongoose.model<IDoctor>('Doctor', DoctorSchema);
