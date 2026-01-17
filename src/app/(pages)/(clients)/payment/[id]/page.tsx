/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
import { Metadata } from "next";
import ServicePackageDetail from "./ServicePackageDetail";

export const metadata: Metadata = {
  title: " Thanh toán gói dịch vụ",
  description: "Trang thông tin  chi tiết gói dịch vụ ",
};

export default async function ServicePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  return (
    <>
    <ServicePackageDetail id={id}/>
    </>
  );
}
