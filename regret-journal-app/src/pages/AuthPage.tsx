import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGoogle, FaGithub, FaEye, FaEyeSlash } from 'react-icons/fa';

type AuthMode = 'signup' | 'login';
type AnonymityPreference = 'full' | 'partial' | 'none';

interface AuthPageProps {
  onAuthenticate: (profile: UserProfile) => void;
}

interface UserProfile {
  username: string;
  email: string;
  emotionalTrigger: string;
  anonymityPreference: AnonymityPreference;
}

export function AuthPage({ onAuthenticate }: AuthPageProps) {
  const [authMode, setAuthMode] = useState<AuthMode>('signup');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    emotionalTrigger: '',
    anonymityPreference: 'partial' as AnonymityPreference
  });
  const [authError, setAuthError] = useState<string | null>(null);

  // Password strength calculation
  useEffect(() => {
    const calculateStrength = (password: string) => {
      let strength = 0;
      if (password.length > 7) strength++;
      if (/[A-Z]/.test(password)) strength++;
      if (/[a-z]/.test(password)) strength++;
      if (/[0-9]/.test(password)) strength++;
      if (/[^A-Za-z0-9]/.test(password)) strength++;
      return strength;
    };

    setPasswordStrength(calculateStrength(formData.password));
  }, [formData.password]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear any previous auth errors
    setAuthError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.email || !formData.password) {
      setAuthError('Please fill in all required fields');
      return;
    }

    // Simulate authentication (replace with actual auth logic)
    try {
      if (authMode === 'signup') {
        // Signup logic
        if (!formData.username) {
          setAuthError('Username is required for signup');
          return;
        }

        // Create user profile
        const userProfile: UserProfile = {
          username: formData.username,
          email: formData.email,
          emotionalTrigger: formData.emotionalTrigger || 'default',
          anonymityPreference: formData.anonymityPreference
        };

        // Simulate successful signup
        onAuthenticate(userProfile);
      } else {
        // Login logic (simplified)
        const userProfile: UserProfile = {
          username: 'JourneyUser', // Default username for login
          email: formData.email,
          emotionalTrigger: 'hope',
          anonymityPreference: 'partial'
        };

        // Simulate successful login
        onAuthenticate(userProfile);
      }
    } catch (error) {
      setAuthError('Authentication failed. Please try again.');
    }
  };

  const socialLoginOptions = [
    { 
      name: 'Google', 
      icon: <FaGoogle />, 
      color: 'text-red-500',
      hoverColor: 'hover:bg-red-500'
    },
    { 
      name: 'GitHub', 
      icon: <FaGithub />, 
      color: 'text-gray-700',
      hoverColor: 'hover:bg-gray-700'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-off-black via-off-black to-accent-orange/20 flex items-center justify-center p-6 overflow-hidden">
      <motion.div 
        className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 relative overflow-hidden border border-white/10"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Animated Background Elements */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-accent-orange/20 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-accent-orange/20 rounded-full blur-2xl animate-pulse delay-500"></div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-white to-accent-orange bg-clip-text text-transparent">
            {authMode === 'signup' ? 'Begin Your Emotional Journey' : 'Welcome Back'}
          </h1>
          <p className="text-gray-300">
            {authMode === 'signup' 
              ? 'Create a safe space for your deepest reflections' 
              : 'Continue exploring your inner world'}
          </p>
        </div>

        {authError && (
          <div className="bg-red-500/20 text-red-300 p-3 rounded-lg mb-4 text-center border border-red-500/30">
            {authError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <AnimatePresence>
            {authMode === 'signup' && (
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <label className="block text-white mb-2">Username</label>
                <input 
                  type="text" 
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Choose a reflective username"
                  className="w-full px-4 py-2 bg-white/10 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-orange border border-white/10"
                  required 
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="relative">
            <label className="block text-white mb-2">Email</label>
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Your emotional sanctuary's gateway"
              className="w-full px-4 py-2 bg-white/10 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-orange border border-white/10"
              required 
            />
          </div>

          <div className="relative">
            <label className="block text-white mb-2">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="A key to your inner world"
                className="w-full px-4 py-2 pr-10 bg-white/10 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-orange border border-white/10"
                required 
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 hover:text-white"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {/* Password Strength Indicator */}
            <div className="mt-1 flex space-x-1">
              {[1, 2, 3, 4, 5].map((level) => (
                <div 
                  key={level} 
                  className={`h-1 w-full rounded-full transition-colors ${
                    level <= passwordStrength 
                      ? 'bg-accent-orange' 
                      : 'bg-gray-500/30'
                  }`}
                />
              ))}
            </div>
          </div>

          <AnimatePresence>
            {authMode === 'signup' && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-white mb-2">Emotional Trigger Word</label>
                  <input 
                    type="text" 
                    name="emotionalTrigger"
                    value={formData.emotionalTrigger}
                    onChange={handleInputChange}
                    placeholder="A word that resonates with your emotions"
                    className="w-full px-4 py-2 bg-white/10 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-orange border border-white/10"
                  />
                </div>

                <div>
                  <label className="block text-white mb-2">Anonymity Preference</label>
                  <select 
                    name="anonymityPreference"
                    value={formData.anonymityPreference}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-white/10 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-orange border border-white/10"
                  >
                    <option value="partial">Partial Anonymity</option>
                    <option value="full">Full Anonymity</option>
                    <option value="none">No Anonymity</option>
                  </select>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button 
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-accent-orange text-white py-3 rounded-lg hover:bg-accent-orange/80 transition-colors"
          >
            {authMode === 'signup' ? 'Create Account' : 'Log In'}
          </motion.button>
        </form>

        {/* Social Login Options */}
        <div className="mt-6 space-y-4">
          <div className="flex items-center">
            <div className="flex-grow border-t border-white/20"></div>
            <span className="px-4 text-gray-400 text-sm">or continue with</span>
            <div className="flex-grow border-t border-white/20"></div>
          </div>

          <div className="flex justify-center space-x-4">
            {socialLoginOptions.map((option) => (
              <motion.button
                key={option.name}
                type="button"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`p-3 rounded-full bg-white/10 ${option.color} ${option.hoverColor} hover:text-white transition-all border border-white/10`}
              >
                {option.icon}
              </motion.button>
            ))}
          </div>
        </div>

        <div className="text-center mt-6">
          <button 
            type="button"
            onClick={() => setAuthMode(authMode === 'signup' ? 'login' : 'signup')}
            className="text-gray-300 hover:text-white transition-colors"
          >
            {authMode === 'signup' 
              ? 'Already have an account? Log In' 
              : 'Need an account? Sign Up'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
