import React, { useContext, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaSignOutAlt, FaUser, FaBriefcase, FaPaperPlane, FaCheck, FaTimes, FaPercentage, FaRocket, FaUsers, FaSearch, FaFilter, FaBookmark, FaBell, FaChartBar, FaEnvelope, FaGraduationCap, FaHome, FaList, FaStar, FaCog } from 'react-icons/fa';
import AuthContext from '../context/AuthContext';
import ApplyModal from '../components/ApplyModal';
import axios from 'axios';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [internships, setInternships] = useState([]);
  const [allInternships, setAllInternships] = useState([]);
  const [applications, setApplications] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [savedInternships, setSavedInternships] = useState([]);
  const [employerInternships, setEmployerInternships] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loadingInternships, setLoadingInternships] = useState(false);
  const [loadingAllInternships, setLoadingAllInternships] = useState(false);
  const [loadingApplications, setLoadingApplications] = useState(false);
  const [loadingSavedInternships, setLoadingSavedInternships] = useState(false);
  const [loadingEmployerApplications, setLoadingEmployerApplications] = useState(false);
  const [loadingEmployerInternships, setLoadingEmployerInternships] = useState(false);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [selectedInternship, setSelectedInternship] = useState(null);

  useEffect(() => {
    if (user?.role === 'Candidate') {
      fetchRecommendedInternships();
      fetchAllInternships();
      fetchApplications();
      fetchSavedInternships();
      fetchMessages();
    } else if (user?.role === 'Employer') {
      fetchEmployerApplications();
      fetchEmployerInternships();
      localStorage.removeItem('refreshInternships');
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

  const fetchAllInternships = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/internships');
      setAllInternships(res.data);
    } catch (error) {
      console.error('Error fetching all internships:', error);
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
    setLoadingEmployerApplications(true);
    try {
      const res = await axios.get('http://localhost:5000/api/applications/employer');
      setApplications(res.data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoadingEmployerApplications(false);
    }
  };

  const fetchEmployerInternships = async () => {
    setLoadingEmployerInternships(true);
    try {
      const res = await axios.get('http://localhost:5000/api/internships/employer');
      setEmployerInternships(res.data);
    } catch (error) {
      console.error('Error fetching employer internships:', error);
    } finally {
      setLoadingEmployerInternships(false);
    }
  };

  const fetchSavedInternships = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/internships/saved');
      setSavedInternships(res.data);
    } catch (error) {
      console.error('Error fetching saved internships:', error);
    }
  };

  const fetchMessages = () => {
    setMessages([
      { id: 1, from: 'TechCorp', message: 'Thank you for applying! We will review your application soon.', unread: true, date: new Date() },
      { id: 2, from: 'Innovate Ltd', message: 'Your profile looks great. We might have a position for you.', unread: false, date: new Date(Date.now() - 86400000) },
      { id: 3, from: 'StartupXYZ', message: 'Interview scheduled for next week.', unread: true, date: new Date(Date.now() - 172800000) }
    ]);
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

  const saveInternship = async (internshipId) => {
    try {
      await axios.post('http://localhost:5000/api/internships/save', { internship_id: internshipId });
      alert('Saved successfully');
      fetchSavedInternships();
    } catch (error) {
      alert('Save failed');
    }
  };

  const unsaveInternship = async (internshipId) => {
    try {
      await axios.delete(`http://localhost:5000/api/internships/saved/${internshipId}`);
      alert('Unsaved successfully');
      fetchSavedInternships();
    } catch (error) {
      alert('Unsave failed');
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

  const deleteInternship = async (internshipId) => {
    if (window.confirm('Are you sure you want to delete this internship?')) {
      try {
        await axios.delete(`http://localhost:5000/api/internships/${internshipId}`);
        alert('Internship deleted successfully');
        fetchEmployerInternships();
      } catch (error) {
        alert('Delete failed');
      }
    }
  };

  const extendDeadline = async (internshipId, currentDeadline) => {
    const newDeadline = new Date(currentDeadline || Date.now());
    newDeadline.setDate(newDeadline.getDate() + 7);
    try {
      await axios.put(`http://localhost:5000/api/internships/${internshipId}`, { applicationDeadline: newDeadline });
      alert('Deadline extended by 7 days');
      fetchEmployerInternships();
    } catch (error) {
      alert('Extend failed');
    }
  };

  const filteredInternships = allInternships.filter(internship =>
    internship.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterLocation === '' || internship.location.toLowerCase().includes(filterLocation.toLowerCase()))
  );

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

  const sidebarItems = user.role === 'Candidate' ? [
    { id: 'overview', label: 'Overview', icon: FaHome },
    { id: 'browse', label: 'Browse Internships', icon: FaSearch },
    { id: 'applications', label: 'My Applications', icon: FaList },
    { id: 'saved', label: 'Saved', icon: FaBookmark },
    { id: 'messages', label: 'Messages', icon: FaEnvelope },
    { id: 'profile', label: 'Profile', icon: FaUser },
    { id: 'resources', label: 'Resources', icon: FaGraduationCap },
  ] : [
    { id: 'overview', label: 'Overview', icon: FaHome },
    { id: 'post', label: 'Post Internship', icon: FaBriefcase },
    { id: 'internships', label: 'My Internships', icon: FaBriefcase },
    { id: 'applications', label: 'Manage Applications', icon: FaList },
    { id: 'analytics', label: 'Analytics', icon: FaChartBar },
    { id: 'messages', label: 'Messages', icon: FaEnvelope },
    { id: 'profile', label: 'Profile', icon: FaUser },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 relative overflow-hidden flex">
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

      {/* Sidebar */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        className="w-64 bg-white shadow-xl relative z-20"
      >
        <div className="p-6">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center space-x-2 mb-8"
          >
            <FaRocket className="text-3xl text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">InternMatch</span>
          </motion.div>
          <nav className="space-y-2">
            {sidebarItems.map((item, index) => (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, backgroundColor: '#f3f4f6' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition duration-200 ${
                  activeTab === item.id ? 'bg-blue-100 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <item.icon />
                <span>{item.label}</span>
              </motion.button>
            ))}
          </nav>
        </div>
        <div className="absolute bottom-6 left-6 right-6">
          <motion.button
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={logout}
            className="w-full bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200 flex items-center space-x-2"
          >
            <FaSignOutAlt />
            <span>Logout</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 relative z-10">
        <header className="bg-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <motion.h1
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="text-3xl font-bold text-gray-900"
              >
                {sidebarItems.find(item => item.id === activeTab)?.label}
              </motion.h1>
              <div className="flex items-center space-x-4">
                <motion.button
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  whileHover={{ scale: 1.05 }}
                  className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition duration-200"
                >
                  <FaBell className="text-gray-600" />
                </motion.button>
                <motion.span
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-gray-700"
                >
                  Welcome, {user.name}
                </motion.span>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {user.role === 'Candidate' && (
            <>
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6"
                  >
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="bg-white p-6 rounded-xl shadow-xl border border-gray-200"
                    >
                      <h3 className="text-2xl font-bold text-blue-600">{applications.length}</h3>
                      <p className="text-gray-600">Applications Submitted</p>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="bg-white p-6 rounded-xl shadow-xl border border-gray-200"
                    >
                      <h3 className="text-2xl font-bold text-green-600">{applications.filter(app => app.status === 'Approved').length}</h3>
                      <p className="text-gray-600">Approved</p>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="bg-white p-6 rounded-xl shadow-xl border border-gray-200"
                    >
                      <h3 className="text-2xl font-bold text-purple-600">{savedInternships.length}</h3>
                      <p className="text-gray-600">Saved Internships</p>
                    </motion.div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Recommended for You</h2>
                    <motion.div
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                      {internships.slice(0, 3).map((internship, index) => (
                        <motion.div
                          key={internship._id}
                          variants={itemVariants}
                          whileHover={{ scale: 1.05, y: -5 }}
                          className="bg-white p-6 rounded-xl shadow-xl border border-gray-200"
                        >
                          <h3 className="text-xl font-semibold mb-2 text-gray-800">{internship.title}</h3>
                          <p className="text-gray-600 mb-4">{internship.description.substring(0, 100)}...</p>
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
                            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition duration-200 flex items-center justify-center space-x-2 shadow-lg"
                          >
                            <FaPaperPlane />
                            <span>Apply</span>
                          </motion.button>
                        </motion.div>
                      ))}
                    </motion.div>
                  </motion.div>
                </div>
              )}

              {activeTab === 'browse' && (
                <div className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-6 rounded-xl shadow-xl border border-gray-200"
                  >
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Search & Filter Internships</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="relative">
                        <FaSearch className="absolute left-3 top-3 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search by title, company..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div className="relative">
                        <FaFilter className="absolute left-3 top-3 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Filter by location..."
                          value={filterLocation}
                          onChange={(e) => setFilterLocation(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </motion.div>
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  >
                    {filteredInternships.map((internship, index) => (
                      <motion.div
                        key={internship._id}
                        variants={itemVariants}
                        whileHover={{ scale: 1.05, y: -5 }}
                        className="bg-white p-6 rounded-xl shadow-xl border border-gray-200"
                      >
                        <h3 className="text-xl font-semibold mb-2 text-gray-800">{internship.title}</h3>
                        <p className="text-gray-600 mb-4">{internship.description.substring(0, 100)}...</p>
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-sm text-gray-500">{internship.location}</span>
                          <span className="text-sm font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                            {internship.company_id.name}
                          </span>
                        </div>
                        <div className="flex space-x-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => applyForInternship(internship._id)}
                            className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition duration-200 flex items-center justify-center space-x-2 shadow-lg"
                          >
                            <FaPaperPlane />
                            <span>Apply</span>
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition duration-200"
                          >
                            <FaBookmark className="text-gray-600" />
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              )}

              {activeTab === 'applications' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                    <FaList className="text-green-500" />
                    <span>Your Applications</span>
                  </h2>
                  {loadingApplications ? (
                    <div className="flex justify-center items-center h-32">
                      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
                    </div>
                  ) : (
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
                          <p className="text-gray-600 mb-2">{app.internship_id.company_id.name}</p>
                          <p className={`text-sm font-medium mb-4 px-3 py-1 rounded-full inline-block ${app.status === 'Approved' ? 'text-green-600 bg-green-100' : app.status === 'Rejected' ? 'text-red-600 bg-red-100' : 'text-yellow-600 bg-yellow-100'}`}>
                            Status: {app.status}
                          </p>
                          <div className="text-sm text-gray-500">
                            Applied on: {new Date(app.createdAt).toLocaleDateString()}
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </motion.div>
              )}

              {activeTab === 'saved' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                    <FaBookmark className="text-purple-500" />
                    <span>Saved Internships</span>
                  </h2>
                  {loadingSavedInternships ? (
                    <div className="flex justify-center items-center h-32">
                      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
                    </div>
                  ) : savedInternships.length > 0 ? (
                    <motion.div
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                      {savedInternships.map((internship, index) => (
                        <motion.div
                          key={internship._id}
                          variants={itemVariants}
                          whileHover={{ scale: 1.05, y: -5 }}
                          className="bg-white p-6 rounded-xl shadow-xl border border-gray-200"
                        >
                          <h3 className="text-xl font-semibold mb-2 text-gray-800">{internship.title}</h3>
                          <p className="text-gray-600 mb-4">{internship.description.substring(0, 100)}...</p>
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-sm text-gray-500">{internship.location}</span>
                          <span className="text-sm font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                            {internship.company_id.name}
                          </span>
                          </div>
                          <div className="flex space-x-2">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => applyForInternship(internship._id)}
                              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition duration-200 flex items-center justify-center space-x-2 shadow-lg"
                            >
                              <FaPaperPlane />
                              <span>Apply</span>
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => unsaveInternship(internship._id)}
                              className="p-2 bg-red-100 rounded-lg hover:bg-red-200 transition duration-200"
                            >
                              <FaTimes className="text-red-600" />
                            </motion.button>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  ) : (
                    <p className="text-gray-600">No saved internships yet. Start browsing and save interesting opportunities!</p>
                  )}
                </motion.div>
              )}

              {activeTab === 'messages' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                    <FaEnvelope className="text-blue-500" />
                    <span>Messages</span>
                  </h2>
                  {messages.length > 0 ? (
                    <motion.div
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                      className="space-y-4"
                    >
                      {messages.map((msg, index) => (
                        <motion.div
                          key={msg.id}
                          variants={itemVariants}
                          whileHover={{ scale: 1.02 }}
                          className={`bg-white p-6 rounded-xl shadow-xl border border-gray-200 ${msg.unread ? 'border-l-4 border-l-blue-500' : ''}`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-lg font-semibold text-gray-800">{msg.from}</h3>
                            <span className="text-sm text-gray-500">{msg.date.toLocaleDateString()}</span>
                          </div>
                          <p className="text-gray-600 mb-4">{msg.message}</p>
                          {msg.unread && (
                            <span className="inline-block bg-blue-100 text-blue-600 text-xs font-medium px-2 py-1 rounded-full">
                              Unread
                            </span>
                          )}
                        </motion.div>
                      ))}
                    </motion.div>
                  ) : (
                    <p className="text-gray-600">No messages yet. Messages from employers will appear here.</p>
                  )}
                </motion.div>
              )}

              {activeTab === 'profile' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center"
                >
                  <Link
                    to="/profile"
                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-purple-700 transition duration-200 flex items-center space-x-2 shadow-lg inline-flex"
                  >
                    <FaUser />
                    <span>Go to Profile Page</span>
                  </Link>
                </motion.div>
              )}

              {activeTab === 'resources' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                    <FaGraduationCap className="text-green-500" />
                    <span>Learning Resources</span>
                  </h2>
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  >
                    <motion.div
                      variants={itemVariants}
                      whileHover={{ scale: 1.05 }}
                      className="bg-white p-6 rounded-xl shadow-xl border border-gray-200"
                    >
                      <h3 className="text-xl font-semibold mb-2">Resume Writing Tips</h3>
                      <p className="text-gray-600 mb-4">Learn how to create a standout resume for internship applications.</p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
                      >
                        Read More
                      </motion.button>
                    </motion.div>
                    <motion.div
                      variants={itemVariants}
                      whileHover={{ scale: 1.05 }}
                      className="bg-white p-6 rounded-xl shadow-xl border border-gray-200"
                    >
                      <h3 className="text-xl font-semibold mb-2">Interview Preparation</h3>
                      <p className="text-gray-600 mb-4">Master the art of interviewing with tips from industry experts.</p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
                      >
                        Read More
                      </motion.button>
                    </motion.div>
                    <motion.div
                      variants={itemVariants}
                      whileHover={{ scale: 1.05 }}
                      className="bg-white p-6 rounded-xl shadow-xl border border-gray-200"
                    >
                      <h3 className="text-xl font-semibold mb-2">Career Resources</h3>
                      <p className="text-gray-600 mb-4">Explore career paths, industry insights, and professional development.</p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
                      >
                        Read More
                      </motion.button>
                    </motion.div>
                    <motion.div
                      variants={itemVariants}
                      whileHover={{ scale: 1.05 }}
                      className="bg-white p-6 rounded-xl shadow-xl border border-gray-200"
                    >
                      <h3 className="text-xl font-semibold mb-2">Networking Strategies</h3>
                      <p className="text-gray-600 mb-4">Build professional connections and expand your network effectively.</p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
                      >
                        Read More
                      </motion.button>
                    </motion.div>
                    <motion.div
                      variants={itemVariants}
                      whileHover={{ scale: 1.05 }}
                      className="bg-white p-6 rounded-xl shadow-xl border border-gray-200"
                    >
                      <h3 className="text-xl font-semibold mb-2">Skill Development</h3>
                      <p className="text-gray-600 mb-4">Enhance your technical and soft skills for better job prospects.</p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
                      >
                        Read More
                      </motion.button>
                    </motion.div>
                    <motion.div
                      variants={itemVariants}
                      whileHover={{ scale: 1.05 }}
                      className="bg-white p-6 rounded-xl shadow-xl border border-gray-200"
                    >
                      <h3 className="text-xl font-semibold mb-2">Internship Success Stories</h3>
                      <p className="text-gray-600 mb-4">Read inspiring stories from successful interns and learn from their experiences.</p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
                      >
                        Read More
                      </motion.button>
                    </motion.div>
                  </motion.div>
                </motion.div>
              )}

            </>
          )}

          {user.role === 'Employer' && (
            <>
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6"
                  >
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="bg-white p-6 rounded-xl shadow-xl border border-gray-200"
                    >
                      <h3 className="text-2xl font-bold text-blue-600">{applications.length}</h3>
                      <p className="text-gray-600">Total Applications</p>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="bg-white p-6 rounded-xl shadow-xl border border-gray-200"
                    >
                      <h3 className="text-2xl font-bold text-green-600">{applications.filter(app => app.status === 'Approved').length}</h3>
                      <p className="text-gray-600">Approved</p>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="bg-white p-6 rounded-xl shadow-xl border border-gray-200"
                    >
                      <h3 className="text-2xl font-bold text-purple-600">{employerInternships.length}</h3>
                      <p className="text-gray-600">Posted Internships</p>
                    </motion.div>
                  </motion.div>
                </div>
              )}

              {activeTab === 'post' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center"
                >
                  <Link
                    to="/post-internship"
                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-purple-700 transition duration-200 flex items-center space-x-2 shadow-lg inline-flex"
                  >
                    <FaBriefcase />
                    <span>Post a New Internship</span>
                  </Link>
                </motion.div>
              )}

              {activeTab === 'internships' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                    <FaBriefcase className="text-blue-500" />
                    <span>My Internships</span>
                  </h2>
                  {loadingEmployerInternships ? (
                    <div className="flex justify-center items-center h-32">
                      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
                    </div>
                  ) : employerInternships.length > 0 ? (
                    <motion.div
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                      {employerInternships.map((internship, index) => (
                        <motion.div
                          key={internship._id}
                          variants={itemVariants}
                          whileHover={{ scale: 1.05, y: -5 }}
                          className="bg-white p-6 rounded-xl shadow-xl border border-gray-200"
                        >
                          <h3 className="text-xl font-semibold mb-2 text-gray-800">{internship.title}</h3>
                          <p className="text-gray-600 mb-4">{internship.description.substring(0, 100)}...</p>
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-sm text-gray-500">{internship.location}</span>
                          <span className="text-sm font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                            {internship.company_id.name}
                          </span>
                          </div>
                          <div className="flex space-x-2">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => navigate(`/edit-internship/${internship._id}`)}
                              className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200"
                            >
                              Edit
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => deleteInternship(internship._id)}
                              className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition duration-200"
                            >
                              Delete
                            </motion.button>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  ) : (
                    <p className="text-gray-600">No internships posted yet. Start posting to attract candidates!</p>
                  )}
                </motion.div>
              )}

              {activeTab === 'applications' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                    <FaList className="text-green-500" />
                    <span>Manage Applications</span>
                  </h2>
                  {loadingEmployerApplications ? (
                    <div className="flex justify-center items-center h-32">
                      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
                    </div>
                  ) : (
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
                          <p className="text-gray-600 mb-2">{app.candidate_id.name}</p>
                          <p className={`text-sm font-medium mb-4 px-3 py-1 rounded-full inline-block ${app.status === 'Approved' ? 'text-green-600 bg-green-100' : app.status === 'Rejected' ? 'text-red-600 bg-red-100' : 'text-yellow-600 bg-yellow-100'}`}>
                            Status: {app.status}
                          </p>
                          <div className="flex space-x-2">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => updateApplicationStatus(app._id, 'Approved')}
                              className="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition duration-200"
                            >
                              Approve
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => updateApplicationStatus(app._id, 'Rejected')}
                              className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition duration-200"
                            >
                              Reject
                            </motion.button>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </motion.div>
              )}

              {activeTab === 'analytics' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                    <FaChartBar className="text-blue-500" />
                    <span>Analytics</span>
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="bg-white p-6 rounded-xl shadow-xl border border-gray-200"
                    >
                      <h3 className="text-xl font-semibold mb-2">Application Trends</h3>
                      <p className="text-gray-600">View application statistics over time.</p>
                      <div className="mt-4 h-32 bg-gray-100 rounded flex items-center justify-center">Chart Placeholder</div>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="bg-white p-6 rounded-xl shadow-xl border border-gray-200"
                    >
                      <h3 className="text-xl font-semibold mb-2">Top Skills</h3>
                      <p className="text-gray-600">Most sought-after skills in applicants.</p>
                      <div className="mt-4 h-32 bg-gray-100 rounded flex items-center justify-center">Chart Placeholder</div>
                    </motion.div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'messages' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                    <FaEnvelope className="text-blue-500" />
                    <span>Messages</span>
                  </h2>
                  <p className="text-gray-600">Messages from candidates will appear here.</p>
                </motion.div>
              )}

              {activeTab === 'profile' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center"
                >
                  <Link
                    to="/profile"
                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-purple-700 transition duration-200 flex items-center space-x-2 shadow-lg inline-flex"
                  >
                    <FaUser />
                    <span>Go to Profile Page</span>
                  </Link>
                </motion.div>
              )}

            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
