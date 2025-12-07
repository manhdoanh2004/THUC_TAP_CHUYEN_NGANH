import { Metadata } from "next"
import ResetPasswordForm from "./FormResetPassword"

export const metadata: Metadata = {
  title: "Đăng nhập (Nhà tuyển dụng)",
  description: "Mô tả trang đăng nhập (Nhà tuyển dụng)...",
}
export default function ResetPasswordPage(){

    return(
        <>
        <ResetPasswordForm/>
        </>
    )
}