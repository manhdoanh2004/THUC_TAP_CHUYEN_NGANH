import { Footer } from "@/components/footer/Footer";
import { Header } from "@/components/header/client/Header";
import { SidebarLayout } from "@/components/sider/client/Sidebar";
import { NotificationProvider } from "@/context/NotificationContext";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
    <NotificationProvider>
  <SidebarLayout>

  <Header />
     
                   {children}
     
                   <Footer />
    </SidebarLayout>

    </NotificationProvider>
  
         
    </>
  );
}