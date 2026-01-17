/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { Shield, Check, Zap, Crown, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import ServiceSkeleton from '@/components/card/ServiceSkeleton';

// Giả định dữ liệu API trả về
const MOCK_DATA = [
  {
    id: "1",
    code: "BASIC",
    name: "Gói Cơ Bản",
    description: "Giải pháp tiết kiệm cho cá nhân mới bắt đầu đăng tuyển dụng.",
    price: 500000,
    durationDays: 30,
    postLimit: 5,
    jobPostDurationDays: 15,
    weeklyPostLimit: 2,
    isActive: true
  },
  {
    id: "2",
    code: "PRO",
    name: "Gói Chuyên Nghiệp",
    description: "Tăng khả năng tiếp cận ứng viên tiềm năng gấp 3 lần gói thường.",
    price: 1500000,
    durationDays: 60,
    postLimit: 20,
    jobPostDurationDays: 30,
    weeklyPostLimit: 5,
    isActive: true
  },
  {
    id: "3",
    code: "VIP",
    name: "Gói Doanh Nghiệp",
    description: "Hỗ trợ tối đa các tính năng đẩy tin và quản lý ứng viên cao cấp.",
    price: 5000000,
    durationDays: 90,
    postLimit: 100,
    jobPostDurationDays: 45,
    weeklyPostLimit: 15,
    isActive: true
  }
];

// Component con hiển thị từng dòng tính năng
const FeatureItem = ({ label, value }:{ label: string, value: any }) => (
  <div className="flex justify-between items-center group">
    <div className="flex items-center space-x-2">
      <div className="p-1 bg-green-50 rounded-full group-hover:bg-green-100 transition-colors">
        <Check className="w-4 h-4 text-green-600" />
      </div>
      <span className="text-neutral-600 text-sm">{label}</span>
    </div>
    <span className="font-bold text-neutral-900 text-sm">{value}</span>
  </div>
);

const ServicePackageList = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
const {isLogin,infoCompany}=useAuth();
  const router =useRouter();

 
    useEffect(() => {
 
     if(!infoCompany) return;
       fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/vip-packages`, {
         credentials: 'include',
         
       })
         .then(res => res.json())
         .then(data => {
         setServices(data.result)
         setLoading(false);
     })}, [infoCompany]);



  const formatVND = (price:number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-16 px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-black text-neutral-900 mb-6">
          Nâng cấp gói để <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">tuyển dụng nhanh hơn</span>
        </h1>
        <p className="text-neutral-500 max-w-2xl mx-auto text-lg">
          Lựa chọn gói dịch vụ phù hợp với nhu cầu của doanh nghiệp bạn để tối ưu hóa quy trình tìm kiếm nhân tài.
        </p>
      </div>

      {/* Grid List */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          // Hiển thị đơn giản khi đang load 
          [1, 2, 3].map(i => <ServiceSkeleton key={i} />)
        ) : (
          services.map((service:any) => (
            <div 
              key={service.id} 
              className={`bg-white rounded-3xl border p-8 shadow-sm hover:shadow-2xl transition-all duration-500 text-left flex flex-col relative group overflow-hidden
                ${service.code === 'PRO' ? 'border-blue-200 ring-2 ring-blue-500/10' : 'border-neutral-200'}`}
            >
              {/* Badge nổi bật cho gói phổ biến */}
              {service.code === 'PRO' && (
                <div className="absolute top-0 right-0 bg-blue-600 text-white px-6 py-1 rounded-bl-2xl font-bold text-xs">
                  PHỔ BIẾN NHẤT
                </div>
              )}

              <div className="flex justify-between items-start mb-6">
                <div className={`p-4 rounded-2xl transition-colors duration-300 
                  ${service.code === 'VIP' ? 'bg-orange-50 text-orange-600 group-hover:bg-orange-100' : 
                    service.code === 'PRO' ? 'bg-blue-50 text-blue-600 group-hover:bg-blue-100' : 
                    'bg-neutral-50 text-neutral-600 group-hover:bg-neutral-100'}`}>
                  {service.code === 'VIP' ? <Crown className="w-8 h-8" /> : 
                   service.code === 'PRO' ? <Zap className="w-8 h-8" /> : 
                   <Shield className="w-8 h-8" />}
                </div>
                <span className="px-3 py-1 bg-neutral-100 text-neutral-500 rounded-full text-[10px] font-bold uppercase tracking-wider">
                  {service.code}
                </span>
              </div>

              <h3 className="text-2xl font-bold text-neutral-900 mb-2">{service.name}</h3>
              <p className="text-neutral-500 text-sm mb-6 line-clamp-2 h-10">{service.description}</p>
              
              <div className="text-3xl font-black text-neutral-900 mb-8 flex items-baseline">
                {formatVND(service.price)}
                <span className="text-sm text-neutral-400 font-medium ml-1">/{service.durationDays} ngày</span>
              </div>

              <div className="space-y-4 border-t border-neutral-100 pt-6 mb-8 flex-grow">
                <FeatureItem label="Tổng tin đăng" value={service.postLimit} />
                <FeatureItem label="Ngày hiển thị tin" value={`${service.jobPostDurationDays} ngày`} />
                <FeatureItem label="Giới hạn đăng tin" value={`${service.weeklyPostLimit} tin/tuần`} />
                {service.code === 'VIP' && <FeatureItem label="Hỗ trợ ưu tiên" value="24/7" />}
              </div>

              <button 
                onClick={() => { router.push(`/payment/${service.id}`) }} 
                className={`w-full py-4 rounded-2xl font-bold transition-all duration-300 flex items-center justify-center group/btn shadow-lg
                  ${service.code === 'PRO' 
                    ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200' 
                    : 'bg-neutral-900 text-white hover:bg-blue-600 shadow-neutral-200'}`}
              >
                <span>Kích hoạt ngay</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Footer Info */}
      {/* <div className="mt-16 text-center text-neutral-500 text-sm max-w-lg mx-auto bg-white p-4 rounded-2xl border border-neutral-100 shadow-sm">
        <p>Cần tư vấn gói lớn hơn cho doanh nghiệp? <span className="text-blue-600 font-bold cursor-pointer hover:underline">Liên hệ ngay</span></p>
      </div> */}
    </div>
  );
};

export default ServicePackageList;