import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Load initial role from localStorage or default to 'driver'
  const [role, setRole] = useState(() => {
    return localStorage.getItem('roadguard_role') || 'driver';
  });

  const [user, setUser] = useState(() => {
    const savedRole = localStorage.getItem('roadguard_role') || 'driver';
    return {
      email: savedRole === 'authority' ? 'authority@smartcity.gov.in' : 'driver@roadguard.io',
      role: savedRole,
      name: savedRole === 'authority' ? 'Chief Road Inspector (Delhi Zone)' : 'Alex Kumar (Driver)',
      department: savedRole === 'authority' ? 'Public Works Department (PWD)' : 'Road Safety Citizen Network'
    };
  });

  const loginAs = (targetRole, emailOverride) => {
    const activeRole = targetRole === 'authority' ? 'authority' : 'driver';
    setRole(activeRole);
    localStorage.setItem('roadguard_role', activeRole);
    
    setUser({
      email: emailOverride || (activeRole === 'authority' ? 'authority@smartcity.gov.in' : 'driver@roadguard.io'),
      role: activeRole,
      name: activeRole === 'authority' ? 'Chief Road Inspector (Delhi Zone)' : 'Alex Kumar (Driver)',
      department: activeRole === 'authority' ? 'Public Works Department (PWD)' : 'Road Safety Citizen Network'
    });
  };

  const switchRole = () => {
    const nextRole = role === 'driver' ? 'authority' : 'driver';
    loginAs(nextRole);
  };

  const logout = () => {
    loginAs('driver');
  };

  return (
    <AuthContext.Provider value={{
      user,
      role,
      isAuthority: role === 'authority',
      isDriver: role === 'driver',
      loginAs,
      switchRole,
      logout,
      isDemoAuth: true
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
