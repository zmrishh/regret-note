import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Toast = ({ message, type = 'success', isVisible, onClose, position = 'top' }) => {
  const bgColor = type === 'success' ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-red-500 to-pink-500';
  const icon = type === 'success' ? '✨' : '❌';

  // Position classes
  const positionClasses = {
    top: 'top-8 left-1/2 -translate-x-1/2',
    'bottom-right': 'bottom-8 right-8'
  };

  React.useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: position === 'top' ? -100 : 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: position === 'top' ? -100 : 100 }}
          className={`fixed ${positionClasses[position]} z-50`}
        >
          <div className={`${bgColor} px-6 py-3 rounded-full shadow-lg backdrop-blur-sm flex items-center space-x-2`}>
            <span className="text-xl">{icon}</span>
            <p className="text-white font-medium">{message}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;
