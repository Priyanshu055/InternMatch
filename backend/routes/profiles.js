const express = require('express');
const auth = require('../middleware/auth');
const CandidateProfile = require('../models/CandidateProfile');
const multer = require('multer');
const path = require('path');
const router = express.Router();

// Multer setup for resume upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${req.user.userId}-${Date.now()}${path.extname(file.originalname)}`);
  }
});
const upload = multer({ storage });

// Get profile
router.get('/', auth, async (req, res) => {
  try {
    const profile = await CandidateProfile.findOne({ user_id: req.user.userId });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.json(profile);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create or update profile
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'Candidate') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const { skills, education, experience } = req.body;
    let profile = await CandidateProfile.findOne({ user_id: req.user.userId });
    if (profile) {
      profile.skills = skills || profile.skills;
      profile.education = education || profile.education;
      profile.experience = experience || profile.experience;
      await profile.save();
    } else {
      profile = new CandidateProfile({
        user_id: req.user.userId,
        skills: skills || [],
        education,
        experience,
      });
      await profile.save();
    }
    res.json(profile);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Upload resume
router.post('/upload-resume', auth, upload.single('resume'), async (req, res) => {
  try {
    if (req.user.role !== 'Candidate') {
      return res.status(403).json({ message: 'Access denied' });
    }
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    const resume_url = `/uploads/${req.file.filename}`;
    let profile = await CandidateProfile.findOne({ user_id: req.user.userId });
    if (profile) {
      profile.resume_url = resume_url;
      await profile.save();
    } else {
      profile = new CandidateProfile({
        user_id: req.user.userId,
        resume_url,
      });
      await profile.save();
    }
    res.json({ message: 'Resume uploaded', resume_url });
  } catch (error) {
    console.error('Upload resume error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
