import { Footer } from "@/components/footer/Footer";
import { Header } from "@/components/header/client/Header";
import { SidebarLayout } from "@/components/sider/client/Sidebar";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
    <SidebarLayout>

  <Header />
     
                   {children}
     
                   <Footer />
    </SidebarLayout>
         
    </>
  );
}