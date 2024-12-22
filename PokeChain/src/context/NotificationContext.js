import React, { createContext, useContext, useState } from 'react';
import { toast } from 'react-hot-toast';

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const addNotification = ({ title, message, type }) => {
    toast[type](`${title}: ${message}`);
  };

  return (
    <NotificationContext.Provider value={{ addNotification }}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotification = () => useContext(NotificationContext); 