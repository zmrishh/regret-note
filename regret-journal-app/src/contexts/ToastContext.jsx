import React, { createContext, useContext, useState } from 'react';
import Toast from '../components/ui/Toast';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState({
    top: { message: '', type: 'success', isVisible: false },
    'bottom-right': { message: '', type: 'success', isVisible: false }
  });

  const showToast = (message, type = 'success', position = 'top') => {
    setToasts(prev => ({
      ...prev,
      [position]: { message, type, isVisible: true }
    }));
  };

  const hideToast = (position) => {
    setToasts(prev => ({
      ...prev,
      [position]: { ...prev[position], isVisible: false }
    }));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Top Toast */}
      <Toast
        message={toasts.top.message}
        type={toasts.top.type}
        isVisible={toasts.top.isVisible}
        onClose={() => hideToast('top')}
        position="top"
      />
      {/* Bottom Right Toast */}
      <Toast
        message={toasts['bottom-right'].message}
        type={toasts['bottom-right'].type}
        isVisible={toasts['bottom-right'].isVisible}
        onClose={() => hideToast('bottom-right')}
        position="bottom-right"
      />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
