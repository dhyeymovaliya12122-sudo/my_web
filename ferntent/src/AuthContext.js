import React from 'react';
import { createContext, useContext, useState } from 'react';

var AuthContext = createContext(null);

export function AuthProvider(props) {
  var children = props.children;

  var storedUser = null;
  try {
    var stored = localStorage.getItem('drivelineUser');
    if (stored) {
      storedUser = JSON.parse(stored);
    }
  } catch (e) {
    storedUser = null;
  }

  var userState = useState(storedUser);
  var user = userState[0];
  var setUser = userState[1];

  function login(userData) {
    setUser(userData);
    localStorage.setItem('drivelineUser', JSON.stringify(userData));
  }

  function logout() {
    setUser(null);
    localStorage.removeItem('drivelineUser');
  }

  return (
    <AuthContext.Provider value={{ user: user, login: login, logout: logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
