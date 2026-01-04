'use client';
import { OrderCharts } from "@/components/charts/OrderCharts";
import { EcommerceMetrics } from "@/components/ecommerce/EcommerceMetrics"
import RecentOrders from "@/components/ecommerce/RecentOrders"


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
                <OrderCharts />
              </div>
        
              <div className="col-span-12 space-y-6">
                <RecentOrders />
              </div>
            </div>
        </>
    )
}
