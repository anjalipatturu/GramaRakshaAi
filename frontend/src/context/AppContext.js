import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [language, setLanguage] = useState('en');
  const [darkMode, setDarkMode] = useState(false);
  const [accessibilityMode, setAccessibilityMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [villages, setVillages] = useState([]);
  const [emergencyContacts, setEmergencyContacts] = useState({
    ambulance: '108',
    police: '100',
    fire: '101',
    women: '181'
  });

  const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        setUser(null);
        toast.error('Session expired. Please login again.');
      }
      return Promise.reject(error);
    }
  );

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    const fetchVillages = async () => {
      try {
        const response = await api.get('/villages');
        setVillages(response.data);
      } catch (error) {
        console.error('Error fetching villages:', error);
      }
    };
    
    fetchVillages();
  }, []);

  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await api.post('/auth/login', credentials);
      
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      
      toast.success('Login successful!');
      return { success: true };
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
      return { success: false, error: error.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      await api.post('/auth/register', userData);
      
      toast.success('Registration successful! Please login.');
      return { success: true };
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
      return { success: false, error: error.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    toast.success('Logged out successfully');
  };

  const checkSymptoms = async (symptomsData) => {
    try {
      setLoading(true);
      const response = await api.post('/screenings', {
        ...symptomsData,
        userId: user?._id
      });
      
      return response.data;
    } catch (error) {
      toast.error('Error checking symptoms');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const sendChatMessage = async (message, sessionId = null) => {
    try {
      const response = await api.post('/chatbot/message', {
        message,
        language,
        userId: user?._id,
        sessionId
      });
      
      return response.data;
    } catch (error) {
      toast.error('Error sending message');
      throw error;
    }
  };

  const uploadImage = async (file, imageType) => {
    try {
      setLoading(true);
      
      const formData = new FormData();
      formData.append('image', file);
      formData.append('userId', user?._id);
      formData.append('imageType', imageType);

      const response = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error) {
      toast.error('Error uploading image');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    language,
    setLanguage,
    darkMode,
    setDarkMode,
    accessibilityMode,
    setAccessibilityMode,
    loading,
    villages,
    emergencyContacts,
    api,
    login,
    register,
    logout,
    checkSymptoms,
    sendChatMessage,
    uploadImage,
  };

  return (
    <AppContext.Provider value={value}>
      <div className={`${darkMode ? 'dark-mode' : ''} ${accessibilityMode ? 'accessibility-mode' : ''}`}>
        {children}
      </div>
    </AppContext.Provider>
  );
};
