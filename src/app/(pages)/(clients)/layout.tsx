import { Footer } from "@/components/footer/Footer";
import { Header } from "@/components/header/client/Header";
import { NotificationProvider } from "@/context/NotificationContext";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
    <NotificationProvider>

  <Header />
     
                   {children}
     
                   <Footer />
    </NotificationProvider>
  
         
    </>
  );
}