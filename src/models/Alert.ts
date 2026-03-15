import mongoose, { Schema, Document } from 'mongoose';

export interface IAlert extends Document {
  contact: {
    email?: string;
    phone?: string;
  };
  symbols: string[];
  lastBreakStatus: Map<string, boolean>; // using Map for dynamic keys
  createdAt: Date;
}

const AlertSchema: Schema = new Schema({
  contact: {
    email: { type: String, trim: true, lowercase: true },
    phone: { type: String, trim: true },
  },
  symbols: [{ type: String, required: true }],
  lastBreakStatus: {
    type: Map,
    of: Boolean,
    default: {},
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Avoid re-compiling model in development hot reloads
export default mongoose.models.Alert || mongoose.model<IAlert>('Alert', AlertSchema);
