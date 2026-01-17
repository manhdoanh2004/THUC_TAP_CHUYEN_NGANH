/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
import { Metadata } from "next";
import OrderSuccess from "./OrderSuccess";

export const metadata: Metadata = {
  title: " Thanh toán gói dịch vụ thành công",
  description: "Trang thanh toán gói dịch vụ thành công ",
};

export default async function ServicePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  return (
    <>
    <OrderSuccess id={id}/>
    </>
  );
}
