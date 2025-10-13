import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AuthContext from './context/AuthContext';
import Home from './pages/Home';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './pages/Dashboard';
import CandidateProfile from './pages/CandidateProfile';
import PostInternship from './pages/PostInternship';
import EditInternship from './pages/EditInternship';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div></div>;
  if (!user) {
    return <Navigate to="/login" />;
  }
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />
          <Route path="/profile" element={
            <PrivateRoute>
              <CandidateProfile />
            </PrivateRoute>
          } />
          <Route path="/post-internship" element={
            <PrivateRoute>
              <PostInternship />
            </PrivateRoute>
          } />
          <Route path="/edit-internship/:id" element={
            <PrivateRoute>
              <EditInternship />
            </PrivateRoute>
          } />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
