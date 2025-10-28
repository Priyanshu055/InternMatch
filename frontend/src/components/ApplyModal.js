import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { FaTimes, FaPaperPlane, FaFileUpload, FaRobot, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import AuthContext from '../context/AuthContext';
import axios from 'axios';

const ApplyModal = ({ internship, onClose, onApply }) => {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    cover_letter: '',
    resume_url: '',
    additional_info: '',
  });
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewResult, setReviewResult] = useState(null);
  const [showReview, setShowReview] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setResumeFile(e.target.files[0]);
  };

  const handleReview = async () => {
    if (!formData.cover_letter.trim()) {
      alert('Please enter a cover letter before reviewing.');
      return;
    }
    setReviewLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/api/applications/review', {
        cover_letter: formData.cover_letter,
        internship_id: internship._id,
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      setReviewResult(response.data);
      setShowReview(true);
    } catch (error) {
      console.error('Review error:', error);
      alert('Failed to review application. Please try again.');
    } finally {
      setReviewLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('You must be logged in to apply.');
        setLoading(false);
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append('internship_id', internship._id);
      formDataToSend.append('cover_letter', formData.cover_letter);
      formDataToSend.append('resume_url', formData.resume_url);
      formDataToSend.append('additional_info', formData.additional_info);
      if (resumeFile) {
        formDataToSend.append('resume', resumeFile);
      }

      await axios.post('http://localhost:5000/api/applications', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });

      // Auto-save the internship after applying
      await axios.post('http://localhost:5000/api/internships/save', { internship_id: internship._id }, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      alert('Applied successfully!');
      onApply();
      onClose();
    } catch (error) {
      console.error('Application error:', error);
      if (error.response) {
        alert(`Application failed: ${error.response.data.message}`);
      } else {
        alert('Application failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Apply for {internship.title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimes size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cover Letter</label>
            <textarea
              name="cover_letter"
              value={formData.cover_letter}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Tell us why you're interested in this internship..."
              required
            />
            <button
              type="button"
              onClick={handleReview}
              disabled={reviewLoading}
              className="mt-2 flex items-center space-x-2 text-blue-600 hover:text-blue-800 text-sm font-medium disabled:opacity-50"
            >
              <FaRobot />
              <span>{reviewLoading ? 'Analyzing...' : 'Get AI Review'}</span>
            </button>
          </div>

          {showReview && reviewResult && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-blue-50 border border-blue-200 rounded-lg p-4"
            >
              <div className="flex items-center space-x-2 mb-2">
                <FaRobot className="text-blue-600" />
                <h3 className="font-semibold text-blue-900">AI Review</h3>
              </div>
              <div className="space-y-2 text-sm">
                <p><strong>Enthusiasm:</strong> {reviewResult.analysis.enthusiasmLevel}</p>
                {reviewResult.analysis.redFlags.length > 0 && (
                  <div>
                    <p className="flex items-center space-x-1 text-red-600">
                      <FaExclamationTriangle />
                      <strong>Potential Issues:</strong>
                    </p>
                    <ul className="list-disc list-inside ml-4 text-red-600">
                      {reviewResult.analysis.redFlags.map((flag, index) => (
                        <li key={index}>{flag}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <div>
                  <p className="flex items-center space-x-1 text-green-600">
                    <FaCheckCircle />
                    <strong>Suggestions:</strong>
                  </p>
                  <p className="ml-4 text-gray-700">{reviewResult.analysis.aiFeedback}</p>
                </div>
              </div>
            </motion.div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Resume (Optional)</label>
            <div className="space-y-2">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <p className="text-xs text-gray-500">Or provide a URL below</p>
              <input
                type="url"
                name="resume_url"
                value={formData.resume_url}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://example.com/resume.pdf"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Additional Information (Optional)</label>
            <textarea
              name="additional_info"
              value={formData.additional_info}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Any additional information you'd like to share..."
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg hover:from-blue-600 hover:to-purple-700 transition duration-200 flex items-center justify-center space-x-2 shadow-lg disabled:opacity-50"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                <FaPaperPlane />
                <span>Submit Application</span>
              </>
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default ApplyModal;
