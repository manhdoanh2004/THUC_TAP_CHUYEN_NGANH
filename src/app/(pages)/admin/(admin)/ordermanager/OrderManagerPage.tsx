/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

'use client'
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Trash2, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Eye,
  Calendar,
  CreditCard,
  Building2,
  Package,
  Info,
  Wallet,
  FileText,
  History,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

// --- Types & Interfaces ---
interface Employer {
  createdAt: string;
  updateAt: string;
  email: string;
  isLocked: boolean;
  employerId: string;
  companyName: string;
  city: any[];
  address: string | null;
  enabled: boolean;
  phone: string | null;
}

interface VipPackage {
  createdAt: string;
  updateAt: string;
  id: number;
  code: string;
  name: string;
  price: number;
  durationDays: number;
  postLimit: number;
  weeklyPostLimit: number | null;
  jobPostDurationDays: number;
  description: string;
  isActive: boolean;
}

interface Order {
  createdAt: string;
  updateAt: string;
  id: number;
  code: string;
  employer: Employer;
  vipPackage: VipPackage;
  amount: number;
  status: 'SUCCESS' | 'PENDING' | 'CANCELLED' | string;
  vnpTxnRef: string;
  vnpTransactionNo: string;
  bankCode: string;
  orderInfo: string;
  paymentMethod: 'VNPAY' | 'MOMO' | 'ZALOPAY' | string;
};

