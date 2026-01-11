/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Bell, CheckCheck, MessageSquare, Heart, UserPlus, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAdminNotifications } from '@/context/NotificationAdminContext';

// Dữ liệu mẫu cho thông báo
const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    type: 'message',
    title: 'Tin nhắn mới',
    content: 'Nguyễn Văn A đã gửi cho bạn một tin nhắn: "Dự án đã hoàn thành chưa?"',
    time: '2 phút trước',
    isUnread: true,
    icon: <MessageSquare className="w-4 h-4 text-blue-500" />,
  },
  {
    id: 2,
    type: 'like',
    title: 'Lượt thích mới',
    content: 'Trần Thị B đã thích bài viết của bạn về Next.js.',
    time: '15 phút trước',
    isUnread: true,
    icon: <Heart className="w-4 h-4 text-pink-500" />,
  },
  {
    id: 3,
    type: 'follow',
    title: 'Người theo dõi mới',
    content: 'Lê Văn C đã bắt đầu theo dõi bạn.',
    time: '1 giờ trước',
    isUnread: false,
    icon: <UserPlus className="w-4 h-4 text-green-500" />,
  },
  {
    id: 4,
    type: 'system',
    title: 'Cập nhật hệ thống',
    content: 'Phiên bản v2.0 đã được cập nhật thành công.',
    time: '5 giờ trước',
    isUnread: false,
    icon: <Bell className="w-4 h-4 text-orange-500" />,
  }
];
interface Notification {
  notiId:any,
  id: string;
  content: string;
  isRead: boolean;
  createdAt: number;
}
interface NotificationBellProps {
  userId?: string ;
}
/**
 * Hàm tiện ích để chuyển đổi timestamp sang thời gian tương đối
 *  - Thời gian tính bằng miliseconds
 */
/**
 * Chuyển đổi chuỗi "DD/MM/YYYY HH:mm:ss" hoặc timestamp sang thời gian tương đối
 */
