import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaHome, 
  FaBook, 
  FaCommentDots, 
  FaRobot, 
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaUserCircle
} from 'react-icons/fa';
import LogoSVG from '../../assets/logo.svg';

export function Navbar({ onLogout, username }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(prev => !prev);
  };

  const navItems = [
    { 
      name: 'Home', 
      icon: FaHome, 
      path: '/' 
    },
    { 
      name: 'Journal', 
      icon: FaBook, 
      path: '/journal' 
    },
    { 
      name: 'Confessions', 
      icon: FaCommentDots, 
      path: '/confessions' 
    },
    { 
      name: 'Chatbot', 
      icon: FaRobot, 
      path: '/chatbot' 
    },
    { 
      name: 'Profile', 
      icon: FaUserCircle, 
      path: '/profile' 
    }
  ];

  const renderNavItems = (isMobileView = false) => {
    return navItems.map((item, index) => (
      <Link
        key={index}
        to={item.path}
        className={`
          flex items-center 
          ${isMobileView 
            ? 'px-4 py-3 space-x-3 hover:bg-white/10 rounded-xl text-white/70 hover:text-white w-full' 
            : 'text-white/70 hover:text-white transition-colors'}
        `}
      >
        <item.icon className="w-5 h-5" />
        {isMobileView && <span>{item.name}</span>}
      </Link>
    ));
  };

  return (
    <motion.nav 
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-4 inset-x-0 z-50 flex justify-center"
    >
      <div className="w-[95%] max-w-6xl">
        <div className="bg-black/30 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="relative flex items-center justify-between h-16">
              {/* Logo */}
              <Link 
                to="/" 
                className="flex items-center"
              >
                <motion.img 
                  src={LogoSVG} 
                  alt="Regret Journal Logo" 
                  className="h-10 w-auto"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                />
              </Link>

              {/* Desktop Navigation */}
              {!isMobile ? (
                <div className="flex items-center space-x-6">
                  {renderNavItems()}
                  
                  {/* User Actions */}
                  <div className="flex items-center space-x-4">
                    <div className="text-sm text-white/70">
                      Hi, <span className="font-semibold text-white">{username}</span>
                    </div>
                    <motion.button
                      onClick={onLogout}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.9, rotate: -5 }}
                      className="text-white/70 hover:text-white transition-colors"
                    >
                      <FaSignOutAlt className="w-5 h-5" />
                    </motion.button>
                  </div>
                </div>
              ) : (
                <motion.button
                  onClick={toggleMobileMenu}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="text-white/70 hover:text-white"
                >
                  {isMobileMenuOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
                </motion.button>
              )}
            </div>

            {/* Mobile Menu */}
            {isMobile && isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ 
                  opacity: 1, 
                  height: 'auto',
                  transition: { 
                    duration: 0.3,
                    ease: "easeInOut"
                  }
                }}
                exit={{ 
                  opacity: 0, 
                  height: 0,
                  transition: { 
                    duration: 0.2,
                    ease: "easeInOut"
                  }
                }}
                className="absolute left-0 right-0 bg-black/90 backdrop-blur-xl rounded-b-2xl z-50 overflow-hidden"
              >
                <div className="px-4 pt-2 pb-4 space-y-2">
                  {renderNavItems(true)}
                  
                  {/* Mobile Logout */}
                  <div 
                    onClick={onLogout}
                    className="flex items-center justify-between px-4 py-3 
                      text-white/70 hover:bg-white/10 rounded-xl cursor-pointer"
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
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
