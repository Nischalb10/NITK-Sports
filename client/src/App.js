import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Container as MUIContainer, Box } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import Header from './components/Header';
import Footer from './components/Footer';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ProfileScreen from './screens/ProfileScreen';
import EquipmentScreen from './screens/EquipmentScreen';
import EquipmentDetailScreen from './screens/EquipmentDetailScreen';
import EquipmentBookingScreen from './screens/EquipmentBookingScreen';
import InfrastructureScreen from './screens/InfrastructureScreen';
import InfrastructureDetailScreen from './screens/InfrastructureDetailScreen';
import InfrastructureBookingScreen from './screens/InfrastructureBookingScreen';
import AdminDashboardScreen from './screens/AdminDashboardScreen';
import AdminEquipmentScreen from './screens/AdminEquipmentScreen';
import AdminInfrastructureScreen from './screens/AdminInfrastructureScreen';
import AdminBookingsScreen from './screens/AdminBookingsScreen';
import AdminUsersScreen from './screens/AdminUsersScreen';
import UserBookingsScreen from './screens/UserBookingsScreen';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    }
  }, []);

  // Protected route component
  const ProtectedRoute = ({ children }) => {
    return user ? children : <Navigate to="/login" />;
  };

  // Admin route component
  const AdminRoute = ({ children }) => {
    return user && user.role === 'admin' ? children : <Navigate to="/" />;
  };

  return (
    <>
      <Header user={user} setUser={setUser} />
      <main className="py-3">
        <MUIContainer maxWidth="lg">
          <AnimatePresence mode="wait">
            <motion.div
              key={window.location.pathname}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.5 }}
            >
              <Routes>
                <Route path="/" element={<HomeScreen />} />
                <Route path="/login" element={<LoginScreen setUser={setUser} />} />
                <Route path="/register" element={<RegisterScreen setUser={setUser} />} />
                
                {/* Protected Routes */}
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <ProfileScreen user={user} setUser={setUser} />
                  </ProtectedRoute>
                } />
                
                <Route path="/equipment" element={
                  <ProtectedRoute>
                    <EquipmentScreen />
                  </ProtectedRoute>
                } />
                
                <Route path="/equipment/:id" element={
                  <ProtectedRoute>
                    <EquipmentDetailScreen />
                  </ProtectedRoute>
                } />
                
                <Route path="/equipment/:id/book" element={
                  <ProtectedRoute>
                    <EquipmentBookingScreen user={user} />
                  </ProtectedRoute>
                } />
                
                <Route path="/infrastructure" element={
                  <ProtectedRoute>
                    <InfrastructureScreen />
                  </ProtectedRoute>
                } />
                
                <Route path="/infrastructure/:id" element={
                  <ProtectedRoute>
                    <InfrastructureDetailScreen />
                  </ProtectedRoute>
                } />
                
                <Route path="/infrastructure/:id/book" element={
                  <ProtectedRoute>
                    <InfrastructureBookingScreen user={user} />
                  </ProtectedRoute>
                } />
                
                <Route path="/bookings" element={
                  <ProtectedRoute>
                    <UserBookingsScreen user={user} />
                  </ProtectedRoute>
                } />
                
                {/* Admin Routes */}
                <Route path="/admin" element={
                  <AdminRoute>
                    <AdminDashboardScreen />
                  </AdminRoute>
                } />
                
                <Route path="/admin/equipment" element={
                  <AdminRoute>
                    <AdminEquipmentScreen />
                  </AdminRoute>
                } />
                
                <Route path="/admin/infrastructure" element={
                  <AdminRoute>
                    <AdminInfrastructureScreen />
                  </AdminRoute>
                } />
                
                <Route path="/admin/bookings" element={
                  <AdminRoute>
                    <AdminBookingsScreen />
                  </AdminRoute>
                } />
                
                <Route path="/admin/users" element={
                  <AdminRoute>
                    <AdminUsersScreen />
                  </AdminRoute>
                } />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </MUIContainer>
      </main>
      <Footer />
    </>
  );
}

export default App;
