/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
import { positionList, workingFromList } from "@/config/variables";
import { Metadata } from "next";
import { JobDetail } from "./FormApply";

export const metadata: Metadata = {
  title: "Chi tiết công việc",
  description: "Mô tả trang chi tiết công việc...",
};

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/jobs/${slug}`
  );
  const data = await res.json();

  let jobDetail: any = null;

  if (data.code == "success") {
    jobDetail = data.result;
    
    jobDetail.position = positionList.find(
      (item:any) => item.value == jobDetail.position
    )?.label;
    jobDetail.workingFrom = workingFromList.find(
      (item:any) => item.value == jobDetail.workingFrom
    )?.label;
  }

  return (
    <>
      {/* Chi tiết công việc */}
    <JobDetail jobDetail={jobDetail}/>
      {/* Hết Chi tiết công việc */}
    </>
  );
}
