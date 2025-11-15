import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: " Đăng nhập với vai trò là quản trị viên",
  description: "",
};

export default function SignIn() {
  return <SignInForm />;
}
