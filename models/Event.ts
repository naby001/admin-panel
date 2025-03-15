import mongoose, { Schema, Document } from 'mongoose';

export interface IEvent extends Document {
  title: string;
  description: string;
  date: Date;
  venue: string;
  maxTeamSize: number;
  minTeamSize: number;
  registrationDeadline: Date;
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    venue: { type: String, required: true },
    maxTeamSize: { type: Number, required: true, default: 1 },
    minTeamSize: { type: Number, required: true, default: 1 },
    registrationDeadline: { type: Date, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema); 