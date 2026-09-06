import { RouterProvider } from '@/routing/RouterContext';
import { ToastProvider } from '@/state/ToastContext';
import { OverlayProvider } from '@/state/OverlayContext';
import { AuthProvider } from '@/state/AuthContext';
import { AuthGate } from '@/components/auth/AuthGate';
import { DataProvider } from '@/state/DataContext';
import { NotificationsProvider } from '@/state/NotificationsContext';
import { DashboardRangeProvider } from '@/state/RangeContext';
import { AppShell } from '@/components/layout/AppShell';

export default function App() {
  return (
    <RouterProvider>
      <ToastProvider>
        <OverlayProvider>
          {/* Inside the chrome providers so the login screen can raise
                toasts, outside AppShell so no shell renders around it. */}
          <AuthProvider>
            <AuthGate>
              <DataProvider>
                {/* Inside DataProvider so the read flag resets with the session. */}
                <NotificationsProvider>
                  <DashboardRangeProvider>
                    <AppShell />
                  </DashboardRangeProvider>
                </NotificationsProvider>
              </DataProvider>
            </AuthGate>
          </AuthProvider>
        </OverlayProvider>
      </ToastProvider>
    </RouterProvider>
  );
}