const formatRelativeTime = (dateInput: number | string): string => {
  let timestamp: number;

  if (typeof dateInput === 'string') {
    // Phân tách chuỗi "28/12/2025 19:50:48"
    // parts[0] = "28/12/2025", parts[1] = "19:50:48"
    const parts = dateInput.split(' ');
    const dateParts = parts[0].split('/'); // [28, 12, 2025]
    const timeParts = parts[1].split(':'); // [19, 50, 48]

    // Lưu ý: Tháng trong JS bắt đầu từ 0 (Tháng 1 là 0, Tháng 12 là 11)
    const dateObj = new Date(
      parseInt(dateParts[2]), // Năm
      parseInt(dateParts[1]) - 1, // Tháng
      parseInt(dateParts[0]), // Ngày
      parseInt(timeParts[0]), // Giờ
      parseInt(timeParts[1]), // Phút
      parseInt(timeParts[2])  // Giây
    );
    
    timestamp = dateObj.getTime();
  } else {
    timestamp = dateInput;
  }

  const now = Date.now();
  const diffInSeconds = Math.floor((now - timestamp) / 1000);

  // Nếu thời gian ở tương lai hoặc do lệch giây hệ thống
  if (diffInSeconds < 5) return 'Vừa xong';

  if (diffInSeconds < 60) return `${diffInSeconds} giây trước`;

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
export default function NotificationBellAdmin({userId}:{userId?:string}) {
    console.log(userId)
  const [isOpen, setIsOpen] = useState(false);
  const [notificationList, setNotificationList] = useState<Notification[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);;
  const {notifications, status}=useAdminNotifications();
  const router=useRouter();
  // Tính số thông báo chưa đọc
  const unreadCount =useMemo(()=>{
    return notificationList.filter(n => !n.isRead).length;
  },[notifications,notificationList])

    // Lắng nghe thông báo mới từ SSE Context
  useEffect(() => {
    if (notifications && notifications.length > 0) {
      // Lấy thông báo mới nhất (giả sử BE đẩy về từng object lẻ)
  
      const newNoti:any={
          notiId:  notifications[0].notiId,
          content: notifications[0].content,
          isRead: false,
          createdAt: Date.now() 
      }
      // Kiểm tra xem thông báo này đã tồn tại trong list chưa để tránh trùng lặp
      setNotificationList((prev:any ) => {
        const updatedList = [newNoti, ...prev];
        return updatedList;
      });
  
    
    }
  }, [notifications]); // Chạy lại mỗi khi context nhận được tin nhắn mới
  

   useEffect(() => {
      const fetchNotifications = async () => {
        try {
          const formData=new FormData();
          formData.append('userId',userId||"");
          formData.append('size',"10");
          const res=await fetch(`${process.env.NEXT_PUBLIC_API_URL}/noti`,{
              method:"POST",
              credentials:"include",
              body:formData
          })
  
          const data=await res.json();
          const newNotifiList=data.result.content.map((noty:any)=>{
            return {
              
                  notiId: noty.notiId,
                  content:noty.content,
                  isRead: noty.isRead,
                  createdAt:noty.createdAt
      }
            
          })
          setNotificationList(newNotifiList);
     
        } catch (err:unknown) {
          console.log(err)
         
        } finally {
      
        }
      };
  
      fetchNotifications();
    }, [userId]);
  

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    function handleClickOutside(event:any) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

 
  const markAsRead =async (notiId: string) => {
     const res=await fetch(`${process.env.NEXT_PUBLIC_API_URL}/noti/read`,{
            method:"PUT",
            headers: {'Content-Type':'application/json'},
            credentials:"include",
            body:JSON.stringify({
              notiIds:[notiId],
              
            })
        });

        const data=await res.json();
        console.log("Đánh dấu đã đọc:",data);
    setNotificationList((prev) =>
      prev.map((n) => (n.notiId === notiId ? { ...n, isRead: true } : n))
    );
  };

  const markAllAsRead = async() => {
      const res=await fetch(`${process.env.NEXT_PUBLIC_API_URL}/noti/read`,{
            method:"PUT",
            headers: {'Content-Type':'application/json'},
            credentials:"include",
            body:JSON.stringify({
              notiIds:[...notificationList.filter(n=>!n.isRead).map(n=>n.notiId)],
            
            })
        });

        const data=await res.json();
        console.log("Đánh dấu đã đọc:",data);
    setNotificationList((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <div className=" flex justify-center">
      <div className="relative inline-block" ref={dropdownRef}>
        
        {/* Nút Chuông Thông Báo */}
        <button 
          onClick={toggleDropdown}
          className="relative flex items-center justify-center w-12 h-12 border border-slate-200 bg-white rounded-full hover:bg-slate-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 active:scale-95"
        >
          <Bell className={`w-6 h-6 transition-colors duration-200 ${isOpen ? 'text-orange-500' : 'text-slate-600'}`} strokeWidth={1.5} />
          
          {unreadCount > 0 && (
            <div className="absolute -top-0.5 -right-0.5 flex items-center justify-center">
              {/* Hiệu ứng nháy cam */}
              <span className="absolute inline-flex w-4 h-4 rounded-full bg-orange-500 opacity-40 animate-ping"></span>
              {/* Dấu chấm cam  */}
              <span className="relative flex items-center justify-center w-3.5 h-3.5 bg-orange-500 border-2 border-white rounded-full"></span>
            </div>
          )}
        </button>

        {/* Dropdown Menu với hiệu ứng Transition */}
        <div 
          className={`absolute right-[-267px] lg:right-0 mt-3 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50 origin-top-right transition-all duration-300 ease-out 
            ${isOpen 
              ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto' 
              : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
            }`}
        >
          {/* Header của Dropdown */}
          <div className="p-4 border-b border-slate-50 flex items-center justify-between bg-white">
            <h3 className="font-semibold text-slate-800 text-lg">Thông báo</h3>
            {unreadCount > 0 ?(<>
              <button 
              onClick={markAllAsRead}
              className="text-xs font-medium text-orange-600 hover:text-orange-700 flex items-center gap-1 transition-colors p-1 rounded-md hover:bg-orange-50"
            >
              <CheckCheck className="w-3 h-3" />
              Đánh dấu đã đọc
            </button>
            </>):(<></>)}
          
          </div>

          {/* Danh sách thông báo */}
          <div className="max-h-[400px] overflow-y-auto">
            {notificationList.length > 0 ? (
              notificationList.map((notification) => (
                <div 
                onClick={()=>markAsRead(notification.notiId)}
                  key={notification.notiId}
                  className={`p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer flex gap-3 group ${notification.isRead==false ? 'bg-orange-50/20' : ''}`}
                >
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 ${notification.isRead==false ? 'bg-white shadow-sm ring-1 ring-orange-100' : 'bg-slate-100'}`}>
                    {<Bell className="w-4 h-4 text-orange-500" />}
                  </div>
                  
                  <div className="flex-grow">
                    <div className="flex justify-between items-start mb-1">
                      <p className={`text-sm leading-none transition-colors ${notification.isRead==false ? 'font-bold text-slate-900' : 'font-medium text-slate-600 group-hover:text-slate-900'}`}>
                        {notification.content}
                      </p>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1 whitespace-nowrap">
                        <Clock className="w-2.5 h-2.5" />
                        {notification.createdAt ? formatRelativeTime(notification.createdAt) : ''}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 group-hover:text-slate-600">
                      {notification.content}
                    </p>
                  </div>

                  {notification.isRead==false && (
                    <div className="flex-shrink-0 self-center">
                      <div className="w-2 h-2 bg-orange-500 rounded-full shadow-[0_0_8px_rgba(249,115,22,0.6)]"></div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Bell className="w-8 h-8 text-slate-200" />
                </div>
                <p className="text-slate-400 text-sm font-medium">Bạn chưa có thông báo mới</p>
              </div>
            )}
          </div>

          {/* Footer của Dropdown */}
          <button
          onClick ={()=>router.push('/admin/notifymanager')}
          className="w-full p-4 text-center text-sm font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100 hover:text-orange-600 transition-all border-t border-slate-100">
            Xem tất cả thông báo
          </button>
        </div>
      </div>
    </div>
  );
}