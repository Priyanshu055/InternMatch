import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { FaBriefcase } from 'react-icons/fa';
import AuthContext from '../context/AuthContext';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { API_URL } from '../config';

const EditInternship = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    required_skills: '',
    location: '',
    stipend: '',
    duration: '',
    applicationDeadline: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInternship = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/internships/${id}`);
        const internship = res.data;
        setFormData({
          title: internship.title,
          description: internship.description,
          required_skills: internship.required_skills.join(', '),
          location: internship.location,
          stipend: internship.stipend,
          duration: internship.duration,
          applicationDeadline: internship.applicationDeadline ? new Date(internship.applicationDeadline).toISOString().split('T')[0] : '',
        });
        setLoading(false);
      } catch (error) {
        alert('Failed to load internship data');
        navigate('/dashboard');
      }
    };
    fetchInternship();
  }, [id, navigate]);

  if (user?.role !== 'Employer') return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div></div>;

  if (loading) return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div></div>;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        required_skills: formData.required_skills.split(',').map(s => s.trim()),
        applicationDeadline: formData.applicationDeadline ? new Date(formData.applicationDeadline) : null,
      };
      await axios.put(`${API_URL}/api/internships/${id}`, data);
      alert('Internship updated successfully!');
      localStorage.setItem('refreshInternships', 'true');
      navigate('/dashboard');
    } catch (error) {
      alert('Failed to update internship. Please try again.');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-2xl"
      >
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <FaBriefcase className="text-4xl text-blue-600 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-900">Edit Internship</h2>
          <p className="text-gray-600 mt-2">Update the details of your internship opportunity.</p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.div variants={containerVariants} initial="hidden" animate="visible">
            <motion.div variants={itemVariants} className="mb-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Basic Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Internship Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Software Engineering Intern"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Describe the internship role, responsibilities, and requirements..."
                  />
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="mb-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Skills & Requirements</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Required Skills</label>
                <input
                  type="text"
                  name="required_skills"
                  value={formData.required_skills}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., JavaScript, React, Node.js (comma separated)"
                />
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="mb-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Location & Compensation</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., New York, NY or Remote"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stipend</label>
                  <input
                    type="text"
                    name="stipend"
                    value={formData.stipend}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., $2000/month"
                  />
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Duration & Deadline</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Internship Duration</label>
                  <input
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 3 months, Summer 2024"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Application Deadline</label>
                  <input
                    type="date"
                    name="applicationDeadline"
                    value={formData.applicationDeadline}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg hover:from-blue-600 hover:to-purple-700 transition duration-200 flex items-center justify-center space-x-2 shadow-lg"
          >
            <FaBriefcase />
            <span>Update Internship</span>
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default EditInternship;
