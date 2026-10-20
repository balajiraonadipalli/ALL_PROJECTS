import College from '../models/College.js';

// @desc    Get all colleges (with filtering, sorting, pagination)
// @route   GET /api/colleges
export const getColleges = async (req, res) => {
    try {
        const { search, sort, page = 1, limit = 10, status } = req.query;
        let query = {};

        // Search by name or location
        if (search && search.trim() !== '') {
            query.$text = { $search: search.trim() };
        }

        // Filter by Published status for public, or specified status for admin
        if (status) {
            query.status = status;
        } else {
            query.status = 'Published';
        }

        // Program exact match filter
        const { programs } = req.query;
        if (programs) {
            // programs could be an array if ?programs=B.Tech&programs=MBA or a single string
            let programList = Array.isArray(programs) ? programs : [programs];

            // To make sure we match any course containing this keyword
            // we will build an array of Regex objects for an OR query inside the courses array
            let programRegexes = programList.map(prog => new RegExp(prog, 'i'));
            query['courses.name'] = { $in: programRegexes };
        }

        let mQuery = College.find(query);

        // Sorting logic
        if (sort === 'ranking') mQuery = mQuery.sort({ ranking: 1 });
        else if (sort === 'fees_low') mQuery = mQuery.sort({ 'courses.fees': 1 });
        else if (sort === 'fees_high') mQuery = mQuery.sort({ 'courses.fees': -1 });
        else if (search) mQuery = mQuery.sort({ score: { $meta: 'textScore' } });
        else mQuery = mQuery.sort({ createdAt: -1 });

        // Pagination
        const skip = (Number(page) - 1) * Number(limit);
        mQuery = mQuery.skip(skip).limit(Number(limit));

        const colleges = await mQuery;
        const total = await College.countDocuments(query);

        res.status(200).json({
            colleges,
            page: Number(page),
            pages: Math.ceil(total / Number(limit)),
            total
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single college by slug
// @route   GET /api/colleges/:slug
export const getCollegeBySlug = async (req, res) => {
    try {
        const college = await College.findOne({ slug: req.params.slug });
        if (!college) {
            return res.status(404).json({ message: 'College not found' });
        }
        res.status(200).json(college);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create new college
// @route   POST /api/colleges
export const createCollege = async (req, res) => {
    try {
        let { slug, name } = req.body;
        if (!slug && name) {
            slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        }
        const college = await College.create({ ...req.body, slug });
        res.status(201).json(college);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update college
// @route   PUT /api/colleges/:id
// @access  Admin
export const updateCollege = async (req, res) => {
    try {
        let updateData = { ...req.body };
        if (updateData.name && !updateData.slug) {
            updateData.slug = updateData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        }
        const college = await College.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
        if (!college) {
            return res.status(404).json({ message: 'College not found' });
        }
        res.status(200).json(college);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Compare colleges
// @route   POST /api/colleges/compare
// @access  Public
export const compareColleges = async (req, res) => {
    try {
        const { ids } = req.body;
        if (!ids || ids.length < 2 || ids.length > 3) {
            return res.status(400).json({ message: 'Please provide 2 to 3 college IDs for comparison' });
        }

        const colleges = await College.find({ _id: { $in: ids } });
        res.status(200).json(colleges);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
