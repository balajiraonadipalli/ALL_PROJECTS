import express from 'express';
import { getColleges, getCollegeBySlug, createCollege, updateCollege, compareColleges } from '../controllers/collegeController.js';

const router = express.Router();

router.route('/')
    .get(getColleges)
    .post(createCollege);

router.post('/compare', compareColleges);

router.route('/:slug')
    .get(getCollegeBySlug);

router.put('/:id', updateCollege);

export default router;
