// contexts/NotificationContext.tsx
"use client";

import { useAuth } from '@/hooks/useAuth';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface Notification {
  id: string;
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
    const url = `${process.env.NEXT_PUBLIC_API_URL}/sse/subscribe`;


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
    console.log(" Kết nối SSE thành công!");
    setStatus('connected');
  };

  eventSource.onmessage = (event) => {
    console.log(" Dữ liệu mới:", event.data);
    const newNode =event.data;
    // const newNode = JSON.parse(event.data);
    setNotifications((prev) => [newNode, ...prev]);
  };


  eventSource.onerror = (err) => {
    console.error("❌ Lỗi SSE:", err);
    setStatus('error');
    // Đừng close ngay lập tức, SSE có cơ chế tự retry. 
    // Nếu bạn close() ở đây, nó sẽ không bao giờ kết nối lại được.
    console.log("Trạng thái kết nối (readyState):", eventSource.readyState);
  // readyState = 0: Đang kết nối lại
  // readyState = 2: Kết nối bị đóng vĩnh viễn
  if (eventSource.readyState === EventSource.CLOSED) {
    console.error("❌ Kết nối đã bị đóng hoàn toàn.");
  }
  };

  return () => {
    console.log("🔌 Đóng kết nối SSE (Cleanup)");
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