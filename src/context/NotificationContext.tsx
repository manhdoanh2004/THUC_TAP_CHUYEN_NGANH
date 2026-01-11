/* eslint-disable @typescript-eslint/no-unused-vars */
// contexts/NotificationContext.tsx
"use client";

import { useAuth } from '@/hooks/useAuth';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface Notification {
  notiId?: string;
  content: string;
}

interface NotificationContextType {
  notifications: Notification[];
  status: 'connecting' | 'connected' | 'error';
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [status, setStatus] = useState<'connecting' | 'connected' | 'error'>('connecting');
  const {isLogin}=useAuth();


useEffect(() => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/sse/subscribe/`;


  if (!process.env.NEXT_PUBLIC_API_URL) {

    return;
  }
  if ( isLogin==false) {

    return;
  }

  const eventSource = new EventSource(url,{
    withCredentials:true
  });

  eventSource.onopen = () => {
    setStatus('connected');
  };

  eventSource.addEventListener("message",(event)=>{
    const newNode ={
    notiId:event.lastEventId,
    content: event.data
    }
  
    setNotifications((prev) => [newNode, ...prev]);
  }) 

  eventSource.onerror = (err) => {
 
    setStatus('error');
    // Đừng close ngay lập tức, SSE có cơ chế tự retry. 
    // Nếu bạn close() ở đây, nó sẽ không bao giờ kết nối lại được.
  
  // readyState = 0: Đang kết nối lại
  // readyState = 2: Kết nối bị đóng vĩnh viễn
  if (eventSource.readyState === EventSource.CLOSED) {
  
  }
  };

  return () => {
  
    eventSource.close();
  };
}, [isLogin]);
  return (
    <NotificationContext.Provider value={{ notifications, status }}>
      {children}
    </NotificationContext.Provider>
  );
};

// Hook để các trang con sử dụng
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error("useNotifications must be used within NotificationProvider");
  return context;
};