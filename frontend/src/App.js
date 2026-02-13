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
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Zones from './pages/Zones';
import Watering from './pages/Watering';
import Pesticide from './pages/Pesticide';
import Trimming from './pages/Trimming';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/zones" element={<Zones />} />
              <Route path="/watering" element={<Watering />} />
              <Route path="/pesticide" element={<Pesticide />} />
              <Route path="/trimming" element={<Trimming />} />
            </Route>
          </Route>

          {/* Catch all redirect to dashboard or login */}
          <Route path="*" element={<Navigate to="/" replace />} />
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
