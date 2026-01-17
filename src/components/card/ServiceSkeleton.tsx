import Skeleton, {  } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const ServiceSkeleton = () => {
  return (
    <div className="bg-white rounded-3xl border border-neutral-200 p-8 shadow-sm text-left flex flex-col relative overflow-hidden h-full">
      {/* Skeleton cho Icon và Badge code ở trên đầu */}
      <div className="flex justify-between items-start mb-6">
        <div className="p-4 rounded-2xl bg-neutral-50">
           <Skeleton width={32} height={32} />
        </div>
        <Skeleton width={40} height={20} borderRadius={999} />
      </div>

      {/* Tên dịch vụ */}
      <div className="mb-2">
        <Skeleton width="60%" height={28} />
      </div>

      {/* Mô tả (2 dòng như code gốc) */}
      <div className="mb-6 h-10">
        <Skeleton count={2} />
      </div>
      
      {/* Giá tiền */}
      <div className="mb-8">
        <Skeleton width="80%" height={36} />
      </div>

      {/* List Features */}
      <div className="space-y-4 border-t border-neutral-100 pt-6 mb-8 flex-grow">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex justify-between">
            <Skeleton width={100} />
            <Skeleton width={60} />
          </div>
        ))}
      </div>

      {/* Nút bấm */}
      <Skeleton height={56} borderRadius={16} />
    </div>
  );
};

export default ServiceSkeleton;