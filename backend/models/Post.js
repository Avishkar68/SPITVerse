import { Schema as _Schema, model } from 'mongoose';
const Schema = _Schema;

const CommentSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  userEmail: { type: String }, // denormalized for convenience
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
}, { _id: true });

const PollOptionSchema = new Schema({
  optionText: { type: String, required: true },
  votes: { type: Number, default: 0 },
  voters: [{ type: Schema.Types.ObjectId, ref: 'User' }] // Added in previous step
}, { _id: true });

const PostSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  authorEmail: { type: String }, // denormalized for quick access
  type: { type: String, enum: ['blog','poll','project'], required: true },
  title: { type: String, default: '' },
  content: { type: String, default: '' }, // for blog/project description
  
  // poll-specific
  pollOptions: [PollOptionSchema],
  
  // project-specific
  projectAim: { type: String, default: '' },
  requirements: { type: [String], default: [] },
  desiredPeople: { type: Number, default: 0 },
  currentPeople: { type: Number, default: 0 },
  isOpen: { type: Boolean, default: true }, // close project

  // 💡 NEW: Likes array to store user IDs who liked the post
  likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],

  comments: [CommentSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default model('Post', PostSchema);