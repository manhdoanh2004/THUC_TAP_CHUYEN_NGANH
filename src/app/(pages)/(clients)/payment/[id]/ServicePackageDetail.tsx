/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { PaymentSkeleton } from '@/components/card/PaymentSkeleton';
import { useAuth } from '@/context/AuthContext';

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

// Định nghĩa các biểu tượng SVG thay thế cho react-icons để tránh lỗi biên dịch
const Icons = {
  CheckCircle: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
  ),
  Calendar: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
  ),
  Invoice: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
  ),
  CreditCard: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
  ),
  ArrowLeft: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
  ),
  Shield: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
  )
};

const ServicePackageDetail = ({ id }: { id: any }) => {
  // Dữ liệu gói dịch vụ với đơn vị VNĐ
  const [packageInfo, setPackageInfo] = useState<any | null>(null);
  const { infoCompany } = useAuth();
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState('vnpay');
  const [isProcessing, setIsProcessing] = useState(false);

  const paymentProviders = [
    { id: 'vnpay', name: 'VNPay', icon: 'https://stcd02206177151.cloud.edgevnpay.vn/assets/images/logo-icon/logo-primary.svg' }
  ];



  useEffect(() => {
    if (!infoCompany) return;
    const fetchPackageInfo = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/vip-packages/${id}`, {
          method: "GET",
          credentials: "include",
        })

        const data = await response.json();
        console.log(data)
        setPackageInfo(data.result)

      } catch (error) {
        console.error("Lỗi khi lấy thông tin gói dịch vụ:", error);
      }
    };
    fetchPackageInfo();
  }, [infoCompany])



  // Hàm định dạng tiền tệ VNĐ
  const formatVND = (amount: any) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const handlePayment = async () => {

    try {

      const orderData = {
        employerId: infoCompany.employerId,
        vipPackageId: packageInfo.id,
        amount: packageInfo.price,
        orderInfo: `Thanh toán gói ${packageInfo.name} qua ${paymentMethod.toUpperCase()}-${Date.now()}`,
      }
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(orderData),
        credentials: "include"
      });

      const data = await response.json();

      if (data.code == "success") {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payment/create-payment?orderId=${data.result.id}`, {
            method: "GET",
            credentials: "include"
          });

          const data2 = await res.json();

          if (data2.code == "success") {
             window.location.href = data2.result
            console.log(data2.result)
          }

        } catch (error) {

        }
      }
    } catch (error) {

    }
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      console.log(`Đang chuyển hướng tới cổng thanh toán ${paymentMethod.toUpperCase()}...`);
    }, 2000);
  };

  return (
    <>
      {packageInfo ? (<>
        <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
          <div className=" mx-auto">
            {/* Header điều hướng */}
            <button onClick={() => { router.push("/servicepackage/list") }} className="flex items-center text-gray-600 hover:text-[#000071] mb-8 transition-colors">
              <Icons.ArrowLeft /> <span className="ml-2">Quay lại danh sách gói</span>
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-[#121212]">

              {/* Cột trái: Thông tin gói dịch vụ */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="bg-[#000073] p-4 text-white">
                    <h2 className="text-xl font-bold flex items-center">
                      <span className="ml-2">Chi tiết gói dịch vụ</span>
                    </h2>
                  </div>

                  <div className="p-6">
                    <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4 border-b pb-6">
                      <div>
                        <h1 className="text-2xl font-bold text-gray-900">{packageInfo.name}</h1>
                        <span className="inline-block mt-2 px-3 py-1  text-[#000071] text-xs font-semibold rounded-full">
                          Mã: {packageInfo.code}
                        </span>
                      </div>
                      <div className="text-left md:text-right">
                        <p className="text-3xl font-bold text-[#0f0f85]">
                          {formatVND(packageInfo.price)}
                        </p>
                        <p className="text-sm text-gray-500 italic">Giá đã bao gồm VAT</p>
                      </div>
                    </div>

                    <div className="py-6">
                      <h3 className="font-bold text-gray-800 mb-2">Mô tả gói dịch vụ:</h3>
                      <p className="text-gray-600 leading-relaxed italic">
                        {`"${packageInfo.description}"`}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="text-[#000071] mr-4 bg-white p-2 rounded-lg shadow-sm"><Icons.Calendar /></div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Thời hạn sử dụng</p>
                          <p className="font-bold text-lg">{packageInfo.durationDays} ngày</p>
                        </div>
                      </div>
                      <div className="flex items-center p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="text-green-500 mr-4 bg-white p-2 rounded-lg shadow-sm"><Icons.CheckCircle /></div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Tổng tin đăng tối đa</p>
                          <p className="font-bold text-lg">{packageInfo.postLimit} tin</p>
                        </div>
                      </div>
                      <div className="flex items-center p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="text-orange-500 mr-4 bg-white p-2 rounded-lg shadow-sm"><Icons.CheckCircle /></div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Giới hạn tin/tuần</p>
                          <p className="font-bold text-lg">{packageInfo.weeklyPostLimit} tin</p>
                        </div>
                      </div>
                      <div className="flex items-center p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="text-purple-500 mr-4 bg-white p-2 rounded-lg shadow-sm"><Icons.Calendar /></div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Hiển thị mỗi tin</p>
                          <p className="font-bold text-lg">{packageInfo.jobPostDurationDays} ngày</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Thông báo bảo mật */}
                {/* <div className="flex items-center p-4 bg-blue-50 text-[#000071] rounded-xl border border-blue-100">
              <div className="mr-3 flex-shrink-0"><Icons.Shield /></div>
              <p className="text-sm">
                <strong>Cam kết bảo mật:</strong> Thông tin thanh toán của bạn được mã hóa và bảo vệ bởi các tiêu chuẩn an ninh tài chính quốc tế.
              </p>
            </div> */}
              </div>

              {/* Cột phải: Thanh toán */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-xl border border-blue-100 p-6 sticky top-6">
                  <h3 className="text-lg font-bold mb-6 flex items-center border-b pb-4">
                    <Icons.CreditCard /> <span className="ml-2 text-[#000071] uppercase tracking-wide text-sm">Phương thức thanh toán</span>
                  </h3>

                  <div className="space-y-3 mb-8">
                    {paymentProviders.map((provider) => (
                      <label
                        key={provider.id}
                        className={`
                      relative flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all
                      ${paymentMethod === provider.id
                            ? 'border-blue-600 bg-blue-50/50 shadow-sm'
                            : 'border-gray-100 hover:border-gray-300'}
                      ${isProcessing ? 'opacity-50 pointer-events-none' : ''}
                    `}
                      >
                        <input
                          type="radio"
                          name="payment"
                          className="hidden"
                          value={provider.id}
                          disabled={isProcessing}
                          checked={paymentMethod === provider.id}
                          onChange={() => setPaymentMethod(provider.id)}
                        />
                        <div className="w-10 h-10 flex-shrink-0 mr-4 bg-white p-1 rounded-lg border flex items-center justify-center">
                          <img
                            src={provider.icon}
                            alt={provider.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <span className="font-bold text-gray-700 text-sm">{provider.name}</span>
                        {paymentMethod === provider.id && (
                          <div className="absolute top-2 right-2 text-[#000071] scale-75">
                            <Icons.CheckCircle />
                          </div>
                        )}
                      </label>
                    ))}
                  </div>

                  {/* Chi tiết hóa đơn */}
                  <div className="space-y-3 mb-6 bg-gray-50 p-5 rounded-xl border border-gray-100">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Giá gốc:</span>
                      <span>{formatVND(packageInfo.price)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Khuyến mãi:</span>
                      <span className="text-green-600">- 0đ</span>
                    </div>
                    <div className="border-t border-dashed border-gray-300 pt-3 flex flex-col items-center">
                      <span className="text-xs text-gray-500 mb-1">Số tiền cần thanh toán</span>
                      <span className="text-2xl font-black text-[#000071]">
                        {formatVND(packageInfo.price)}
                      </span>
                    </div>
                  </div>

                  {/* Nút thanh toán */}
                  <button
                    onClick={handlePayment}
                    disabled={isProcessing}
                    className={`
                  w-full py-4 rounded-xl font-bold text-white text-lg shadow-lg transition-all
                  ${isProcessing
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-[#000071] hover:bg-[#000065] hover:shadow-blue-200 active:transform active:scale-[0.98]'}
                `}
                  >
                    {isProcessing ? (
                      <div className="flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                        ĐANG XỬ LÝ...
                      </div>
                    ) : (
                      `THANH TOÁN NGAY`
                    )}
                  </button>


                </div>
              </div>

            </div>
          </div>
        </div>
      </>) : (<>
        <PaymentSkeleton /></>)}

    </>

  );
};

export default ServicePackageDetail;