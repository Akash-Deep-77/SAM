import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Replace with your local machine's IP address when testing on a physical device
// For Android emulator, you can use 10.0.2.2. For iOS simulator, localhost works.
const API_URL = 'http://10.0.2.2:8000/api/v1';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add JWT token
apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const facultyApi = {
  register: (data) => apiClient.post('/faculty/register', data),
  login: (data) => apiClient.post('/faculty/login', data),
  getProfile: () => apiClient.get('/faculty/me'),
  getClasses: () => apiClient.get('/faculty/classes'),
};

export const studentApi = {
  register: (data) => apiClient.post('/student/register', data),
  login: (data) => apiClient.post('/student/login', data),
  getProfile: () => apiClient.get('/student/me'),
};

export const sessionApi = {
  startSession: (data) => apiClient.post('/session/start', data),
  endSession: (sessionId) => apiClient.post('/session/end', { sessionId }),
  getFacultyActiveSession: () => apiClient.get('/session/faculty/active'),
  getStudentActiveSession: (classId) => apiClient.get(`/session/student/active/${classId}`),
};

export const attendanceApi = {
  markAttendance: (data) => apiClient.post('/attendance/mark', data),
};

export default apiClient;
