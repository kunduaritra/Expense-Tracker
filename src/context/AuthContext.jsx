import React, { createContext, useContext, useState, useEffect } from "react";
import {
  signUp as signUpService,
  signIn as signInService,
  getUserInfo,
} from "../services/authService";

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user on mount
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  const signUp = async (email, password, name) => {
    try {
      const data = await signUpService(email, password, name);
      const userData = {
        email: data.email,
        displayName: name,
        idToken: data.idToken,
        uid: data.localId,
      };
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      return userData;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const signIn = async (email, password) => {
    try {
      const data = await signInService(email, password);
      const userInfo = await getUserInfo(data.idToken);
      const userData = {
        email: data.email,
        displayName: userInfo.displayName || email.split("@")[0],
        idToken: data.idToken,
        uid: data.localId,
      };
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      return userData;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const signOut = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
