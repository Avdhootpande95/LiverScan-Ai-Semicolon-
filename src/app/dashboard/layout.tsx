import { Header } from '@/components/common/header';
import { DashboardProvider } from '@/components/dashboard/dashboard-provider';
import { ChatBot } from '@/components/dashboard/chat-bot';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardProvider>
      <div className="flex min-h-screen w-full flex-col">
        <Header />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          {children}
        </main>
        <ChatBot />
      </div>
    </DashboardProvider>
  );
}
