import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaSignOutAlt, FaUser, FaBriefcase, FaPaperPlane, FaCheck, FaTimes, FaPercentage, FaRocket, FaUsers, FaSearch } from 'react-icons/fa';
import AuthContext from '../context/AuthContext';
import axios from 'axios';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [internships, setInternships] = useState([]);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    if (user?.role === 'Candidate') {
      fetchRecommendedInternships();
      fetchApplications();
    } else if (user?.role === 'Employer') {
      fetchEmployerApplications();
    }
  }, [user]);

  const fetchRecommendedInternships = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/internships/recommended');
      setInternships(res.data);
    } catch (error) {
      console.error('Error fetching internships:', error);
    }
  };

  const fetchApplications = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/applications/candidate');
      setApplications(res.data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  const fetchEmployerApplications = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/applications/employer');
      setApplications(res.data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  const applyForInternship = async (internshipId) => {
    try {
      await axios.post('http://localhost:5000/api/applications', { internship_id: internshipId });
      alert('Applied successfully');
      fetchApplications();
    } catch (error) {
      alert('Application failed');
    }
  };

  const updateApplicationStatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:5000/api/applications/${id}`, { status });
      alert('Status updated');
      fetchEmployerApplications();
    } catch (error) {
      alert('Update failed');
    }
  };

  if (!user) return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div></div>;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-20 left-10 w-20 h-20 bg-white opacity-10 rounded-full"
        />
        <motion.div
          animate={{
            x: [0, -80, 0],
            y: [0, 80, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-20 right-10 w-16 h-16 bg-white opacity-10 rounded-full"
        />
        <motion.div
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/2 left-1/4 w-12 h-12 bg-white opacity-5 rounded-full"
        />
      </div>

      <header className="bg-white shadow-lg relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="flex items-center space-x-2"
            >
              <FaRocket className="text-3xl text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">InternMatch</span>
            </motion.div>
            <div className="flex items-center space-x-4">
              <motion.span
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-gray-700"
              >
                Welcome, {user.name}
              </motion.span>
              <motion.button
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={logout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200 flex items-center space-x-2"
              >
                <FaSignOutAlt />
                <span>Logout</span>
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 relative z-10">
        {user.role === 'Candidate' && (
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-between items-center"
            >
              <motion.h2
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                className="text-4xl font-bold text-gray-900 flex items-center space-x-2"
              >
                <FaSearch className="text-blue-500" />
                <span>Recommended Internships</span>
              </motion.h2>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <Link
                  to="/profile"
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-purple-700 transition duration-200 flex items-center space-x-2 shadow-lg"
                >
                  <FaUser />
                  <span>Update Profile</span>
                </Link>
              </motion.div>
            </motion.div>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {internships.map((internship, index) => (
                <motion.div
                  key={internship._id}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-white p-6 rounded-xl shadow-xl border border-gray-200"
                >
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">{internship.title}</h3>
                  <p className="text-gray-600 mb-4">{internship.description}</p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-500">{internship.location}</span>
                    <span className="text-sm font-medium text-green-600 flex items-center bg-green-100 px-2 py-1 rounded-full">
                      <FaPercentage className="mr-1" />
                      {internship.matchScore}% Match
                    </span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => applyForInternship(internship._id)}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg hover:from-blue-600 hover:to-purple-700 transition duration-200 flex items-center justify-center space-x-2 shadow-lg"
                  >
                    <FaPaperPlane />
                    <span>Apply</span>
                  </motion.button>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <motion.h2
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.6, duration: 0.3 }}
                className="text-4xl font-bold text-gray-900 mb-4 flex items-center space-x-2"
              >
                <FaUsers className="text-green-500" />
                <span>Your Applications</span>
              </motion.h2>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {applications.map((app, index) => (
                  <motion.div
                    key={app._id}
                    variants={itemVariants}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="bg-white p-6 rounded-xl shadow-xl border border-gray-200"
                  >
                    <h3 className="text-xl font-semibold mb-2 text-gray-800">{app.internship_id.title}</h3>
                    <p className={`text-sm font-medium px-3 py-1 rounded-full inline-block ${app.status === 'Approved' ? 'text-green-600 bg-green-100' : app.status === 'Rejected' ? 'text-red-600 bg-red-100' : 'text-yellow-600 bg-yellow-100'}`}>
                      Status: {app.status}
                    </p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        )}

        {user.role === 'Employer' && (
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-between items-center"
            >
              <motion.h2
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                className="text-4xl font-bold text-gray-900 flex items-center space-x-2"
              >
                <FaBriefcase className="text-purple-500" />
                <span>Applications for Your Internships</span>
              </motion.h2>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <Link
                  to="/post-internship"
                  className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-green-600 hover:to-blue-700 transition duration-200 flex items-center space-x-2 shadow-lg"
                >
                  <FaBriefcase />
                  <span>Post Internship</span>
                </Link>
              </motion.div>
            </motion.div>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {applications.map((app, index) => (
                <motion.div
                  key={app._id}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-white p-6 rounded-xl shadow-xl border border-gray-200"
                >
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">{app.candidate_id.name}</h3>
                  <p className="text-gray-600 mb-2">{app.internship_id.title}</p>
                  <p className={`text-sm font-medium mb-4 px-3 py-1 rounded-full inline-block ${app.status === 'Approved' ? 'text-green-600 bg-green-100' : app.status === 'Rejected' ? 'text-red-600 bg-red-100' : 'text-yellow-600 bg-yellow-100'}`}>
                    Status: {app.status}
                  </p>
                  <div className="flex space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => updateApplicationStatus(app._id, 'Approved')}
                      className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-lg hover:from-green-600 hover:to-green-700 transition duration-200 flex items-center justify-center space-x-1 shadow-lg"
                    >
                      <FaCheck />
                      <span>Approve</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => updateApplicationStatus(app._id, 'Rejected')}
                      className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-3 rounded-lg hover:from-red-600 hover:to-red-700 transition duration-200 flex items-center justify-center space-x-1 shadow-lg"
                    >
                      <FaTimes />
                      <span>Reject</span>
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
