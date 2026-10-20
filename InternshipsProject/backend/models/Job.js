const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    companyLogo: {
      type: String,
      default: '',
    },
    location: {
      type: String,
      required: true,
    },
    jobType: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Internship', 'Contract', 'Remote', 'Freelance'],
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    experience: {
      type: String,
      enum: ['Entry Level', 'Mid Level', 'Senior Level', 'Director', 'Executive'],
      required: true,
    },
    salary: {
      min: { type: Number },
      max: { type: Number },
      currency: { type: String, default: 'USD' },
    },
    description: {
      type: String,
      required: true,
    },
    requirements: [String],
    skills: [String],
    applyLink: {
      type: String,
      default: '',
      trim: true,
    },
    disclaimer: {
      type: String,
      default: '',
      trim: true,
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    applicationDeadline: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    applicants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Job', jobSchema);
