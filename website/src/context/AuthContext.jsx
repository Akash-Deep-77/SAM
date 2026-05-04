import { createContext, useContext, useState, useEffect } from 'react';
import { loginInstitute, logoutInstitute } from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [institute, setInstitute] = useState(() => {
    try { return JSON.parse(localStorage.getItem('institute')) || null; }
    catch { return null; }
  });

  const login = async (credentials) => {
    const { data } = await loginInstitute(credentials);
    const inst = data.data.institute;
    const token = data.data.accessToken;
    localStorage.setItem('institute', JSON.stringify(inst));
    localStorage.setItem('accessToken', token);
    setInstitute(inst);
    return inst;
  };

  const logout = async () => {
    try { await logoutInstitute(); } catch {}
    localStorage.clear();
    setInstitute(null);
  };

  const updateInstitute = (data) => {
    const updated = { ...institute, ...data };
    localStorage.setItem('institute', JSON.stringify(updated));
    setInstitute(updated);
  };

  return (
    <AuthContext.Provider value={{ institute, login, logout, updateInstitute }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
