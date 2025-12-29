/* eslint-disable @typescript-eslint/no-unused-vars */

/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @next/next/no-img-element */
import { CardJobItem } from "@/components/card/CardJobItem";
import { Metadata } from "next"
import { FaLocationDot } from "react-icons/fa6"
import { CompanyDetail } from "./CompanyDetail";


export const metadata: Metadata = {
  title: "Chi tiết công ty",
  description: "Mô tả trang chi tiết công ty...",
}

export default async function CompanyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {

  
  return (
    <>
     <CompanyDetail/>
    </>
  )
}