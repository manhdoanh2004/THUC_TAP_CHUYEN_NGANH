/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React, { useState, useMemo, useEffect } from 'react';
import Swal from 'sweetalert2';

// --- CONFIG & MAPS ---
const ROLE_LABELS: any = {
    'ROLE_CANDIDATE': 'Ứng viên',
    'ROLE_EMPLOYER': 'Nhà tuyển dụng',
};

// --- ICONS ---
const LockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 00-2 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
);
const UnlockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" /></svg>
);
const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
);
const ChevronLeft = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
);
const ChevronRight = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
);

// --- COMPONENT SPINNER TOÀN MÀN HÌNH ---
const FullPageLoading = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-500 dark:text-gray-400 font-medium animate-pulse">Đang tải dữ liệu...</p>
    </div>
);

const UserManager = () => {
    const [userData, setUserData] = useState<any | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('ALL');
    const [currentPage, setCurrentPage] = useState(0);
    const [count, setCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true); 

    const displayedUsers = useMemo(() => {
        if (!userData || !userData.content) return [];
        return userData.content.filter((user: any) => {
            const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesSearch;
        });
    }, [userData, searchTerm]);

    useEffect(() => {
        const fetchUserManager = async () => {
            setIsLoading(true);
            try {
                const res = await fetch(`http://localhost:8080/admin/users/all`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        page: currentPage,
                        role: roleFilter === "ALL" ? "" : roleFilter,
                        size: 10
                    }),
                    credentials: "include"
                });

                const data = await res.json();
                if (data.code === "success") {
                    setUserData(data.result);
                }
            } catch (error) {
                console.log(error);
            } finally {
              
                setIsLoading(false);
            }
        };

        fetchUserManager();
    }, [roleFilter, currentPage,count]);

    const confirmAction = async (title: string, text: string, icon: any, color: string) => {
        return await Swal.fire({
            title, text, icon,
            showCancelButton: true,
            confirmButtonColor: color,
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Xác nhận',
            cancelButtonText: 'Hủy',
            background: document.documentElement.classList.contains('dark') ? '#1f2937' : '#fff',
            color: document.documentElement.classList.contains('dark') ? '#fff' : '#000',
        });
    };

    const handleToggleLock = async (user: any) => {
        const isLocking = !user.isLocked;
        const res = await confirmAction(
            isLocking ? 'Khóa tài khoản?' : 'Mở khóa?',
            `Thao tác với tài khoản ${user.name}`,
            'warning',
            isLocking ? '#ef4444' : '#10b981'
        );
        if (res.isConfirmed) {

          const respone=await fetch(`http://localhost:8080/admin/users/lock-status`,{
            method:"PUT",
            headers:{
              "Content-Type":"application/json"
            },
            body:JSON.stringify({
              userId:user.id,
              isLocked:isLocking
            }),
            credentials:"include"
          });
            const data=await respone.json();
            if(data.code=="success")
            {
              setCount((pre)=> pre+1 );
            Swal.fire('Thành công', '', 'success');
            }
           
        }
    };

    const handleDelete = async (user: any) => {
   
        const res = await confirmAction('Xóa vĩnh viễn?', user.name, 'error', '#dc2626');
        if (res.isConfirmed) {
          const respone=await fetch(`http://localhost:8080 /admin/users/${user.id}`,{
            method:"DELETE",
            credentials:"include"
          });
            const data=await respone.json();
            if(data.code=="success")
            {
              setCount((pre)=> pre+1 );
           
            Swal.fire('Đã xóa', '', 'success');
            }
           
        }
    };

    // Nếu đang tải lần đầu (chưa có dữ liệu), hiện loading toàn trang
    if (isLoading && !userData) {
        return <FullPageLoading />;
    }

    return (
        <div className="p-4 sm:p-8 min-h-screen bg-gray-50 dark:bg-gray-900 font-sans text-gray-900 dark:text-gray-100 transition-opacity duration-500">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-2xl font-bold mb-6 tracking-tight">Quản lý người dùng</h1>

                <div className="bg-white dark:bg-gray-800 shadow-sm rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden relative">
                    
                    {/* FILTER BAR */}
                    <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex flex-col md:flex-row gap-4">
                        <input
                            placeholder="Tìm kiếm nhanh..."
                            className="flex-1 h-11 px-4 text-sm border border-gray-200 rounded-xl dark:bg-gray-900 dark:border-gray-700 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <select
                            value={roleFilter}
                            className="h-11 px-4 text-sm border border-gray-200 rounded-xl dark:bg-gray-900 dark:border-gray-700 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer"
                            onChange={(e) => setRoleFilter(e.target.value)}
                        >
                            <option value="ALL">Tất cả vai trò</option>
                            <option value="ROLE_CANDIDATE">Ứng viên</option>
                            <option value="ROLE_EMPLOYER">Nhà tuyển dụng</option>
                        </select>
                    </div>

                    {/* TABLE AREA */}
                    <div className="overflow-x-auto relative ">
                        {/* Overlay loading nhẹ khi chuyển trang hoặc lọc (giúp app mượt mà hơn) */}
                        {isLoading && (
                            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/40 dark:bg-gray-800/40 backdrop-blur-[1px]">
                                <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                            </div>
                        )}

                        <table className="min-w-full divide-y divide-gray-100 dark:divide-gray-700">
                            <thead className="bg-gray-50/50 dark:bg-gray-700/30 text-gray-400">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold  tracking-widest">Người dùng</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold  tracking-widest">Vai trò</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold  tracking-widest">Trạng thái</th>
                                    <th className="px-6 py-4 text-right text-xs font-bold  tracking-widest">Hành động</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {displayedUsers.length > 0 ? (
                                    displayedUsers.map((user: any) => (
                                        <tr key={user.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/20 transition-all">
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-semibold">{user.name}</div>
                                                <div className="text-xs text-gray-400 font-medium">{user.email}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-[10px] font-bold px-2 py-1 rounded-md bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 ">
                                                    {ROLE_LABELS[user.role]}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold ${user.isLocked ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                                                    <div className={`w-1.5 h-1.5 rounded-full ${user.isLocked ? 'bg-red-500' : 'bg-emerald-500'}`} />
                                                    {user.isLocked ? 'Bị khóa' : `${user.enabled ? "Đang hoạt động" : "Không hoạt động"}`}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2.5">
                                                    <button onClick={() => handleToggleLock(user)} className={`p-2 rounded-xl border transition-all ${user.isLocked ? 'text-emerald-500 border-emerald-100 hover:bg-emerald-50' : 'text-amber-500 border-amber-100 hover:bg-amber-50'}`}>
                                                        {user.isLocked ? <UnlockIcon /> : <LockIcon />}
                                                    </button>
                                                    <button onClick={() => handleDelete(user)} className="p-2 rounded-xl border border-red-100 text-red-500 hover:bg-red-50 transition-all">
                                                        <TrashIcon />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    !isLoading && (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-10 text-center text-gray-400 font-medium">
                                                Không tìm thấy người dùng nào.
                                            </td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* PAGINATION */}
                    <div className="p-5 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                        <span className="text-sm font-bold text-gray-400 tracking-tighter ">
                            Tổng số người dùng : {userData?.totalElements || 0}
                        </span>
                        <div className="flex items-center gap-2">
                            <button
                                disabled={currentPage === 0 || isLoading}
                                onClick={() => setCurrentPage(p => p - 1)}
                                className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 dark:border-gray-700 disabled:opacity-20 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all text-gray-500"
                            >
                                <ChevronLeft />
                            </button>

                            <div className="flex items-center gap-1.5">
                                {[...Array(userData?.totalPages || 0)].map((_, i) => (
                                    <button
                                        key={i}
                                        disabled={isLoading}
                                        onClick={() => setCurrentPage(i)}
                                        className={`w-10 h-10 text-sm font-bold rounded-xl transition-all ${currentPage === i ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>

                            <button
                                disabled={currentPage >= (userData?.totalPages || 0) - 1 || isLoading}
                                onClick={() => setCurrentPage(p => p + 1)}
                                className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 dark:border-gray-700 disabled:opacity-20 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all text-gray-500"
                            >
                                <ChevronRight />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserManager;