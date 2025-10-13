const express = require('express');
const auth = require('../middleware/auth');
const Application = require('../models/Application');
const Internship = require('../models/Internship');
const router = express.Router();

// Get applications for candidate
router.get('/candidate', auth, async (req, res) => {
  try {
    if (req.user.role !== 'Candidate') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const applications = await Application.find({ candidate_id: req.user.userId }).populate('internship_id');
    res.json(applications);
  } catch (error) {
    console.error('Get candidate applications error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get applications for employer
router.get('/employer', auth, async (req, res) => {
  try {
    if (req.user.role !== 'Employer') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const internships = await Internship.find({ company_id: req.user.userId });
    const internshipIds = internships.map(i => i._id);
    const applications = await Application.find({ internship_id: { $in: internshipIds } }).populate('candidate_id', 'name email').populate('internship_id', 'title');
    res.json(applications);
  } catch (error) {
    console.error('Get employer applications error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Apply for internship
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'Candidate') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const { internship_id, cover_letter, resume_url, additional_info } = req.body;
    const existingApplication = await Application.findOne({ candidate_id: req.user.userId, internship_id });
    if (existingApplication) {
      return res.status(400).json({ message: 'Already applied' });
    }
    const application = new Application({
      candidate_id: req.user.userId,
      internship_id,
      cover_letter,
      resume_url,
      additional_info,
    });
    await application.save();
    res.status(201).json(application);
  } catch (error) {
    console.error('Apply error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update application status
router.put('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'Employer') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const { status } = req.body;
    const application = await Application.findById(req.params.id).populate('internship_id');
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    if (application.internship_id.company_id.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }
    application.status = status;
    await application.save();
    res.json(application);
  } catch (error) {
    console.error('Update application error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
