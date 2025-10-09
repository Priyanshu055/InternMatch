import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaSignOutAlt, FaUser, FaBriefcase, FaPaperPlane, FaCheck, FaTimes, FaPercentage } from 'react-icons/fa';
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
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <motion.h1
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="text-2xl font-bold text-gray-900"
            >
              Internship Portal
            </motion.h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user.name}</span>
              <button
                onClick={logout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200 flex items-center space-x-2"
              >
                <FaSignOutAlt />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {user.role === 'Candidate' && (
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-between items-center"
            >
              <h2 className="text-3xl font-bold text-gray-900">Recommended Internships</h2>
              <Link
                to="/profile"
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200 flex items-center space-x-2"
              >
                <FaUser />
                <span>Update Profile</span>
              </Link>
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
                  whileHover={{ scale: 1.05 }}
                  className="bg-white p-6 rounded-lg shadow-md"
                >
                  <h3 className="text-xl font-semibold mb-2">{internship.title}</h3>
                  <p className="text-gray-600 mb-4">{internship.description}</p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-500">{internship.location}</span>
                    <span className="text-sm font-medium text-green-600 flex items-center">
                      <FaPercentage className="mr-1" />
                      {internship.matchScore}% Match
                    </span>
                  </div>
                  <button
                    onClick={() => applyForInternship(internship._id)}
                    className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200 flex items-center justify-center space-x-2"
                  >
                    <FaPaperPlane />
                    <span>Apply</span>
                  </button>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Applications</h2>
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
                    className="bg-white p-6 rounded-lg shadow-md"
                  >
                    <h3 className="text-xl font-semibold mb-2">{app.internship_id.title}</h3>
                    <p className={`text-sm font-medium ${app.status === 'Approved' ? 'text-green-600' : app.status === 'Rejected' ? 'text-red-600' : 'text-yellow-600'}`}>
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
              <h2 className="text-3xl font-bold text-gray-900">Applications for Your Internships</h2>
              <Link
                to="/post-internship"
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-200 flex items-center space-x-2"
              >
                <FaBriefcase />
                <span>Post Internship</span>
              </Link>
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
                  className="bg-white p-6 rounded-lg shadow-md"
                >
                  <h3 className="text-xl font-semibold mb-2">{app.candidate_id.name}</h3>
                  <p className="text-gray-600 mb-2">{app.internship_id.title}</p>
                  <p className={`text-sm font-medium mb-4 ${app.status === 'Approved' ? 'text-green-600' : app.status === 'Rejected' ? 'text-red-600' : 'text-yellow-600'}`}>
                    Status: {app.status}
                  </p>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => updateApplicationStatus(app._id, 'Approved')}
                      className="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition duration-200 flex items-center justify-center space-x-1"
                    >
                      <FaCheck />
                      <span>Approve</span>
                    </button>
                    <button
                      onClick={() => updateApplicationStatus(app._id, 'Rejected')}
                      className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition duration-200 flex items-center justify-center space-x-1"
                    >
                      <FaTimes />
                      <span>Reject</span>
                    </button>
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
