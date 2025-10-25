import { Schema as _Schema, model } from 'mongoose';

const Schema = _Schema;

const SocialSchema = new Schema({
  social1: { type: String, default: '' },
  social2: { type: String, default: '' },
  social3: { type: String, default: '' },
  social4: { type: String, default: '' }
}, { _id: false });

const UserSchema = new Schema({
  // FIX: Retaining the first 'name' field and removing the duplicate
  name: {type: String, required: true},
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  
  linkedinId: { type: String, default: '' },
  insta: { type: String, default: '' },
  github: { type: String, default: '' },
  description: { type: String, default: '' },
  
  // NEW: Field for Skills (comma-separated string)
  skills: { type: String, default: '' }, 
  
  socials: { type: SocialSchema, default: () => ({}) },

  // activity metadata
  postsCount: { type: Number, default: 0 },
  projectsCount: { type: Number, default: 0 },
  streak: { type: Number, default: 0 }, // consecutive days posting
  lastPostDate: { type: Date, default: null },

  // store refs to posts created by user
  posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }],

  createdAt: { type: Date, default: Date.now }
});

export default model('User', UserSchema);