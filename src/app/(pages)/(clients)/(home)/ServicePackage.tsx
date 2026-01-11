'use client'
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { 
  Check, Zap, Shield, ArrowLeft, 
  CreditCard, Wallet, CheckCircle2, Building2, 
  Hash 
} from 'lucide-react';

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
 * COMPONENT: Trang hiển thị kết quả thanh toán thành công
 */
const PaymentSuccess: React.FC<{ order: OrderData; onBack: () => void }> = ({ order, onBack }) => {
  const formatCurrency = (amount: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

  return (
    <div className="min-h-screen bg-neutral-50 py-12 px-4 flex justify-center items-start">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl border border-neutral-100 overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="bg-green-500 p-8 text-center text-white">
          <CheckCircle2 className="w-16 h-16 mx-auto mb-4" />
          <h2 className="text-3xl font-black italic">THANH TOÁN THÀNH CÔNG</h2>
          <p className="opacity-90 mt-2 font-medium">Giao dịch của bạn đã hoàn tất</p>
        </div>

        <div className="p-8 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-4 text-neutral-400">
              <Hash className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-widest">Chi tiết giao dịch</span>
            </div>
            <div className="grid grid-cols-2 gap-y-3 text-sm">
              <DetailRow label="Mã đơn hàng" value={order.code} isBold />
              <DetailRow label="Mã GD VNPay" value={order.vnpTransactionNo} />
              <DetailRow label="Số tiền" value={formatCurrency(order.amount)} isBold />
              <DetailRow label="Ngân hàng" value={order.bankCode} />
              <DetailRow label="Ngày tạo" value={order.createdAt} />
              <DetailRow label="Trạng thái" value={order.status} isStatus />
            </div>
          </div>

          <div className="bg-neutral-50 p-6 rounded-2xl">
            <div className="flex items-center gap-2 mb-4 text-blue-600">
              <Building2 className="w-5 h-5" />
              <span className="font-bold uppercase text-xs tracking-wider">Nhà tuyển dụng</span>
            </div>
            <p className="font-bold text-neutral-900">{order.employer.companyName}</p>
            <p className="text-sm text-neutral-500 mt-1">{order.employer.email}</p>
            <p className="text-[10px] text-neutral-400 mt-2">ID: {order.employer.employerId}</p>
          </div>

          <div className="border-t border-dashed border-neutral-200 pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><Shield className="w-5 h-5" /></div>
                <div>
                  <p className="font-bold text-neutral-900">{order.vipPackage.name}</p>
                  <p className="text-xs text-neutral-400">Thời hạn: {order.vipPackage.durationDays} ngày</p>
                </div>
              </div>
              <p className="text-lg font-black text-blue-600">{formatCurrency(order.amount)}</p>
            </div>
          </div>

          <button onClick={onBack} className="w-full py-4 bg-neutral-900 text-white rounded-xl font-bold hover:bg-black transition-all shadow-lg">
            Quay lại danh sách
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * COMPONENT: Trang chọn phương thức thanh toán
 */
const PaymentSelection: React.FC<{ 
  order: OrderData; 
  onCancel: () => void; 
  onConfirm: () => void;
  isProcessing: boolean;
}> = ({ order, onCancel, onConfirm, isProcessing }) => {
  const [method, setMethod] = useState('vnpay');
  const formatCurrency = (amount: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

  return (
    <div className="min-h-screen bg-neutral-50 py-12 px-4 flex flex-col items-center">
      <div className="max-w-4xl w-full">
        <button onClick={onCancel} className="flex items-center text-neutral-500 hover:text-neutral-900 mb-8 transition-colors group">
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" /> Quay lại
        </button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-200">
              <h3 className="text-lg font-bold mb-4 uppercase text-xs tracking-widest text-neutral-400">Tóm tắt đơn hàng</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-neutral-50 rounded-lg"><Zap className="w-5 h-5 text-yellow-500" /></div>
                  <p className="font-bold text-sm">{order.vipPackage.name}</p>
                </div>
                <div className="space-y-2 pt-4 border-t border-neutral-100">
                  <div className="flex justify-between text-sm text-neutral-500"><span>Mã đơn</span><span className="text-neutral-900 font-medium">{order.code.slice(0, 8)}...</span></div>
                  <div className="flex justify-between text-sm text-neutral-500"><span>Số tiền</span><span className="text-neutral-900 font-medium">{formatCurrency(order.amount)}</span></div>
                  <div className="flex justify-between text-lg font-black pt-2 text-blue-600"><span>Cần thanh toán</span><span>{formatCurrency(order.amount)}</span></div>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-200">
              <h3 className="text-xl font-bold mb-6">Chọn phương thức thanh toán</h3>
              <div className="space-y-4">
                <PaymentOption id="vnpay" current={method} set={setMethod} icon={<CreditCard className="text-red-500" />} title="VNPay" desc="Cổng thanh toán điện tử VNPay" />
                <PaymentOption id="zalopay" current={method} set={setMethod} icon={<Wallet className="text-blue-500" />} title="ZaloPay" desc="Ví điện tử ZaloPay" />
              </div>
              <button
                disabled={isProcessing}
                onClick={onConfirm}
                className="w-full mt-10 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 disabled:bg-neutral-300 transition-all shadow-lg"
              >
                {isProcessing ? "Đang xử lý..." : "Thanh toán ngay"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * MAIN APP COMPONENT
 */
const ServicePackages: React.FC = () => {
  const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null);
  const [isPaid, setIsPaid] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Dữ liệu mẫu
  const mockOrders: OrderData[] = [
    {
      createdAt: "02/01/2026 16:13:44",
      updateAt: "02/01/2026 16:14:50",
      id: 1,
      code: "4f4df82a-e1c4-4292-a8f0-5544beee1e99",
      employer: { email: "hunghung2k4123@gmail.com", employerId: "EMPL2E00C07A", companyName: "Công ty TNHH công nghệ ABC" },
      vipPackage: { 
        id: 2, code: "VIP01", name: "Gói vip 1", price: 10000.0, durationDays: 2, postLimit: 10, 
        weeklyPostLimit: null, jobPostDurationDays: 30, description: "Hỗ trợ đăng tin nhanh chuyên nghiệp.", 
        isActive: true, createdAt: "", updateAt: "" 
      },
      amount: 10000.0, status: "SUCCESS", vnpTxnRef: "7cb", vnpTransactionNo: "15378591", bankCode: "NCB", orderInfo: "Gói vip 1"
    },
    {
      createdAt: "05/01/2026 10:00:00",
      updateAt: "05/01/2026 10:05:00",
      id: 2,
      code: "888df82a-e1c4-4292-a8f0-5544beee1111",
      employer: { email: "hunghung2k4123@gmail.com", employerId: "EMPL2E00C07A", companyName: "Công ty TNHH công nghệ ABC" },
      vipPackage: { 
        id: 3, code: "VIP_PRO", name: "Gói Premium", price: 50000.0, durationDays: 30, postLimit: 50, 
        weeklyPostLimit: 15, jobPostDurationDays: 60, description: "Gói cao cấp cho doanh nghiệp lớn.", 
        isActive: true, createdAt: "", updateAt: "" 
      },
      amount: 50000.0, status: "SUCCESS", vnpTxnRef: "999", vnpTransactionNo: "15378999", bankCode: "VCB", orderInfo: "Gói Premium"
    }
  ];

  const handleStartPayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsPaid(true);
      setIsProcessing(false);
    }, 1200);
  };

  const resetState = () => {
    setIsPaid(false);
    setSelectedOrder(null);
  };

  // Điều hướng logic hiển thị
  if (isPaid && selectedOrder) {
    return <PaymentSuccess order={selectedOrder} onBack={resetState} />;
  }

  if (selectedOrder) {
    return <PaymentSelection order={selectedOrder} onCancel={() => setSelectedOrder(null)} onConfirm={handleStartPayment} isProcessing={isProcessing} />;
  }

  return (
    <div className="min-h-screen bg-neutral-50   px-4">
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-[28px] font-black text-neutral-900 tracking-tight mb-4 ">Dịch Vụ Tuyển Dụng</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-center max-w-4xl mx-auto">
          {mockOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-3xl border border-neutral-200 p-8 shadow-sm hover:shadow-xl transition-all duration-300 text-left">
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-blue-50 rounded-2xl text-blue-600"><Shield className="w-8 h-8" /></div>
                <span className="px-3 py-1 bg-neutral-100 text-neutral-500 rounded-full text-[10px] font-bold uppercase tracking-wider">{order.vipPackage.code}</span>
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 mb-2">{order.vipPackage.name}</h3>
              <p className="text-neutral-500 text-sm mb-6 line-clamp-2">{order.vipPackage.description}</p>
              <div className="text-3xl font-black text-neutral-900 mb-8">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.vipPackage.price)}
                <span className="text-sm text-neutral-400 font-medium ml-1">/{order.vipPackage.durationDays} ngày</span>
              </div>
              <div className="space-y-4 border-t border-neutral-100 pt-6 mb-8">
                <FeatureItem label="Tổng tin đăng" value={order.vipPackage.postLimit} />
                <FeatureItem label="Ngày hiển thị tin" value={`${order.vipPackage.jobPostDurationDays} ngày`} />
                <FeatureItem label="Cập nhật lúc" value={order.updateAt} />
              </div>
              <button onClick={() => setSelectedOrder(order)} className="w-full py-4 bg-neutral-900 text-white rounded-2xl font-bold hover:bg-blue-600 transition-colors shadow-lg">
                Kích hoạt ngay
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * SMALL ATOMIC COMPONENTS
 */
const DetailRow = ({ label, value, isBold = false, isStatus = false }: any) => (
  <>
    <div className="text-neutral-500">{label}</div>
    <div className={`text-right truncate ${isBold ? 'font-black text-neutral-900' : 'text-neutral-700'} ${isStatus ? 'text-green-600 font-bold' : ''}`}>
      {value}
    </div>
  </>
);

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