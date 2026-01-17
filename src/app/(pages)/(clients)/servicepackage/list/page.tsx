export const metadata: Metadata = {
  title: " Danh sách gói dịch vụ",
  description: "Trang thông tin  danh sách gói dịch vụ ",
};

import { Metadata } from "next";
import  ServicePackageList  from "./ServicePackageList";

export default function ServicePackageListPage() {
    return(
        <>
        <ServicePackageList/>
        </>
    )
}