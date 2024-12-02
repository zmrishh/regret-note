import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { 
  FaHome, 
  FaBook, 
  FaGlobeAmericas, 
  FaRobot, 
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaUserCircle,
  FaFire
} from 'react-icons/fa';
import { useStreak } from '../../contexts/StreakContext';

const NavItem = ({ to, icon: Icon, label, isActive }) => {
  return (
    <Link to={to} className="group relative">
      <motion.div 
        className={`
          flex items-center space-x-2 px-4 py-2 rounded-lg 
          transition-all duration-300 ease-in-out
          ${isActive 
            ? 'bg-accent-orange/20 text-accent-orange' 
            : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'}
        `}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Icon className="w-5 h-5" />
        <span className="text-sm font-medium hidden md:block">{label}</span>
      </motion.div>
      {isActive && (
        <motion.div 
          layoutId="active-indicator"
          className="absolute bottom-0 left-0 w-full h-0.5 bg-accent-orange"
        />
      )}
    </Link>
  );
};

const StreakDisplay = () => {
  const { streaks } = useStreak();
  
  const renderStreak = (emotion) => {
    const streak = streaks[emotion];
    return (
      <motion.div 
        className="flex items-center space-x-1 bg-white/10 px-2 py-1 rounded-full"
        whileHover={{ scale: 1.05 }}
      >
        <FaFire className={`
          w-4 h-4 
          ${streak.consecutiveDays > 0 
            ? 'text-accent-orange' 
            : 'text-white/50'}
        `} />
        <span className="text-xs font-semibold">
          {streak.consecutiveDays}
        </span>
      </motion.div>
    );
  };

  return (
    <div className="flex items-center space-x-2">
      <div className="flex items-center space-x-1">
        <span className="text-xs text-white/50 hidden md:block">Regret</span>
        {renderStreak('regret')}
      </div>
      <div className="flex items-center space-x-1">
        <span className="text-xs text-white/50 hidden md:block">Fine</span>
        {renderStreak('feelingFine')}
      </div>
    </div>
  );
};

export function Navbar({ onLogout, username }) {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { 
      to: '/', 
      icon: FaHome, 
      label: 'Home',
      path: '/'
    },
    { 
      to: '/journal', 
      icon: FaBook, 
      label: 'Journal',
      path: '/journal'
    },
    { 
      to: '/confessions', 
      icon: FaGlobeAmericas, 
      label: 'Confessions',
      path: '/confessions'
    },
    { 
      to: '/chatbot', 
      icon: FaRobot, 
      label: 'Chatbot',
      path: '/chatbot'
    },
    { 
      to: '/profile', 
      icon: FaUserCircle, 
      label: 'Profile',
      path: '/profile'
    }
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-off-black/50 backdrop-blur-lg border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div 
            className="flex-shrink-0 flex items-center"
            whileHover={{ scale: 1.05 }}
          >
            <Link 
              to="/" 
              className="text-2xl font-bold bg-gradient-to-r from-white to-accent-orange bg-clip-text text-transparent"
            >
              Regret.
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-4 items-center">
            {navItems.map((item) => (
              <NavItem 
                key={item.to} 
                {...item} 
                isActive={location.pathname === item.path}
              />
            ))}

            {/* Streak Display */}
            <StreakDisplay />

            {/* User and Logout */}
            <div className="flex items-center space-x-4 ml-4">
              <div className="text-sm text-white/70">
                Hi, <span className="font-semibold text-white">{username}</span>
              </div>
              <motion.button
                onClick={onLogout}
                className="text-white/70 hover:text-white transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaSignOutAlt className="w-5 h-5" />
              </motion.button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Mobile Streak Display */}
            <StreakDisplay />
            
            <motion.button
              onClick={toggleMobileMenu}
              className="text-white/70 hover:text-white transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {isMobileMenuOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden"
            >
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white/5 rounded-lg">
                {navItems.map((item) => (
                  <Link 
                    key={item.to} 
                    to={item.to} 
                    onClick={toggleMobileMenu}
                    className={`
                      block px-3 py-2 rounded-md text-base font-medium
                      ${location.pathname === item.path 
                        ? 'bg-accent-orange/20 text-accent-orange' 
                        : 'text-white/70 hover:bg-white/10'}
                    `}
                  >
                    <div className="flex items-center space-x-3">
                      <item.icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </div>
                  </Link>
                ))}
                
                {/* Mobile Logout */}
                <div 
                  onClick={onLogout}
                  className="flex items-center justify-between px-3 py-2 text-white/70 hover:bg-white/10 rounded-md cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <FaSignOutAlt className="w-5 h-5" />
                    <span>Logout</span>
                  </div>
                  <div className="text-sm text-white/50">
                    {username}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
