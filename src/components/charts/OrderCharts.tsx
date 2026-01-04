/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo, useState, useEffect } from 'react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import SalaryRangePicker from '../input/SalaryRangePicker';
import DatePicker from '../form/date-picker';

interface RevenyeChartProps{
    totalRevenue?:any
    ,totalOrders?:any
    , orders :Array<any>,
     loading :boolean 
}
// Component hiển thị biểu đồ
const RevenueChart:React.FC<RevenyeChartProps>=({ totalRevenue
    ,totalOrders
    , orders,
     loading }) => {
  const chartData = useMemo(() => {
    const statsMap:any = {};
  
    orders.forEach((order:any) => {
      if (!order.createdAt || order.status !== 'SUCCESS') return;
      const dateStr = order.createdAt.split(' ')[0]; 
      if (statsMap[dateStr]) {
        statsMap[dateStr].amount += order.amount;
        statsMap[dateStr].count += 1;
      } else {
        statsMap[dateStr] = { amount: order.amount, count: 1 };
      }
    });

    return Object.keys(statsMap)
      .map((key) => {
        const [d, m, y] = key.split('/');
        const dateObj =  new Date(Number(y), Number(m) - 1, Number(d));
        
        return {
          dateLabel: key,
          timestamp: dateObj.getTime(),
          amount: statsMap[key].amount,
          count: statsMap[key].count,
        };
      })
      .sort((a, b) => a.timestamp - b.timestamp);
  }, [orders]);

  const formatCurrency = (value:any) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(value);
  };

  return (
    <div className="w-full rounded-2xl bg-white p-6 shadow-lg border border-gray-100 font-sans">
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h3 className="text-xl font-bold text-gray-800">Doanh thu đơn hàng</h3>
         
        </div>
        <div className="text-right">
          <span className="text-xs font-semibold text-orange-600 bg-blue-50 px-3 py-1 block mb-[5px] rounded-full">
            {loading ? 'Đang tải...' : `Tổng số đơn hàng : ${totalOrders?totalOrders:""} đơn`}
          </span>
          <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full w-[100%]">
            {loading ? 'Đang tải...' : `Tổng số doanh thu : ${totalRevenue?.toLocaleString("vi-vn")} vnđ`}
          </span>
        </div>
      </div>

      <div className="h-[400px] w-full relative">
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50 backdrop-blur-[2px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}
        
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis 
                dataKey="dateLabel" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#6b7280', fontSize: 11 }}
                minTickGap={30}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#6b7280', fontSize: 11 }}
                tickFormatter={(value) => value >= 1000000 ? `${(value/1000000).toFixed(1)}M` : value.toLocaleString('vi-VN') + 'đ'}
              />
              <Tooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white p-3 border border-gray-100 rounded-lg shadow-xl">
                        <p className="text-sm font-bold text-gray-700 mb-2 border-b pb-1">{label}</p>
                        <div className="space-y-1">
                          <p className="text-sm text-blue-600 flex justify-between gap-4">
                            <span>Doanh thu:</span>
                            <span className="font-semibold">{formatCurrency(payload[0].value)}</span>
                          </p>
                          <p className="text-sm text-orange-600 flex justify-between gap-4">
                            <span>Số đơn:</span>
                            <span className="font-semibold">{payload[0].payload.count} đơn</span>
                          </p>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="amount"
                stroke="#3b82f6"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorRevenue)"
                dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center text-gray-400 italic">
            Không có dữ liệu cho khoảng thời gian này
          </div>
        )}
      </div>
    </div>
  );
};

export const  OrderCharts=()=> {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [orders, setOrders] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async (start:string, end:string) => {
    try {
        setLoading(true);

    const res=await fetch(`http://localhost:8080/api/dashboard/order-stats`,{
        credentials:"include",
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            startDate:start,
            endDate:end
        })
    });

    const  data=await res.json();
    if(data.code=='success')
    {
        
        setOrders(data.result);
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
    fetchOrders(startDate, endDate);
  }, [startDate,endDate]);


  return (
    <div className="bg-gray-50  flex flex-col items-center">
      <div className=" w-full">
        
        {/* Bộ lọc Range Date */}
        <div className="mb-6 bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-wrap items-end gap-4">
          <div className="flex flex-col gap-1">
             <DatePicker
           maxDate={endDate}
                id="startDate"
                label="Từ ngày"
                placeholder="Chọn thời gian"
               defaultDate={startDate}
                required={true}
                onChange={(dates, currentDateString) => {
                      
                    setStartDate(currentDateString);
                }}
                />
          </div>
          <div className="flex flex-col gap-1">
            <DatePicker
          minDate={startDate}
                id="endDate"
                label="Đến ngày"
                placeholder="Chọn thời gian"
                 defaultDate={endDate}
                required={true}
                onChange={(dates, currentDateString) => {
                    setEndDate(currentDateString);
                    //  console.log({ dates, currentDateString });
                }}
                />
          </div>
        </div>
   
            {orders?(<>
                    <RevenueChart orders={orders.orders||[]} totalOrders={orders.totalOrders} totalRevenue={orders.totalRevenue} loading={loading} />

            </>):(<>
                    <RevenueChart orders={[]}  loading={loading} />

            </>)}
        
      </div>
    </div>
  );
}