import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

// Components
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import AdminLogin from './pages/AdminLogin';
import UserLogin from './pages/UserLogin';
import Unauthorized from './pages/Unauthorized';
import Dashboard from './pages/Dashboard';
import Zones from './pages/Zones';
import Watering from './pages/Watering';
import Pesticide from './pages/Pesticide';
import Trimming from './pages/Trimming';
import Waste from './pages/Waste';
import UserDashboard from './pages/UserDashboard';
import Suggestions from './pages/Suggestions';
import UserSuggestions from './pages/UserSuggestions';
import Register from './pages/Register';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Navigate to="/user/login" replace />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/user/login" element={<UserLogin />} />
          <Route path="/register" element={<Register />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route element={<Layout portal="Admin" />}>
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/admin/zones" element={<Zones />} />
              <Route path="/admin/watering" element={<Watering />} />
              <Route path="/admin/pesticide" element={<Pesticide />} />
              <Route path="/admin/trimming" element={<Trimming />} />
              <Route path="/admin/waste" element={<Waste />} />
              <Route path="/admin/suggestions" element={<Suggestions />} />
            </Route>
          </Route>

          {/* User Routes */}
          <Route element={<ProtectedRoute allowedRoles={['user']} />}>
            <Route element={<Layout portal="User" />}>
              <Route path="/user/dashboard" element={<UserDashboard />} />
              <Route path="/user/zones" element={<Zones viewOnly={true} />} />
              <Route path="/user/watering" element={<Watering />} />
              <Route path="/user/pesticide" element={<Pesticide />} />
              <Route path="/user/trimming" element={<Trimming />} />
              <Route path="/user/waste" element={<Waste />} />
              <Route path="/user/suggestions" element={<UserSuggestions />} />
            </Route>
          </Route>

          {/* Catch all redirect */}
          <Route path="*" element={<Navigate to="/unauthorized" replace />} />
        </Routes>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </Router>
    </AuthProvider>
  );
}

export default App;
