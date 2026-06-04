import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Restore from localStorage so login survives page refresh / tab close
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('drivelineUser');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  function login(userData) {
    setUser(userData);
    localStorage.setItem('drivelineUser', JSON.stringify(userData));
  }

  function logout() {
    setUser(null);
    localStorage.removeItem('drivelineUser');
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
