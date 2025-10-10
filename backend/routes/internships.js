const express = require('express');
const auth = require('../middleware/auth');
const Internship = require('../models/Internship');
const CandidateProfile = require('../models/CandidateProfile');
const router = express.Router();

// Helper function to calculate match score
const calculateMatchScore = (candidateSkills, requiredSkills) => {
  if (!candidateSkills || candidateSkills.length === 0) return 0;
  const match = requiredSkills.filter(skill => candidateSkills.includes(skill)).length;
  return Math.round((match / requiredSkills.length) * 100);
};

// Get all internships with optional filters
router.get('/', async (req, res) => {
  try {
    const { location, skills } = req.query;
    let query = {};
    if (location) query.location = location;
    if (skills) query.required_skills = { $in: skills.split(',') };
    const internships = await Internship.find(query).populate('company_id', 'name');
    res.json(internships);
  } catch (error) {
    console.error('Get internships error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get recommended internships for candidate with match score
router.get('/recommended', auth, async (req, res) => {
  try {
    if (req.user.role !== 'Candidate') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const profile = await CandidateProfile.findOne({ user_id: req.user.userId });
    const internships = await Internship.find({}).populate('company_id', 'name');
    const recommended = internships.map(internship => ({
      ...internship.toObject(),
      matchScore: calculateMatchScore(profile ? profile.skills : [], internship.required_skills)
    })).sort((a, b) => b.matchScore - a.matchScore);
    res.json(recommended);
  } catch (error) {
    console.error('Get recommended internships error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get internships posted by the employer
router.get('/employer', auth, async (req, res) => {
  try {
    if (req.user.role !== 'Employer') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const internships = await Internship.find({ company_id: req.user.userId }).populate('company_id', 'name');
    res.json(internships);
  } catch (error) {
    console.error('Get employer internships error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get internship by ID
router.get('/:id', async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id).populate('company_id', 'name');
    if (!internship) {
      return res.status(404).json({ message: 'Internship not found' });
    }
    res.json(internship);
  } catch (error) {
    console.error('Get internship error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new internship (Employer only)
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'Employer') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const { title, description, required_skills, location, stipend, duration, applicationDeadline } = req.body;
    const internship = new Internship({
      title,
      company_id: req.user.userId,
      description,
      required_skills,
      location,
      stipend,
      duration,
      applicationDeadline,
    });
    await internship.save();
    res.status(201).json(internship);
  } catch (error) {
    console.error('Create internship error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update internship (Employer only)
router.put('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'Employer') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const internship = await Internship.findById(req.params.id);
    if (!internship) {
      return res.status(404).json({ message: 'Internship not found' });
    }
    if (internship.company_id.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }
    const updatedInternship = await Internship.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedInternship);
  } catch (error) {
    console.error('Update internship error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete internship (Employer only)
router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'Employer') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const internship = await Internship.findById(req.params.id);
    if (!internship) {
      return res.status(404).json({ message: 'Internship not found' });
    }
    if (internship.company_id.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }
    await Internship.findByIdAndDelete(req.params.id);
    res.json({ message: 'Internship deleted' });
  } catch (error) {
    console.error('Delete internship error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
