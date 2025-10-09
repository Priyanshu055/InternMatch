import React, { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PostInternship = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    required_skills: '',
    location: '',
    stipend: '',
    duration: '',
  });

  if (user?.role !== 'Employer') return <div>Access denied</div>;

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        required_skills: formData.required_skills.split(',').map(s => s.trim()),
      };
      await axios.post('http://localhost:5000/api/internships', data);
      alert('Internship posted');
      navigate('/dashboard');
    } catch (error) {
      alert('Failed to post internship');
    }
  };

  return (
    <div>
      <h2>Post Internship</h2>
      <form onSubmit={handleSubmit}>
        <input name="title" placeholder="Title" value={formData.title} onChange={handleChange} required />
        <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} required />
        <input name="required_skills" placeholder="Required Skills (comma separated)" value={formData.required_skills} onChange={handleChange} required />
        <input name="location" placeholder="Location" value={formData.location} onChange={handleChange} />
        <input name="stipend" placeholder="Stipend" value={formData.stipend} onChange={handleChange} />
        <input name="duration" placeholder="Duration" value={formData.duration} onChange={handleChange} />
        <button type="submit">Post</button>
      </form>
    </div>
  );
};

export default PostInternship;
