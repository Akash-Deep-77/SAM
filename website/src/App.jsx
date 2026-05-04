import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import RegisterSuccess from './pages/RegisterSuccess';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import DashboardLayout from './pages/dashboard/Layout';
import Faculties from './pages/dashboard/Faculties';
import Classes from './pages/dashboard/Classes';
import Subjects from './pages/dashboard/Subjects';
import Timetable from './pages/dashboard/Timetable';
import About from './pages/dashboard/About';

function ProtectedRoute({ children }) {
  const { institute } = useAuth();
  return institute ? children : <Navigate to="/login" replace />;
}

function GuestRoute({ children }) {
  const { institute } = useAuth();
  return !institute ? children : <Navigate to="/dashboard/faculties" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
      <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
      <Route path="/register/success" element={<RegisterSuccess />} />
      <Route path="/forgot-password" element={<GuestRoute><ForgotPassword /></GuestRoute>} />
      <Route path="/reset-password" element={<GuestRoute><ResetPassword /></GuestRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to="faculties" replace />} />
        <Route path="faculties" element={<Faculties />} />
        <Route path="classes" element={<Classes />} />
        <Route path="subjects" element={<Subjects />} />
        <Route path="timetable" element={<Timetable />} />
        <Route path="about" element={<About />} />
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
