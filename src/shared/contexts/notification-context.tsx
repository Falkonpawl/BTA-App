import React, { createContext, ReactNode, useContext, useState } from "react";

interface NotificationPosition {
  x: number;
  y: number;
}

interface NotificationContextType {
  notificationButtonPosition: NotificationPosition | null;
  setNotificationButtonPosition: (
    position: NotificationPosition | null
  ) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [notificationButtonPosition, setNotificationButtonPosition] =
    useState<NotificationPosition | null>(null);

  return (
    <NotificationContext.Provider
      value={{ notificationButtonPosition, setNotificationButtonPosition }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificationPosition = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotificationPosition must be used within a NotificationProvider"
    );
  }
  return context;
};
