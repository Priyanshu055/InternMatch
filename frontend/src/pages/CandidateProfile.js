import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaGraduationCap, FaBriefcase, FaFileUpload, FaRocket, FaSave, FaEye, FaBuilding, FaIndustry, FaGlobe, FaInfoCircle } from 'react-icons/fa';
import AuthContext from '../context/AuthContext';
import axios from 'axios';

const CandidateProfile = () => {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState({ skills: [], education: '', experience: '', resume_url: '' });
  const [employerProfile, setEmployerProfile] = useState({ company: '', industry: '', website: '', description: '' });
  const [skillsInput, setSkillsInput] = useState('');
  const [file, setFile] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/profiles');
      if (user?.role === 'Candidate') {
        setProfile(res.data);
        setSkillsInput(res.data.skills.join(', '));
      } else if (user?.role === 'Employer') {
        setEmployerProfile(res.data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    try {
      if (user?.role === 'Candidate') {
        const skills = skillsInput.split(',').map(s => s.trim());
        await axios.post('http://localhost:5000/api/profiles', { skills, education: profile.education, experience: profile.experience });
      } else if (user?.role === 'Employer') {
        await axios.post('http://localhost:5000/api/profiles', employerProfile);
      }
      alert('Profile updated');
      fetchProfile();
    } catch (error) {
      alert('Update failed');
    }
  };

  const uploadResume = async (e) => {
    e.preventDefault();
    if (!file) return;
    const formData = new FormData();
    formData.append('resume', file);
    try {
      const res = await axios.post('http://localhost:5000/api/profiles/upload-resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Resume uploaded');
      setProfile({ ...profile, resume_url: res.data.resume_url });
    } catch (error) {
      alert('Upload failed');
    }
  };

  if (!user || (user.role !== 'Candidate' && user.role !== 'Employer')) return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div></div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            x: [0, 120, 0],
            y: [0, -60, 0],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-16 left-12 w-24 h-24 bg-white opacity-10 rounded-full"
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
          }}
          transition={{
            duration: 28,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-16 right-12 w-20 h-20 bg-white opacity-10 rounded-full"
        />
        <motion.div
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 35,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/3 right-1/4 w-16 h-16 bg-white opacity-5 rounded-full"
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <motion.h1
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="text-5xl font-bold text-gray-900 mb-4 flex items-center justify-center space-x-3"
          >
            <FaRocket className="text-purple-600" />
            <span>{user?.role === 'Candidate' ? 'Your Profile' : `${employerProfile.company || 'Your Company'} Profile`}</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-xl text-gray-600"
          >
            {user?.role === 'Candidate' ? 'Showcase your skills and experience to land your dream internship' : 'Update your company profile to attract top talent'}
          </motion.p>
        </motion.div>

        {user?.role === 'Candidate' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Profile Update Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="bg-white p-8 rounded-xl shadow-xl border border-gray-200"
            >
              <motion.h2
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.8, duration: 0.3 }}
                className="text-3xl font-bold text-gray-900 mb-6 flex items-center space-x-2"
              >
                <FaUser className="text-blue-500" />
                <span>Update Profile</span>
              </motion.h2>
              <form onSubmit={updateProfile} className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1, duration: 0.4 }}
                >
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-2">
                    <FaBriefcase className="text-green-500" />
                    <span>Skills (comma separated)</span>
                  </label>
                  <input
                    type="text"
                    value={skillsInput}
                    onChange={(e) => setSkillsInput(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    placeholder="e.g., JavaScript, React, Node.js"
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1, duration: 0.4 }}
                >
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-2">
                    <FaGraduationCap className="text-purple-500" />
                    <span>Education</span>
                  </label>
                  <input
                    type="text"
                    value={profile.education}
                    onChange={(e) => setProfile({ ...profile, education: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    placeholder="e.g., Bachelor's in Computer Science"
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2, duration: 0.4 }}
                >
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-2">
                    <FaBriefcase className="text-orange-500" />
                    <span>Experience</span>
                  </label>
                  <textarea
                    value={profile.experience}
                    onChange={(e) => setProfile({ ...profile, experience: e.target.value })}
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 resize-none"
                    placeholder="Describe your relevant experience..."
                  />
                </motion.div>
                <motion.button
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 1.3, duration: 0.3 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-lg hover:from-blue-600 hover:to-purple-700 transition duration-200 flex items-center justify-center space-x-2 shadow-lg"
                >
                  <FaSave />
                  <span>Update Profile</span>
                </motion.button>
              </form>
            </motion.div>

            {/* Resume Upload Section */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="bg-white p-8 rounded-xl shadow-xl border border-gray-200"
            >
              <motion.h2
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.8, duration: 0.3 }}
                className="text-3xl font-bold text-gray-900 mb-6 flex items-center space-x-2"
              >
                <FaFileUpload className="text-green-500" />
                <span>Resume Upload</span>
              </motion.h2>
              <form onSubmit={uploadResume} className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1, duration: 0.4 }}
                >
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Resume File</label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                  />
                </motion.div>
                <motion.button
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 1.1, duration: 0.3 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="w-full bg-gradient-to-r from-green-500 to-blue-600 text-white py-3 px-6 rounded-lg hover:from-green-600 hover:to-blue-700 transition duration-200 flex items-center justify-center space-x-2 shadow-lg"
                >
                  <FaFileUpload />
                  <span>Upload Resume</span>
                </motion.button>
              </form>
              {profile.resume_url && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2, duration: 0.4 }}
                  className="mt-6"
                >
                  <a
                    href={`http://localhost:5000${profile.resume_url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white py-2 px-4 rounded-lg hover:from-purple-600 hover:to-pink-700 transition duration-200 shadow-lg"
                  >
                    <FaEye />
                    <span>View Resume</span>
                  </a>
                </motion.div>
              )}
            </motion.div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="bg-white p-8 rounded-xl shadow-xl border border-gray-200 max-w-2xl mx-auto"
          >
            <motion.h2
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.8, duration: 0.3 }}
              className="text-3xl font-bold text-gray-900 mb-6 flex items-center space-x-2"
            >
              <FaBuilding className="text-blue-500" />
              <span>Update Company Profile</span>
            </motion.h2>
            <form onSubmit={updateProfile} className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.4 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-2">
                  <FaBuilding className="text-green-500" />
                  <span>Company Name</span>
                </label>
                <input
                  type="text"
                  value={employerProfile.company}
                  onChange={(e) => setEmployerProfile({ ...employerProfile, company: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  placeholder="e.g., Tech Innovations Inc."
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1, duration: 0.4 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-2">
                  <FaIndustry className="text-purple-500" />
                  <span>Industry</span>
                </label>
                <input
                  type="text"
                  value={employerProfile.industry}
                  onChange={(e) => setEmployerProfile({ ...employerProfile, industry: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  placeholder="e.g., Technology, Finance, Healthcare"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.4 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-2">
                  <FaGlobe className="text-orange-500" />
                  <span>Website</span>
                </label>
                <input
                  type="url"
                  value={employerProfile.website}
                  onChange={(e) => setEmployerProfile({ ...employerProfile, website: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  placeholder="e.g., https://www.company.com"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3, duration: 0.4 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-2">
                  <FaInfoCircle className="text-red-500" />
                  <span>Company Description</span>
                </label>
                <textarea
                  value={employerProfile.description}
                  onChange={(e) => setEmployerProfile({ ...employerProfile, description: e.target.value })}
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 resize-none"
                  placeholder="Describe your company, mission, and what makes it a great place to work..."
                />
              </motion.div>
              <motion.button
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 1.4, duration: 0.3 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-lg hover:from-blue-600 hover:to-purple-700 transition duration-200 flex items-center justify-center space-x-2 shadow-lg"
              >
                <FaSave />
                <span>Update Profile</span>
              </motion.button>
            </form>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CandidateProfile;
