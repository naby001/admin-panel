import mongoose, { Schema, Document } from 'mongoose';
import { IEvent } from './Event';
import { IUser } from './User';

interface TeamMember {
  name: string;
  email: string;
  phone?: string;
}

export interface ITeam extends Document {
  name: string;
  event: IEvent['_id'];
  leader: IUser['_id'];
  phone: string;
  email: string;
  fullname: string;
  institution: string;
  member1: string;
  member2: string;
  member3: string;
  members: TeamMember[];
  registrationDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const TeamSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    event: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
    leader: { type: Schema.Types.ObjectId, ref: 'User' },
    phone: { type: String },
    email: { type: String },
    fullname: { type: String },
    institution: { type: String },
    member1: { type: String },
    member2: { type: String },
    member3: { type: String },
    members: [
      {
        name: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String },
      },
    ],
    registrationDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.Team || mongoose.model<ITeam>('Team', TeamSchema); 