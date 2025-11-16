/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { CardCompanyItem } from "@/components/card/CardCompanyItem";
import CompanyCardSkeleton from "@/components/card/CompanyCardSkeleton";
import { useEffect, useState } from "react";

export const Section2 = () => {
  const [companyList, setCompanyList] = useState<any[]>([]);

//   useEffect(() => {
//     fetch(`${process.env.NEXT_PUBLIC_API_URL}/company/list?limitItems=9`)
//       .then(res => res.json())
//       .then(data => {
         
//         if(data.code == "success") {
          
//            setCompanyList(data.companyList);
//         }
//       })
//   }, []);

  return (
    <>
      <div className="py-[60px]">
        <div className="container mx-auto px-[16px]">
          <h2 className="font-[700] sm:text-[28px] text-[24px] text-[#121212] text-center mb-[30px]">
            Nhà tuyển dụng hàng đầu
          </h2>
          {/* Wrap */}
          <div className="grid lg:grid-cols-3 grid-cols-2 sm:gap-[20px] gap-x-[10px] gap-y-[20px]">
            {/* Item */}
            {companyList.length>0?(<>
             {companyList.map(item => (
              <CardCompanyItem key={item.id} item={item} />
            ))}
            </>):(<>
           { Array(6).fill("").map((item:any,index:any)=>{
            return ( <CompanyCardSkeleton key={index}/>)
           
           })}
            </>)}
           
          </div>
        </div>
      </div>
    </>
  )
}
