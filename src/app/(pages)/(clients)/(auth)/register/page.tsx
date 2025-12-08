import { Metadata } from "next"
import { FormRegiter } from "./FormRegister"

export const metadata: Metadata = {
  title: "Đăng ký ",
  description: "Mô tả trang đăng ký ",
}

export default function UserRegisterPage() {
  return (
    <>
      <div className="flex items-center justify-center my-[2%] p-4 font-sans min-h-screen">
            <div className="w-full max-w-xl bg-white p-8 rounded-2xl shadow-2xl border border-gray-200">
                <FormRegiter />
            </div>
        </div>
    </>
  )
}