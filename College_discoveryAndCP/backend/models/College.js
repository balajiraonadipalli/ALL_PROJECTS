import mongoose from 'mongoose';

const CourseSchema = new mongoose.Schema({
    name: { type: String, required: true },
    duration: { type: String, required: true },
    fees: { type: Number, required: true },
    availableSeats: { type: Number },
});

const PlacementSchema = new mongoose.Schema({
    averagePackage: { type: Number },
    highestPackage: { type: Number },
    topRecruiters: [{ type: String }],
});

const CollegeSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    images: [{ type: String }],
    ranking: { type: Number, default: 0 },
    status: { type: String, enum: ['Draft', 'Published'], default: 'Draft' },
    courses: [CourseSchema],
    placement: PlacementSchema,
    eligibility: { type: String },
}, { timestamps: true });

// Create text index on name and location for search functionality
CollegeSchema.index({ name: 'text', location: 'text' });
// Index on ranking for sorting
CollegeSchema.index({ ranking: 1 });
// Index on courses.fees to help with filtering/sorting by fees
CollegeSchema.index({ 'courses.fees': 1 });

export default mongoose.model('College', CollegeSchema);
