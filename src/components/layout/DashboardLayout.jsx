import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import MobileNav from './MobileNav';
import ToastContainer from '../ui/Toast';
import AIMentorDrawer from '../chat/AIMentorDrawer';

export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-surface-50">
      <Sidebar />
      <div className="flex min-h-screen flex-1 flex-col">
        <Navbar />
        <main className="scrollbar-thin flex-1 px-4 pb-24 pt-6 sm:px-6 lg:px-8 lg:pb-10">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
      <MobileNav />
      <ToastContainer />
      <AIMentorDrawer />
    </div>
  );
}
