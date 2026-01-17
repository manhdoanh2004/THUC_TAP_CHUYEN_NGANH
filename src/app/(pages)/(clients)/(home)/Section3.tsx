/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { CardCompanyItem } from "@/components/card/CardCompanyItem";
import { CardJobItem } from "@/components/card/CardJobItem";
import CompanyCardSkeleton from "@/components/card/CompanyCardSkeleton";
import JobCardSkeleton from "@/components/card/JobCartSkeleton";
import { useEffect, useState } from "react";

export const Section3 = () => {
  const [companyList, setCompanyList] = useState<any[]|null>(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs/approved`)
      .then(res => res.json())
      .then(data => {
         
     
        setCompanyList(data.content);
       
      })
  }, []);

  return (
    <>
      <div className="py-[60px]">
        <div className="container mx-auto px-[16px]">
          <h2 className="font-[700] sm:text-[28px] text-[24px] text-[#121212] text-center mb-[30px]">
          Công việc mới nhất
          </h2>
          {/* Wrap */}
          <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 sm:gap-[20px] gap-x-[10px] gap-y-[20px]">
            {/* Item */}
            {companyList?(<>
              {companyList.map(item => (
              <CardJobItem key={item.jobId} item={item} />
            ))}
            </>):(<>
            { Array(6).fill("").map((item:any,index:any)=>{
            return ( <JobCardSkeleton key={index}/>)
           
           })}
            </>)}

          </div>
        </div>
      </div>
    </>
  )
}
