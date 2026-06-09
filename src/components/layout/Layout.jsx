import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar, { LiveActivityListener } from './TopBar';
import PageTransition from './PageTransition';
import CommandPalette, { useCommandPalette } from '../common/CommandPalette';
import { TopBarProvider } from '../../context/TopBarContext';
import './Layout.css';

export default function Layout() {
  const { isOpen, open, close } = useCommandPalette();

  return (
    <TopBarProvider>
      <div className="layout">
        <Sidebar />
        <main className="main-content">
          <TopBar onOpenCommand={open} />
          <LiveActivityListener />
          <CommandPalette isOpen={isOpen} onClose={close} />
          <PageTransition>
            <Outlet />
          </PageTransition>
        </main>
      </div>
    </TopBarProvider>
  );
}