const statusOrder:{[key: string]: string }={
  'PENDING':"Chờ xử lý",
  'SUCCESS':"Thanh toán thành công",
 
}
export const OrderManagerPage=()=>
{
    const [orders, setOrders] = useState<Order[]|any>(null);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [totalElements, setTotalElements] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSwalLoaded, setIsSwalLoaded] = useState(false);
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchOrderList=async()=>{

     const res=await fetch(`http://localhost:8080/api/orders/filter`,{
        credentials:"include",
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
          page: currentPage-1,
          size: 10,
      
        })
    });

    const data= await res.json();

 
    if(data.code=="success")
    {
      setOrders(data.result.content)
      setTotalPages(data.result.totalPages)
      setTotalElements(data.result.totalElements)
    }
    }

 // call api lấy danh sách đơn hàng
  useEffect(()=>{

   
    fetchOrderList();
  },[currentPage])

  useEffect(() => {
    if ((window as any).Swal) {
      setIsSwalLoaded(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/sweetalert2@11';
    script.async = true;
    script.onload = () => setIsSwalLoaded(true);
    document.body.appendChild(script);
    return () => { if (document.body.contains(script)) document.body.removeChild(script); };
  }, []);

  const getSwal = () => (window as any).Swal;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const getPaymentMethodStyle = (method= 'VNPAY') => {
    switch (method) {
      case 'VNPAY': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'MOMO': return 'bg-pink-50 text-pink-700 border-pink-200';
      case 'ZALOPAY': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const handleViewDetail = useCallback((order: Order) => {
    const swal = getSwal();
    if (!swal) return;

    const pkg = order.vipPackage;

    swal.fire({
      title: `<div class="text-xl text-slate-800 pt-2 font-medium">Chi tiết giao dịch #${order.code.substring(0, 8)}</div>`,
      width: '800px',
      html: `
        <div class="text-left font-sans mt-4 max-h-[70vh] overflow-y-auto px-4 custom-scroll">
          
          <!-- PHẦN 1: THÔNG TIN THANH TOÁN -->
          <div class="mb-8">
            <h4 class="flex items-center gap-2 text-blue-600 font-medium text-sm mb-4 border-b pb-2">
              <Info size={16} /> Thông tin giao dịch
            </h4>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-6 text-sm">
              <div class="col-span-2 md:col-span-1">
                <p class="text-slate-500 text-[11px] tracking-tight">Mã đơn hàng</p>
                <p class="font-mono text-xs break-all text-slate-700">${order.code}</p>
              </div>
              <div>
                <p class="text-slate-500 text-[11px] tracking-tight">Trạng thái</p>
                <p class="${order.status === 'SUCCESS' ? 'text-green-600' : 'text-amber-600'} flex items-center gap-1">
                  ${order.status === 'SUCCESS' ? ' Thành công' : ' Đang chờ'}
                </p>
              </div>
              <div>
                <p class="text-slate-500 text-[11px] tracking-tight">Tổng thanh toán</p>
                <p class="text-lg text-blue-600">${formatCurrency(order.amount)}</p>
              </div>
              <div>
                <p class="text-slate-500 text-[11px] tracking-tight">Phương thức</p>
                <p class="text-indigo-700">VNPAY</p>
              </div>
              <div>
                <p class="text-slate-500 text-[11px] tracking-tight">Mã tham chiếu</p>
                <p class="font-mono text-xs">${order.vnpTxnRef}</p>
              </div>
              <div>
                <p class="text-slate-500 text-[11px] tracking-tight">Thời gian tạo</p>
                <p class="text-slate-700">${order.createdAt}</p>
              </div>
            </div>
          </div>

          <!-- PHẦN 2: CHI TIẾT GÓI VIP -->
          <div class="mb-8 bg-amber-50/50 p-5 rounded-2xl border border-amber-100">
            <h4 class="flex items-center gap-2 text-amber-700 font-medium text-sm mb-4 border-b border-amber-200 pb-2">
              <Package size={18} /> Chi tiết gói dịch vụ: ${pkg.name}
            </h4>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div class="bg-white p-3 rounded-xl border border-amber-100 shadow-sm text-center">
                <p class="text-slate-500 text-[10px]">Mã gói</p>
                <p class="text-amber-600">${pkg.code}</p>
              </div>
              <div class="bg-white p-3 rounded-xl border border-amber-100 shadow-sm text-center">
                <p class="text-slate-500 text-[10px]">Thời hạn</p>
                <p class="text-slate-800">${pkg.durationDays} ngày</p>
              </div>
              <div class="bg-white p-3 rounded-xl border border-amber-100 shadow-sm text-center">
                <p class="text-slate-500 text-[10px]">Tổng bài đăng</p>
                <p class="text-slate-800">${pkg.postLimit?`${pkg.postLimit}`:" Không giới hạn bài đăng"} </p>
              </div>
              <div class="bg-white p-3 rounded-xl border border-amber-100 shadow-sm text-center">
                <p class="text-slate-500 text-[10px]">Giới hạn/Tuần</p>
                <p class="text-slate-800">${pkg.weeklyPostLimit || 'Không giới hạn'}</p>
              </div>
              <div class="bg-white p-3 rounded-xl border border-amber-100 shadow-sm col-span-2">
                <p class="text-slate-500 text-[10px]">Thời gian hiển thị tin</p>
                <p class="text-slate-800">${pkg.jobPostDurationDays} ngày / bài đăng</p>
              </div>
              <div class="bg-white p-3 rounded-xl border border-amber-100 shadow-sm col-span-2">
                <p class="text-slate-500 text-[10px]">Trạng thái gói</p>
                <p class="${pkg.isActive ? 'text-green-600' : 'text-red-600'}">${pkg.isActive ? 'Đang hoạt động' : 'Ngừng hoạt động'}</p>
              </div>
              <div class="col-span-full">
                <p class="text-slate-500 text-[10px] mb-1">Mô tả dịch vụ</p>
                <p class="text-slate-700 italic text-xs leading-relaxed">"${pkg.description}"</p>
              </div>
            </div>
          </div>

          <!-- PHẦN 3: THÔNG TIN ĐỐI TÁC -->
          <div class="mb-4">
            <h4 class="flex items-center gap-2 text-slate-600 font-medium text-sm mb-4 border-b pb-2">
              <Building2 size={16} /> Thông tin đối tác
            </h4>
            <div class="grid grid-cols-2 gap-4 text-sm px-2">
              <div class="col-span-2">
                <p class="text-slate-500 text-[11px] tracking-tight">Tên doanh nghiệp</p>
                <p class="text-slate-800 text-base font-medium">${order.employer.companyName}</p>
              </div>
              <div>
                <p class="text-slate-500 text-[11px] tracking-tight">Mã công ty :</p>
                <p class="font-mono text-xs">${order.employer.employerId}</p>
              </div>
              <div>
                <p class="text-slate-500 text-[11px] tracking-tight">Email liên hệ</p>
                <p class="text-blue-600 underline">${order.employer.email}</p>
              </div>
            </div>
          </div>
        </div>
      `,
      confirmButtonText: 'Đóng',
      confirmButtonColor: '#1e293b',
      customClass: {
        popup: 'rounded-[2rem] border-none shadow-2xl',
        confirmButton: 'rounded-xl px-10 py-3 tracking-widest text-xs'
      },
      showCloseButton: true,
    });
  }, []);





  const handleDeleteOrder = useCallback(  (order: Order) => {
    const swal = getSwal();
    if (!swal) return;
    swal.fire({
      title: 'Xác nhận xóa?',
      text: "Dữ liệu đơn hàng sẽ bị xóa vĩnh viễn!.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy',
      confirmButtonColor: '#ef4444',
      customClass: { popup: 'rounded-2xl' }
    }).then( async (result: any) => {
      if (result.isConfirmed) {

          const res =await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/${order.id}`,{
            method:"DELETE",
            credentials:"include"
          });
          const data= await res.json();
        if(data.code=="success")
          {
              await fetchOrderList();
          }    
      }
    });
  }, []);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'SUCCESS': return 'bg-green-100 text-green-700 border-green-200';
      case 'PENDING': return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const filteredOrders = useMemo(() => {
   if(orders) return orders.filter((order:any) => 
      order.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.employer.companyName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    else return null;
  }, [orders, searchTerm]);



  if(!orders) return  <div className="flex items-center justify-center min-h-[200px] w-full">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
  return (
    <>
     <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-900 font-normal">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl text-slate-900 tracking-tighter flex items-center gap-2 font-medium">
           
              Quản lý đơn hàng
              {!isSwalLoaded && <span className="animate-pulse h-2 w-2 rounded-full bg-amber-400"></span>}
            </h1>
          
          </div>
          <div className="bg-white border border-slate-200 px-5 py-2.5 rounded-2xl text-sm shadow-sm flex items-center gap-3">
            <span className="text-slate-500 text-[10px] tracking-widest">Tổng đơn hàng :</span> 
            <span className="text-blue-600 font-medium">{totalElements} đơn hàng</span>
          </div>
        </div>

        {/* <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm mb-6 flex items-center gap-4 focus-within:ring-4 focus-within:ring-blue-50 transition-all">
          <Search className="text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Tìm theo mã đơn, công ty..." 
            className="flex-1 outline-none text-slate-700 placeholder:text-slate-400 bg-transparent text-sm font-normal"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div> */}

        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden mb-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="p-5 text-[10px] text-slate-400 tracking-[0.2em] font-medium">Mã đơn</th>
                  <th className="p-5 text-[10px] text-slate-400 tracking-[0.2em] font-medium">Phương thức</th>
                  <th className="p-5 text-[10px] text-slate-400 tracking-[0.2em] font-medium">Đối tác</th>
                  <th className="p-5 text-[10px] text-slate-400 tracking-[0.2em] text-right font-medium">Số tiền</th>
                  <th className="p-5 text-[10px] text-slate-400 tracking-[0.2em] text-center font-medium">Trạng thái</th>
                  <th className="p-5 text-[10px] text-slate-400 tracking-[0.2em] text-right font-medium">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders?(<>{ filteredOrders.map((order:any) => (
                    <tr key={order.id} className="hover:bg-blue-50/30 transition-all group">
                      <td className="p-5">
                        <div className="flex flex-col">
                          <span className="font-mono text-xs text-blue-600">#{order.code.substring(0, 8)}</span>
                          <span className="text-slate-400 text-[10px] mt-0.5">{order.createdAt.split(' ')[0]}</span>
                        </div>
                      </td>
                      <td className="p-5">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[9px] border tracking-wider ${getPaymentMethodStyle('VNPAY')}`}>
                          {'VNPAY'}
                        </span>
                      </td>
                      <td className="p-5">
                        <div className="flex flex-col max-w-[220px]">
                          <span className="text-slate-800 text-sm truncate tracking-tight font-medium uppercase">{order.employer.companyName}</span>
                          <span className="text-slate-400 text-[10px] truncate">{order.employer.email}</span>
                        </div>
                      </td>
                      <td className="p-5 text-right">
                        <span className="text-slate-900 text-sm tracking-tighter">{formatCurrency(order.amount)}</span>
                      </td>
                      <td className="p-5 text-center">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] border shadow-sm ${getStatusStyle(order.status)}`}>
                          {statusOrder[order?.status] || "Không xác định"}
                        </span>
                      </td>
                      <td className="p-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleViewDetail(order)}
                            className="p-2.5 text-slate-400 hover:text-blue-600 transition-all"
                          >
                            <Eye size={18} />
                          </button>
                          <button 
                            onClick={() => handleDeleteOrder(order)}
                            className="p-2.5 text-slate-400 hover:text-red-600   transition-all "
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}</>):(<></>)}
                {/* {paginatedOrders.length > 0 ? (
                  paginatedOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-blue-50/30 transition-all group">
                      <td className="p-5">
                        <div className="flex flex-col">
                          <span className="font-mono text-xs text-blue-600">#{order.code.substring(0, 8)}</span>
                          <span className="text-slate-400 text-[10px] mt-0.5">{order.createdAt.split(' ')[0]}</span>
                        </div>
                      </td>
                      <td className="p-5">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[9px] border tracking-wider ${getPaymentMethodStyle('VNPAY')}`}>
                          {'VNPAY'}
                        </span>
                      </td>
                      <td className="p-5">
                        <div className="flex flex-col max-w-[220px]">
                          <span className="text-slate-800 text-sm truncate tracking-tight font-medium uppercase">{order.employer.companyName}</span>
                          <span className="text-slate-400 text-[10px] truncate">{order.employer.email}</span>
                        </div>
                      </td>
                      <td className="p-5 text-right">
                        <span className="text-slate-900 text-sm tracking-tighter">{formatCurrency(order.amount)}</span>
                      </td>
                      <td className="p-5 text-center">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] border shadow-sm ${getStatusStyle(order.status)}`}>
                          {statusOrder[order?.status] || "Không xác định"}
                        </span>
                      </td>
                      <td className="p-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleViewDetail(order)}
                            className="p-2.5 text-slate-400 hover:text-blue-600 transition-all"
                          >
                            <Eye size={18} />
                          </button>
                          <button 
                            onClick={() => handleDeleteOrder(order)}
                            className="p-2.5 text-slate-400 hover:text-red-600   transition-all "
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={6} className="p-20 text-center text-slate-300 tracking-widest text-xs">Dữ liệu trống</td></tr>
                )} */}
              </tbody>
            </table>
          </div>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-xs text-slate-500 ">
              Hiển thị {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, itemsPerPage+filteredOrders.length)} trong số {totalElements} đơn hàng
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg border border-slate-200 transition-all ${currentPage === 1 ? 'text-slate-200 bg-slate-50 cursor-not-allowed' : 'text-slate-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-100'}`}
              >
                <ChevronLeft size={18} />
              </button>
              
              <div className="flex items-center gap-1">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`h-8 w-8 rounded-lg text-xs transition-all ${currentPage === i + 1 ? 'bg-blue-600 text-white shadow-md shadow-blue-200' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'}`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-lg border border-slate-200 transition-all ${currentPage === totalPages ? 'text-slate-200 bg-slate-50 cursor-not-allowed' : 'text-slate-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-100'}`}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
      <style>{`
        .custom-scroll::-webkit-scrollbar { width: 6px; }
        .custom-scroll::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 10px; }
        .custom-scroll::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .custom-scroll::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}</style>
    </div>
    </>
   
  )
}