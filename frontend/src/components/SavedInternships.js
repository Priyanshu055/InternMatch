import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const SavedInternships = () => {
  const [savedInternships, setSavedInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();  // Use the hook here to get token

  useEffect(() => {
    const fetchSavedInternships = async () => {
      try {
        const config = {
          headers: { 'Authorization': `Bearer ${token}` }
        };
        const response = await axios.get('http://localhost:5000/api/internships/saved', config);
        setSavedInternships(response.data);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error('Server responded with error:', error.response.data);
            console.error('Status:', error.response.status);
          } else if (error.request) {
            // The request was made but no response was received
            console.error('No response received:', error.request);
          } else {
            // Something happened in setting up the request that triggered an Error
            console.error('Error setting up request:', error.message);
          }
        } else {
          console.error('An unexpected error occurred:', error);
        }
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchSavedInternships();
    }
  }, [token]);

  if (loading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Saved Internships</h2>
      {savedInternships.length === 0 ? (
        <p>No saved internships yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {savedInternships.map((saved) => (
            <div key={saved._id} className="border rounded-lg p-4 shadow-md">
              <div className="flex items-center mb-2">
                {saved.internship_id.company_id.profileImage && (
                  <img
                    src={`http://localhost:5000/uploads/${saved.internship_id.company_id.profileImage}`}
                    alt={`${saved.internship_id.company_id.name} logo`}
                    className="w-10 h-10 rounded-full mr-3"
                  />
                )}
                <div>
                  <h3 className="text-xl font-bold">{saved.internship_id.title}</h3>
                  <p className="text-gray-600">{saved.internship_id.company_id.name}</p>
                </div>
              </div>
              <p className="text-gray-500 mb-2">{saved.internship_id.location}</p>
              <p className="text-gray-500 mb-4">{saved.internship_id.stipend}</p>
              <button
                onClick={() => window.location.href = `/internship/${saved.internship_id._id}`}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedInternships;