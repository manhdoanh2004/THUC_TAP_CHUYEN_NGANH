import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export const PaymentSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="mx-auto">
        {/* Nút quay lại giả */}
        <div className="mb-8">
          <Skeleton width={180} height={24} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Cột trái: Thông tin gói */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Header giả */}
              <div className="bg-gray-200 p-4">
                <Skeleton width={200} height={28} baseColor="#e0e0e0" />
              </div>
              
              <div className="p-6">
                <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4 border-b pb-6">
                  <div className="w-full md:w-1/2">
                    <Skeleton height={32} width="80%" />
                    <div className="mt-2">
                      <Skeleton width={100} height={20} borderRadius={20} />
                    </div>
                  </div>
                  <div className="w-full md:w-1/3 md:text-right">
                    <Skeleton height={40} width={150} />
                    <Skeleton width={120} height={16} className="mt-2" />
                  </div>
                </div>

                <div className="py-6">
                  <Skeleton width={150} height={20} className="mb-2" />
                  <Skeleton count={2} />
                </div>

                {/* Grid 4 ô thông số */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <Skeleton circle width={40} height={40} className="mr-4" />
                      <div className="flex-1">
                        <Skeleton width="60%" height={12} />
                        <Skeleton width="40%" height={20} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Cột phải: Thanh toán */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-xl border border-blue-50 p-6 sticky top-6">
              <div className="border-b pb-4 mb-6">
                <Skeleton height={24} width="70%" />
              </div>

              {/* Danh sách phương thức thanh toán */}
              <div className="space-y-3 mb-8">
                {[1, 2].map((i) => (
                  <div key={i} className="flex items-center p-4 border border-gray-100 rounded-xl">
                    <Skeleton width={40} height={40} className="mr-4" borderRadius={8} />
                    <Skeleton width="50%" height={20} />
                  </div>
                ))}
              </div>

              {/* Chi tiết hóa đơn */}
              <div className="space-y-3 mb-6 bg-gray-50 p-5 rounded-xl border border-gray-100">
                <div className="flex justify-between">
                  <Skeleton width={80} />
                  <Skeleton width={100} />
                </div>
                <div className="flex justify-between">
                  <Skeleton width={80} />
                  <Skeleton width={60} />
                </div>
                <div className="border-t border-dashed border-gray-300 pt-3 flex flex-col items-center">
                  <Skeleton width={120} height={12} className="mb-2" />
                  <Skeleton width={160} height={32} />
                </div>
              </div>

              {/* Nút bấm */}
              <Skeleton height={56} borderRadius={12} />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};