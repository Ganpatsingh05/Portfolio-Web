"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ConfirmOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

interface ConfirmContextType {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
}

const ConfirmContext = createContext<ConfirmContextType | null>(null);

export function useConfirm() {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error('useConfirm must be used within a ConfirmProvider');
  }
  return context;
}

const typeStyles = {
  danger: {
    icon: (
      <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
    ),
    confirmBtn: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
    iconBg: 'bg-red-100 dark:bg-red-900/30',
  },
  warning: {
    icon: (
      <svg className="w-12 h-12 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    confirmBtn: 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-500',
    iconBg: 'bg-amber-100 dark:bg-amber-900/30',
  },
  info: {
    icon: (
      <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    confirmBtn: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
    iconBg: 'bg-blue-100 dark:bg-blue-900/30',
  },
};

export function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const [resolveRef, setResolveRef] = useState<((value: boolean) => void) | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const confirm = useCallback((opts: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setOptions(opts);
      setIsOpen(true);
      setResolveRef(() => resolve);
    });
  }, []);

  const handleClose = (result: boolean) => {
    setIsOpen(false);
    if (resolveRef) {
      resolveRef(result);
    }
    setTimeout(() => {
      setOptions(null);
      setResolveRef(null);
    }, 200);
  };

  const type = options?.type || 'danger';
  const styles = typeStyles[type];

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      {mounted && (
        <AnimatePresence>
          {isOpen && options && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[110]"
                onClick={() => handleClose(false)}
              />
              
              {/* Modal */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="fixed inset-0 z-[111] flex items-center justify-center p-4"
              >
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
                  <div className="p-6 text-center">
                    {/* Icon */}
                    <div className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-4 ${styles.iconBg}`}>
                      {styles.icon}
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {options.title}
                    </h3>
                    
                    {/* Message */}
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      {options.message}
                    </p>
                    
                    {/* Buttons */}
                    <div className="flex gap-3 justify-center">
                      <button
                        onClick={() => handleClose(false)}
                        className="px-6 py-2.5 rounded-xl font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                      >
                        {options.cancelText || 'Cancel'}
                      </button>
                      <button
                        onClick={() => handleClose(true)}
                        className={`px-6 py-2.5 rounded-xl font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${styles.confirmBtn}`}
                      >
                        {options.confirmText || 'Confirm'}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      )}
    </ConfirmContext.Provider>
  );
}
