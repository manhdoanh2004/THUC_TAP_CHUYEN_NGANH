'use client';
import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics"
import RecentOrders from "@/components/ecommerce/RecentOrders"
import StatisticsChart from "@/components/ecommerce/StatisticsChart"


export const Dashboard = () => {
   
    return(
        <>
         <div className="grid grid-cols-12 gap-4 md:gap-6">
              <div className="col-span-12 space-y-6 xl:col-span-7">
                <EcommerceMetrics />
        
                {/* <MonthlySalesChart /> */}
              </div>
        
              {/* <div className="col-span-12 xl:col-span-5">
                <MonthlyTarget />
              </div> */}
        
              <div className="col-span-12">
                <StatisticsChart />
              </div>
        
              <div className="col-span-12 xl:col-span-7">
                <RecentOrders />
              </div>
            </div>
        </>
    )
}
