import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const { token } = JSON.parse(userInfo);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// User API
export const userAPI = {
  register: (userData) => api.post('/users/register', userData),
  login: (credentials) => api.post('/users/login', credentials),
  getProfile: () => api.get('/users/profile'),
  updateProfile: (userData) => api.put('/users/profile', userData),
  getAllUsers: () => api.get('/users'),
  updateUserRole: (userId, role) => api.put(`/users/${userId}/role`, { role })
};

// Equipment API
export const equipmentAPI = {
  getAllEquipment: () => api.get('/equipment'),
  getEquipmentById: (id) => api.get(`/equipment/${id}`),
  createEquipment: (equipmentData) => api.post('/equipment', equipmentData),
  updateEquipment: (id, equipmentData) => api.put(`/equipment/${id}`, equipmentData),
  deleteEquipment: (id) => api.delete(`/equipment/${id}`),
  bookEquipment: (bookingData) => api.post('/equipment/book', bookingData),
  getAllEquipmentBookings: () => api.get('/equipment/bookings/all'),
  getUserEquipmentBookings: () => api.get('/equipment/bookings/user'),
  updateBookingStatus: (id, statusData) => api.put(`/equipment/bookings/${id}`, statusData),
  cancelBooking: (id) => api.delete(`/equipment/bookings/${id}`)
};

// Infrastructure API
export const infrastructureAPI = {
  getAllInfrastructure: () => api.get('/infrastructure'),
  getInfrastructureById: (id) => api.get(`/infrastructure/${id}`),
  createInfrastructure: (infrastructureData) => api.post('/infrastructure', infrastructureData),
  updateInfrastructure: (id, infrastructureData) => api.put(`/infrastructure/${id}`, infrastructureData),
  deleteInfrastructure: (id) => api.delete(`/infrastructure/${id}`),
  bookInfrastructure: (bookingData) => api.post('/infrastructure/book', bookingData),
  getAllInfrastructureBookings: () => api.get('/infrastructure/bookings/all'),
  getUserInfrastructureBookings: () => api.get('/infrastructure/bookings/user'),
  getBookingsByDate: (date) => api.get(`/infrastructure/bookings/date/${date}`),
  updateBookingStatus: (id, statusData) => api.put(`/infrastructure/bookings/${id}`, statusData),
  cancelBooking: (id) => api.delete(`/infrastructure/bookings/${id}`),
  sendReminders: () => api.get('/infrastructure/bookings/reminder')
};

export default api; 