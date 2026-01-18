/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

/**
 * Định nghĩa kiểu dữ liệu cho các thành phần UI
 */
interface BaseProps {
  children?: React.ReactNode;
  className?: string;
}

interface TableCellProps extends BaseProps {
  isHeader?: boolean;
}

interface BadgeProps extends BaseProps {
  color?: "success" | "warning" | "error" | "light" | string;
}

/**
 * Các thành phần UI (Được viết trực tiếp với TypeScript types)
 */
const Table: React.FC<BaseProps> = ({ children }) => (
  <table className="w-full text-left border-collapse table-auto">{children}</table>
);

const TableHeader: React.FC<BaseProps> = ({ children, className }) => (
  <thead className={className}>{children}</thead>
);

const TableBody: React.FC<BaseProps> = ({ children, className }) => (
  <tbody className={className}>{children}</tbody>
);

const TableRow: React.FC<BaseProps> = ({ children, className }) => (
  <tr className={className}>{children}</tr>
);

const TableCell: React.FC<TableCellProps> = ({ children, isHeader, className }) => {
  const Tag = isHeader ? "th" : "td";
  return <Tag className={className}>{children}</Tag>;
};

const Badge: React.FC<BadgeProps> = ({ children, color }) => {
  const colors: Record<string, string> = {
    success: "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400",
    warning: "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400",
    error: "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400",
    light: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
  };
  
  const colorClass = color && colors[color] ? colors[color] : colors.light;
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${colorClass}`}>
      {children}
    </span>
  );
};

// Định nghĩa Interface cho dữ liệu đơn hàng
interface Employer {
  companyName: string;
  email: string;
}

interface VipPackage {
  name: string;
}

interface Order {
  id: number;
  code: string;
  createdAt: string;
  amount: number;
  status: string;
  employer: Employer;
  vipPackage: VipPackage;
}

// Dữ liệu mẫu
const orders: Order[] = [
  {
    createdAt: "02/01/2026 16:13:44",
    id: 1,
    code: "4f4df82a-e1c4-4292-a8f0-5544beee1e99",
    employer: {
      companyName: "Công ty TNHH công nghệ ABC",
      email: "hunghung2k4123@gmail.com",
    },
    vipPackage: {
      name: "Gói vip 1",
    },
    amount: 10000.0,
    status: "SUCCESS",
  },
  {
    createdAt: "03/01/2026 09:45:12",
    id: 2,
    code: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    employer: {
      companyName: "Tập đoàn Giải pháp Số",
      email: "contact@digital-solutions.vn",
    },
    vipPackage: {
      name: "Gói Premium",
    },
    amount: 50000.0,
    status: "PENDING",
  },
  {
    createdAt: "04/01/2026 14:20:00",
    id: 3,
    code: "99887766-5544-3322-1100-aabbccddeeff",
    employer: {
      companyName: "Startup Fast Track",
      email: "hr@fasttrack.com",
    },
    vipPackage: {
      name: "Gói Cơ bản",
    },
    amount: 5000.0,
    status: "CANCELED",
  }
];

export default function App() {
  /**
   * Định dạng tiền tệ VND
   */
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  /**
   * Chuyển đổi màu sắc Badge và tên trạng thái sang Tiếng Việt
   */
  const getStatusInfo = (status: string) => {
    switch (status.toUpperCase()) {
      case "SUCCESS":
        return { color: "success", label: "Thành công" };
      case "PENDING":
        return { color: "warning", label: "Chờ xử lý" };
      case "CANCELED":
      case "FAILED":
        return { color: "error", label: "Đã hủy" };
      default:
        return { color: "light", label: status };
    }
  };


  const router=useRouter()

    const [orders, setOrders] = useState<any>(null);
    const [loading, setLoading] = useState(false);
  
    const fetchOrders = async () => {
      try {
          setLoading(true);
  
      const res=await fetch(`http://localhost:8080/api/orders/filter`,{
          credentials:"include",
          method:"POST",
          headers:{
              "Content-Type":"application/json"
          },
          body:JSON.stringify({
      "page": 0,
      "size": 10
    })
      });
  
      const  data=await res.json();
      if(data.code=='success')
      {
          
          setOrders(data.result.content);
        
          setLoading(false);
      }
    
      } catch (error) {
          console.log(error)
      }finally{
            setLoading(false);
      }
    };
  
    // Tải dữ liệu lần đầu
    useEffect(() => {
      fetchOrders();
    }, []);
  
  return (
    <div className="w-full">
      <div className="w-full overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
        <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Đơn hàng gần đây
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Danh sách các giao dịch thanh toán mới nhất hệ thống
            </p>
          </div>
        </div>

        <div className="w-full overflow-x-auto custom-scrollbar">
          <Table>
            <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
              <TableRow>
                <TableCell isHeader className="py-3 px-2 font-medium text-gray-500 text-start text-xs uppercase dark:text-gray-400">
                  Mã đơn hàng
                </TableCell>
                <TableCell isHeader className="py-3 px-2 font-medium text-gray-500 text-start text-xs uppercase dark:text-gray-400">
                  Công ty / Nhà tuyển dụng
                </TableCell>
                <TableCell isHeader className="py-3 px-2 font-medium text-gray-500 text-start text-xs uppercase dark:text-gray-400">
                  Gói dịch vụ
                </TableCell>
                <TableCell isHeader className="py-3 px-2 font-medium text-gray-500 text-start text-xs uppercase dark:text-gray-400">
                  Số tiền
                </TableCell>
                <TableCell isHeader className="py-3 px-2 font-medium text-gray-500 text-start text-xs uppercase dark:text-gray-400">
                  Trạng thái
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
              {orders?(<>
                 {orders.slice(0,4).map((order:any) => {
                const statusInfo = getStatusInfo(order.status);
                return (
                  <TableRow key={order.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                    <TableCell className="py-4 px-2">
                      <div className="min-w-[100px]">
                        <p className="font-medium text-gray-800 text-sm dark:text-white/90">
                          #{order.code.split("-")[0]}
                        </p>
                        <span className="text-gray-500 text-[11px] dark:text-gray-400">
                          {order.createdAt.split(" ")[0]}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="py-4 px-2">
                      <div className="min-w-[180px]">
                        <p className="font-medium text-gray-800 text-sm dark:text-white/90 truncate max-w-full" title={order.employer.companyName}>
                          {order.employer.companyName}
                        </p>
                        <p className="text-gray-500 text-xs dark:text-gray-400 truncate max-w-full">
                          {order.employer.email}
                        </p>
                      </div>
                    </TableCell>

                    <TableCell className="py-4 px-2 text-gray-600 text-sm dark:text-gray-400">
                      <span className="whitespace-nowrap">{order.vipPackage.name}</span>
                    </TableCell>

                    <TableCell className="py-4 px-2 font-semibold text-gray-800 text-sm dark:text-white/90">
                      <span className="whitespace-nowrap">{formatCurrency(order.amount)}</span>
                    </TableCell>

                    <TableCell className="py-4 px-2">
                      <Badge color={statusInfo.color}>
                        {statusInfo.label}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
              </>):(<></>)}
           
            </TableBody>
          </Table>
        </div>

        <div className="mt-4 flex justify-end">
          <button
          onClick={()=>{
            router.push("/admin/ordermanager")
          }}
          className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 transition-colors">
            Xem tất cả đơn hàng →
          </button>
        </div>
      </div>
    </div>
  );
}