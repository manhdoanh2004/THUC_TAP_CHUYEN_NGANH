/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { 
  Check, Zap, Shield, ArrowLeft, 
  CreditCard, Wallet, CheckCircle2, Building2, 
  Hash, 
  Crown,
  ArrowRight
} from 'lucide-react';
import { useRouter } from 'next/navigation';

import Link from 'next/link';
import { MdKeyboardArrowRight, MdOutlineKeyboardDoubleArrowRight } from "react-icons/md";
import { useAuth } from '@/context/AuthContext';

/** * TYPES & INTERFACES 
 */
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

interface Employer {
  email: string;
  employerId: string;
  companyName: string;
}

interface OrderData {
  createdAt: string;
  updateAt: string;
  id: number;
  code: string;
  employer: Employer;
  vipPackage: VipPackage;
  amount: number;
  status: string;
  vnpTxnRef: string;
  vnpTransactionNo: string;
  bankCode: string;
  orderInfo: string;
}


/**
 * MAIN APP COMPONENT
 */
const ServicePackages: React.FC = () => {
  const [selectedOrder, setSelectedOrder] = useState<any | null>([]);
  const [servicePackage, setServicePackage] = useState<any | null>([]);
  const [isPaid, setIsPaid] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const {isLogin,infoCompany}=useAuth();
  const router=useRouter()

   useEffect(() => {

    if(!infoCompany) return;
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/vip-packages`, {
        credentials: 'include',
        
      })
        .then(res => res.json())
        .then(data => {
        setServicePackage(data.result
                .filter((item: any) => item.isActive === true)
                .slice(0, 3));
                })
    }, [infoCompany]);
  const formatVND = (price:number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };


  if(!infoCompany){
    return null};
  return (
    <div className="container mx-auto px-[16px] mb-[40px] bg-neutral-50  ">
      <div className="  text-center">
        <div>

             <h1 className="text-[28px] font-black text-neutral-900 tracking-tight mb-4 ">Dịch Vụ Tuyển Dụng</h1>
             
        </div>
     <Link href={""} className="flex items-center justify-end text-[18px] text-[#000071] hover:text-[#155DFC]">
             Xem tất cả gói dịch vụ
             <MdKeyboardArrowRight size={25} className='text-[40px] ' />
             </Link>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 justify-center  mt-[35px]">
          {servicePackage && servicePackage.length > 0 ? (
           <>
               {servicePackage?.filter((service: any) => service.code !=="DEFAULT").map((service:any) => { return   <div 
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
            </div>})}
           </>
          ):(<></>)}
      
        </div>
      </div>
    </div>
  );
};


const FeatureItem = ({ label, value }: { label: string, value: any }) => (
  <div className="flex justify-between items-center text-sm">
    <div className="flex items-center gap-2 text-neutral-500">
      <Check className="w-4 h-4 text-green-500 stroke-[3px]" />
      <span>{label}</span>
    </div>
    <span className="font-bold text-neutral-900">{value}</span>
  </div>
);

const PaymentOption = ({ id, current, set, icon, title, desc }: any) => (
  <div 
    onClick={() => set(id)}
    className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${current === id ? 'border-blue-600 bg-blue-50' : 'border-neutral-100 hover:border-neutral-200'}`}
  >
    <div className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center ${current === id ? 'border-blue-600' : 'border-neutral-300'}`}>
      {current === id && <div className="w-2.5 h-2.5 bg-blue-600 rounded-full" />}
    </div>
    <div className="p-2 bg-white rounded-lg border border-neutral-100 mr-4">{icon}</div>
    <div><p className="font-bold text-sm">{title}</p><p className="text-xs text-neutral-500">{desc}</p></div>
  </div>
);

export default ServicePackages;