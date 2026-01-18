/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Bell, 
  CheckCheck, 
  MessageSquare, 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  MoreVertical,
  Search,
  User,
  Info,
  Loader2
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';


interface NotificationItem {
  notiId: string;
  content: string;
  type: string; 
  isRead: boolean;
  userId?: string;
  from: string;
  createdAt: string;
  updateAt: string;
}

const ITEMS_PER_PAGE = 10; // Khớp với size gửi lên API

export default function NotificationManagement() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const { infoAdmin } = useAuth();

  // Hàm fetch dữ liệu từ API
  const fetchNotifications = async (userId: string, page: number) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('userId', userId || "");
      formData.append('size', ITEMS_PER_PAGE.toString());
      formData.append('page', (page - 1).toString()); // API thường dùng 0-indexed
      
      // Nếu API hỗ trợ search/filter qua FormData, hãy append ở đây
      // formData.append('keyword', search);
      // formData.append('status', currentFilter);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/noti`, {
        method: "POST",
        credentials: "include",
        body: formData
      });

      const data = await res.json();
      
      if (data.result) {
        // Map lại data nếu cấu trúc API khác với Interface
        const formattedData = data.result.content.map((noty: any) => ({
          notiId: noty.notiId,
          content: noty.content,
          type: noty.type || "SYSTEM",
          isRead: noty.isRead,
          from: noty.from || "Hệ thống",
          createdAt: noty.createdAt,
          updateAt: noty.updateAt
        }));

        setNotifications(formattedData);
        setTotalPages(data.result.totalPages || 0);
      }
    } catch (err: unknown) {
      console.error("Fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Gọi API mỗi khi trang, filter hoặc search thay đổi
  useEffect(() => {
    if (infoAdmin?.email) {
      fetchNotifications(infoAdmin.email, currentPage);
    }
  }, [infoAdmin, currentPage]); // Debounce searchTerm nếu cần thiết



  const getIcon = (type: string) => {
    switch (type?.toUpperCase()) {
      case 'SYSTEM': return <Info className="w-5 h-5 text-orange-500" />;
      case 'MESSAGE': return <MessageSquare className="w-5 h-5 text-blue-500" />;
      default: return <User className="w-5 h-5 text-slate-500" />;
    }
  };

   // Xử lý lọc dữ liệu

  const filteredNotifications = useMemo(() => {

    return notifications.filter(n => {

      const matchesFilter = filter === 'all' || !n.isRead;

      const matchesSearch = n.content.toLowerCase().includes(searchTerm.toLowerCase()) ||

                           n.from.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesFilter && matchesSearch;

    });

  }, [notifications, filter, searchTerm]);


   const unRead= useMemo(() => {

    return notifications.filter((n)=> n.isRead==false).length;

  }, [notifications]);


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
    setNotifications((prev) =>
      prev.map((n) => (n.notiId === notiId ? { ...n, isRead: true } : n))
    );
  };

  const markAllAsRead = async() => {
      const res=await fetch(`${process.env.NEXT_PUBLIC_API_URL}/noti/read`,{
            method:"PUT",
            headers: {'Content-Type':'application/json'},
            credentials:"include",
            body:JSON.stringify({
              notiIds:[...notifications.filter(n=>!n.isRead).map(n=>n.notiId)],
            
            })
        });

        const data=await res.json();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };
  return (
    <div className="min-h-screen ">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Quản lý thông báo</h1>
            <p className="text-slate-500 text-sm">
              Xem và quản lý các cập nhật từ hệ thống
            </p>
          </div>
          {unRead>0?(<>
                <button 
            onClick={markAllAsRead}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-all shadow-sm active:scale-95"
          >
            <CheckCheck className="w-4 h-4 text-orange-600" />
            Đánh dấu tất cả đã đọc
          </button>
          </>):(<></>)}
    
        </div>

        {/* Filters & Search */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 mb-6 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative w-full md:w-[70%]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text"
              placeholder="Tìm kiếm thông báo..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-orange-500/20 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && setCurrentPage(1)} // Search khi nhấn Enter
            />
          </div>
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg w-full md:w-auto">
            <button 
              onClick={() => { setFilter('all'); setCurrentPage(1); }}
              className={`flex-1 md:flex-none px-4 py-1.5 rounded-md text-sm font-medium transition-all ${filter === 'all' ? 'bg-white shadow text-orange-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Tất cả
            </button>
            <button 
              onClick={() => { setFilter('unread'); setCurrentPage(1); }}
              className={`flex-1 md:flex-none px-4 py-1.5 rounded-md text-sm font-medium transition-all ${filter === 'unread' ? 'bg-white shadow text-orange-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Chưa đọc
            </button>
          </div>
        </div>

        {/* Notification List */}
        <div className="space-y-3 mb-8 min-h-[400px] relative">
          {isLoading && (
            <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 flex items-center justify-center rounded-2xl">
              <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
            </div>
          )}

          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((item) => (
              <div 
                key={item.notiId}
                onClick={() => markAsRead(item.notiId)}
                className={`group relative flex items-start gap-4 p-5 bg-white rounded-2xl border transition-all cursor-pointer hover:shadow-md ${!item.isRead ? 'border-orange-100 bg-orange-50/10' : 'border-slate-100'}`}
              >
                <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${!item.isRead ? 'bg-white shadow-sm ring-1 ring-orange-100' : 'bg-slate-50'}`}>
                  {getIcon(item.type)}
                </div>

                <div className="flex-grow min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className={`text-sm truncate ${!item.isRead ? 'font-bold text-slate-900' : 'font-semibold text-slate-700'}`}>
                      Từ: {item.from}
                    </h3>
                    {!item.isRead && <span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>}
                  </div>
                  <p className="text-sm text-slate-500 line-clamp-2 mb-2 leading-relaxed">
                    {item.content}
                  </p>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {item.createdAt}
                    </span>
                    <span className="bg-slate-100 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                      {item.type}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col">
                  <button className="p-2 text-slate-300 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          ) : !isLoading && (
            <div className="py-20 text-center bg-white rounded-2xl border border-dashed border-slate-200">
              <Bell className="w-12 h-12 text-slate-200 mx-auto mb-3" />
              <p className="text-slate-500 font-medium">Không tìm thấy thông báo nào</p>
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between bg-white px-4 py-3 rounded-xl border border-slate-100 shadow-sm">
            <div className="text-sm text-slate-500 font-medium">
              Trang <span className="text-slate-900">{currentPage}</span> / {totalPages}
            </div>
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1 || isLoading}
                onClick={() => setCurrentPage(prev => prev - 1)}
                className="p-2 rounded-lg border border-slate-200 disabled:opacity-30 hover:bg-slate-50 transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-slate-600" />
              </button>
              
              {/* Hiển thị danh sách trang */}
              {Array.from({ length: totalPages }).map((_, i) => {
                const pageNum = i + 1;
                // Logic giới hạn số button hiển thị nếu có quá nhiều trang
                if (totalPages > 5 && Math.abs(currentPage - pageNum) > 2) return null;
                
                return (
                  <button
                    key={pageNum}
                    disabled={isLoading}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-8 h-8 rounded-lg text-sm font-bold transition-all ${currentPage === pageNum ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' : 'text-slate-500 hover:bg-slate-50'}`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                disabled={currentPage === totalPages || isLoading}
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="p-2 rounded-lg border border-slate-200 disabled:opacity-30 hover:bg-slate-50 transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-slate-600" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}