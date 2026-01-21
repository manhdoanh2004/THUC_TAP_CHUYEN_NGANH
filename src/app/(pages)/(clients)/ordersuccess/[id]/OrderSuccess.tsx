/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React, { useEffect, useState } from 'react';
import { 
  Calendar, 
  Building2, 
  Package, 
  CreditCard, 
  Receipt, 
  ExternalLink,
  ChevronRight,
  Loader2,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

const OrderSuccess = ({id}:{id:string}) => {
  // Mock data based on your JSON structure
//   const orderDetail = {
//     "createdAt": "2026-01-17T13:51:22.072Z",
//     "updateAt": "2026-01-17T13:51:22.073Z",
//     "id": 12045,
//     "code": "PAY-8829-QX",
//     "employer": {
//       "email": "hr@techcorp.vn",
//       "companyName": "TechCorp Solutions",
//       "address": "123 Đường Láng, Đống Đa, Hà Nội",
//       "phone": "0987.654.321",
//       "logo": "https://api.dicebear.com/7.x/initials/svg?seed=TC",
//     },
//     "vipPackage": {
//       "name": "Gói Tuyển Dụng Premium",
//       "price": 5000000,
//       "durationDays": 30,
//       "postLimit": 10,
//       "jobPostDurationDays": 15,
//       "description": "Ưu tiên hiển thị tin tuyển dụng lên đầu trang"
//     },
//     "amount": 5000000,
//     "status": "SUCCESS",
//     "vnpTxnRef": "240117001",
//     "vnpTransactionNo": "14285731",
//     "bankCode": "NCB",
//     "orderInfo": "Thanh toan goi VIP thang 01/2026"
//   };
const [isLoading, setIsLoading] = useState(true);
  const [orderDetail, setOrderDetail] = React.useState<any>(null);
const router=useRouter()
  const {infoCompany}=useAuth();

  useEffect( ()=>{
    if( !infoCompany ) return;
    const fetchOrderDetail=async()=>{

        try {
               const res=await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/${id}`,{
            method:'GET',
            credentials:'include',
        });

        const data=await res.json();
        if(data.code=="success")
        {
            setOrderDetail(data.result)
        }
        else{
            router.push('/')
        }
        } catch (error) {
              router.push('/')
        }finally{
            setIsLoading(false)
        }
     
    };

     fetchOrderDetail();
  },[infoCompany])
  const formatDate = (dateString:string) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (amount:number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const InfoRow = ({ label, value, icon: Icon }:{ label: string; value: string; icon?: React.ComponentType<{ className?: string }> }) => (
    <div className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0">
      <div className="flex items-center text-gray-500">
        {Icon && <Icon className="w-4 h-4 mr-2 opacity-70" />}
        <span className="text-sm">{label}</span>
      </div>
      <span className="font-medium text-gray-800 text-sm">{value}</span>
    </div>
  );

    if(isLoading) return<>
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="p-8 rounded-2xl  flex flex-col items-center max-w-sm w-full">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
        </div>
      </div>
    </>;
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6">
      <div className=" mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
         
          <h1 className="text-3xl font-bold text-gray-900">Thanh toán thành công!</h1>
          <p className="text-gray-600 mt-2">Cảm ơn bạn đã tin dùng dịch vụ của chúng tôi.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Invoice Card */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Chi tiết giao dịch</h2>
                    <p className="text-sm text-gray-500">Mã hóa đơn: {orderDetail.code}</p>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                    {orderDetail.status}
                  </span>
                </div>

                <div className="space-y-1">
                  <InfoRow label="Thời gian giao dịch" value={formatDate(orderDetail.createdAt)} icon={Calendar} />
                  <InfoRow label="Mã tham chiếu (TxnRef)" value={orderDetail.vnpTxnRef} icon={Receipt} />
                  <InfoRow label="Mã giao dịch ngân hàng" value={orderDetail.vnpTransactionNo} icon={ExternalLink} />
                  <InfoRow label="Ngân hàng" value={orderDetail.bankCode} icon={CreditCard} />
                  <InfoRow label="Nội dung" value={orderDetail.orderInfo} />
                </div>
              </div>
            </div>

            {/* Employer Info */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <Building2 className="w-5 h-5 text-blue-600 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900">Thông tin khách hàng</h2>
              </div>
              <div className="flex items-center mb-4 p-3 bg-gray-50 rounded-xl">
                <img 
                  src={orderDetail.employer.logo} 
                  alt="Company Logo" 
                  className="w-12 h-12 rounded-lg border border-gray-200 bg-white mr-4"
                />
                <div>
                  <h3 className="font-bold text-gray-900">{orderDetail.employer.companyName}</h3>
                  <p className="text-xs text-gray-500">{orderDetail.employer.email}</p>
                </div>
              </div>
              <div className="space-y-1">
                <InfoRow label="Số điện thoại" value={orderDetail.employer.phone} />
                <InfoRow label="Địa chỉ" value={orderDetail.employer.address} />
              </div>
            </div>
          </div>

          {/* Sidebar: Package & Summary */}
          <div className="space-y-6">
            <div className="bg-blue-600 rounded-2xl shadow-md text-white p-6 relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center mb-2">
                  <Package className="w-5 h-5 mr-2 opacity-80" />
                  <span className="text-sm font-medium opacity-90">Thông tin gói</span>
                </div>
                <h3 className="text-xl font-bold mb-4">{orderDetail.vipPackage.name}</h3>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="opacity-80">Thời hạn:</span>
                    <span className="font-semibold">{orderDetail.vipPackage.durationDays} ngày</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="opacity-80">Giới hạn số tin đăng:</span>
                    <span className="font-semibold">{orderDetail.vipPackage.postLimit} tin</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="opacity-80">Hiển thị tin:</span>
                    <span className="font-semibold">{orderDetail.vipPackage.jobPostDurationDays} ngày</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="opacity-80">Giới hạn số tin đăng trong 1 tuần:</span>
                    <span className="font-semibold">{orderDetail.vipPackage.weeklyPostLimit} ngày</span>
                  </div>
                </div>
                
                <div className="border-t border-blue-400 pt-4 mt-4">
                  <p className="text-xs opacity-75 mb-1 text-center">TỔNG THANH TOÁN</p>
                  <p className="text-2xl font-black text-center">{formatCurrency(orderDetail.amount)}</p>
                </div>
              </div>
              {/* Background pattern */}
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white opacity-10 rounded-full"></div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-1 gap-3">
              
              <button className="flex items-center justify-center w-full py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-black transition-colors">
                Quay lại trang chủ <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        </div>
        
        
      </div>
    </div>
  );
};

export default OrderSuccess;