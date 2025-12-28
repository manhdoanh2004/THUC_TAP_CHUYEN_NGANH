/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Bell, Check, Plus, Loader2 } from 'lucide-react';

interface Notification {
  id: string;
  content: string;
  isRead: boolean;
  createdAt: number;
}
interface NotificationBellProps {
  userId?: string | number | null;
}
/**
 * Hàm tiện ích để chuyển đổi timestamp sang thời gian tương đối
 * @param timestamp - Thời gian tính bằng miliseconds
 */
const formatRelativeTime = (timestamp: number): string => {
  const now = Date.now();
  const diffInSeconds = Math.floor((now - timestamp) / 1000);

  if (diffInSeconds < 60) return 'Vừa xong';

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} giờ trước`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays} ngày trước`;

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) return `${diffInMonths} tháng trước`;

  return `${Math.floor(diffInMonths / 12)} năm trước`;
};

const NotificationBell: React.FC<NotificationBellProps> = ({ userId }) =>{
    console.log(userId)
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRinging, setIsRinging] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = useMemo(() => {
    return notifications.filter((n) => !n.isRead).length;
  }, [notifications]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setIsLoading(true);
        // await new Promise((resolve) => setTimeout(resolve, 1500));
        
        // const mockData: Notification[] = [
        //   {
        //     id: '1',
        //     content: 'Nhà tuyển dụng đã xem hồ sơ của bạn cho vị trí Frontend Developer.',
        //     isRead: false,
        //     createdAt: Date.now() - 120000, // 2 phút trước
        //   },
        //   {
        //     id: '2',
        //     content: 'Bạn có một tin nhắn mới từ Nguyễn Văn A liên quan đến công việc.',
        //     isRead: true,
        //     createdAt: Date.now() - 3600000, // 1 giờ trước
        //   },
        //   {
        //     id: '3',
        //     content: 'Chúc mừng! Hồ sơ của bạn đã lọt vào Top 10% hồ sơ ấn tượng tuần này.',
        //     isRead: false,
        //     createdAt: Date.now() - 172800000, // 2 ngày trước
        //   },
        // ];
        const formData=new FormData();
        formData.append('userId','');
        const res=await fetch(`${process.env.NEXT_PUBLIC_API_URL}/noti`,{
            method:"POST",
            credentials:"include",
            body:formData
        })

      //  setNotifications(mockData);
        setError(null);
      } catch (err:unknown) {
        console.log(err)
        setError("Không thể tải thông báo.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

//   const addTestNotification = () => {
//     const newNotif: Notification = {
//       id: Math.random().toString(36).substr(2, 9),
//       content: 'Bạn vừa nhận được một lời mời phỏng vấn mới!',
//       isRead: false,
//       createdAt: Date.now(),
//     };

//     setNotifications(prev => [newNotif, ...prev]);
//     setIsRinging(false);
//     setTimeout(() => {
//       setIsRinging(true);
//       setTimeout(() => setIsRinging(false), 500);
//     }, 10);
//   };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };



  const PRIMARY_COLOR = "#000071";

  return (
    <div className="flex items-center gap-4">
      <style>{`
        @keyframes ring {
          0% { transform: rotate(0); }
          10% { transform: rotate(15deg); }
          20% { transform: rotate(-12deg); }
          30% { transform: rotate(10deg); }
          40% { transform: rotate(-8deg); }
          50% { transform: rotate(6deg); }
          60% { transform: rotate(-4deg); }
          70% { transform: rotate(2deg); }
          80% { transform: rotate(-1deg); }
          90% { transform: rotate(1deg); }
          100% { transform: rotate(0); }
        }
        .bell-ring {
          animation: ring 0.5s ease-in-out;
          display: inline-block;
        }
      `}</style>

      {/* <button 
        onClick={addTestNotification}
        className="text-xs bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded flex items-center gap-1 transition-colors"
      >
        <Plus size={14} /> Thêm thông báo mới
      </button> */}

      <div className="relative inline-block" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 focus:outline-none relative ${
            isOpen ? 'bg-blue-50 text-[#000071]' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
          }`}
        >
          <div className={isRinging ? 'bell-ring' : ''}>
            <Bell size={20} fill={isOpen ? PRIMARY_COLOR : 'none'} strokeWidth={2.5} style={{ color: isOpen ? PRIMARY_COLOR : undefined }} />
          </div>
          
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold min-w-[18px] h-[18px] flex items-center justify-center rounded-full border-2 border-white pointer-events-none">
              {unreadCount}
            </span>
          )}
        </button>

        <div
          className={`absolute right-0 mt-3 w-80 md:w-[400px] bg-white rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden transition-all duration-300 origin-top-right z-[100] ${
            isOpen ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-2 scale-95 pointer-events-none'
          }`}
        >
          <div className="px-5 py-4 flex justify-between items-center border-b border-gray-50 bg-white">
            <h2 className="text-lg font-bold text-[#212f3f]">Thông báo</h2>
            {unreadCount > 0 && !isLoading && (
              <button onClick={markAllAsRead} className="text-[#000071] text-sm font-medium hover:underline flex items-center gap-1">
                <Check size={14} />
                Đánh dấu tất cả đã đọc
              </button>
            )}
          </div>

          <div className="max-h-[480px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200">
            {isLoading ? (
              <div className="py-20 flex flex-col items-center justify-center text-gray-500">
                <Loader2 size={30} className="animate-spin text-[#000071] mb-2" />
                <p className="text-sm">Đang tải...</p>
              </div>
            ) : notifications.length > 0 ? (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => markAsRead(notif.id)}
                  className={`flex items-start px-5 py-4 border-b border-gray-50 last:border-0 cursor-pointer transition-colors ${
                    !notif.isRead ? 'bg-blue-50/30' : 'bg-white hover:bg-gray-50'
                  }`}
                >
                  <div className="flex-grow">
                    <p className={`text-[14px] leading-relaxed mb-1 ${!notif.isRead ? 'text-[#212f3f] font-semibold' : 'text-gray-600'}`}>
                      {notif.content}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <span className={`text-[12px] ${!notif.isRead ? 'text-[#000071] font-medium' : 'text-gray-400'}`}>
                        {formatRelativeTime(notif.createdAt)}
                      </span>
                      {!notif.isRead && <span className="w-2 h-2 bg-[#000071] rounded-full"></span>}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 flex flex-col items-center justify-center text-gray-400">
                 <Bell size={40} strokeWidth={1} className="mb-2 opacity-20" />
                 <p className="text-sm font-medium">Bạn chưa có thông báo mới</p>
              </div>
            )}
          </div>

     
        </div>
      </div>
    </div>
  );
};

export default NotificationBell;