import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/v1/landingpage',
  withCredentials: true,          // sends httpOnly cookies automatically
  headers: { 'Content-Type': 'application/json' },
});

// ── Auth interceptor: attach accessToken from localStorage if present ──
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Auto-refresh on 401 ──
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        // Use the instance to get the baseURL, but target the specific endpoint
        const { data } = await api.post('/refresh-token');
        localStorage.setItem('accessToken', data.data.accessToken);
        original.headers.Authorization = `Bearer ${data.data.accessToken}`;
        return api(original);
      } catch {
        localStorage.clear();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

/* ═══════════════════════════════
   AUTH
═══════════════════════════════ */
export const registerInstitute = (data) =>
  api.post('/register', data);

export const loginInstitute = (data) =>
  api.post('/login', data);

export const logoutInstitute = () =>
  api.post('/logout');

export const refreshToken = () =>
  api.post('/refresh-token');

/* ═══════════════════════════════
   FACULTY  (routes to be built)
═══════════════════════════════ */
export const getFacultyRequests = (status = 'Pending') =>
  api.get(`/faculty?status=${status}`);

export const updateFacultyStatus = (facultyId, status) =>
  api.patch(`/faculty/${facultyId}/status`, { status });

/* ═══════════════════════════════
   CLASSES  (routes to be built)
═══════════════════════════════ */
export const getClasses = () =>
  api.get('/classes');

export const addClass = (data) =>
  api.post('/classes', data);

export const deleteClass = (classId) =>
  api.delete(`/classes/${classId}`);

/* ═══════════════════════════════
   SUBJECTS  (routes to be built)
═══════════════════════════════ */
export const getSubjects = () =>
  api.get('/subjects');

export const addSubject = (data) =>
  api.post('/subjects', data);

export const deleteSubject = (subjectId) =>
  api.delete(`/subjects/${subjectId}`);

/* ═══════════════════════════════
   TIMETABLE  (routes to be built)
═══════════════════════════════ */
export const getTimetable = (classId) =>
  api.get(`/timetable?classId=${classId}`);

export const addTimetableEntry = (data) =>
  api.post('/timetable', data);

export const deleteTimetableEntry = (id) =>
  api.delete(`/timetable/${id}`);

/* ═══════════════════════════════
   INSTITUTE PROFILE  (routes to be built)
═══════════════════════════════ */
export const getInstituteProfile = () =>
  api.get('/profile');

export default api;
