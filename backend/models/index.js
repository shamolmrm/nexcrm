const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  phone: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
});

const contactSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  company: { type: String, default: '' },
  email: { type: String, required: true, lowercase: true, trim: true },
  phone: { type: String, default: '' },
  status: { type: String, enum: ['lead', 'prospect', 'customer'], default: 'lead' },
  value: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

const dealSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  contact: { type: mongoose.Schema.Types.ObjectId, ref: 'Contact', required: true },
  stage: { type: String, enum: ['Lead', 'Qualified', 'Proposal', 'Negotiation', 'Won'], default: 'Lead' },
  status: { type: String, enum: ['open', 'won', 'lost'], default: 'open' },
  value: { type: Number, default: 0 },
  closeDate: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
});

const taskSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  relatedTo: { type: String, default: '' },
  dueDate: { type: Date, required: true },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  status: { type: String, enum: ['pending', 'in_review', 'done'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

const emailSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  from: { type: String, required: true },
  subject: { type: String, required: true },
  relatedTo: { type: String, default: '' },
  date: { type: Date, default: Date.now },
  read: { type: Boolean, default: false },
  snippet: { type: String, default: '' },
});

const User = mongoose.model('User', userSchema);
const Contact = mongoose.model('Contact', contactSchema);
const Deal = mongoose.model('Deal', dealSchema);
const Task = mongoose.model('Task', taskSchema);
const Email = mongoose.model('Email', emailSchema);

module.exports = { User, Contact, Deal, Task, Email };
