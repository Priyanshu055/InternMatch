import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import axios from 'axios';

const CandidateProfile = () => {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState({ skills: [], education: '', experience: '', resume_url: '' });
  const [skillsInput, setSkillsInput] = useState('');
  const [file, setFile] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/profiles');
      setProfile(res.data);
      setSkillsInput(res.data.skills.join(', '));
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    try {
      const skills = skillsInput.split(',').map(s => s.trim());
      await axios.post('http://localhost:5000/api/profiles', { skills, education: profile.education, experience: profile.experience });
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

  if (user?.role !== 'Candidate') return <div>Access denied</div>;

  return (
    <div>
      <h2>Your Profile</h2>
      <form onSubmit={updateProfile}>
        <label>Skills (comma separated):</label>
        <input type="text" value={skillsInput} onChange={(e) => setSkillsInput(e.target.value)} />
        <label>Education:</label>
        <input type="text" value={profile.education} onChange={(e) => setProfile({ ...profile, education: e.target.value })} />
        <label>Experience:</label>
        <textarea value={profile.experience} onChange={(e) => setProfile({ ...profile, experience: e.target.value })} />
        <button type="submit">Update Profile</button>
      </form>

      <h3>Upload Resume</h3>
      <form onSubmit={uploadResume}>
        <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => setFile(e.target.files[0])} />
        <button type="submit">Upload</button>
      </form>
      {profile.resume_url && <a href={`http://localhost:5000${profile.resume_url}`} target="_blank" rel="noopener noreferrer">View Resume</a>}
    </div>
  );
};

export default CandidateProfile;
