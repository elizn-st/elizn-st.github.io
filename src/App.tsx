import { RouterProvider } from '@/routing/RouterContext';
import { ToastProvider } from '@/state/ToastContext';
import { OverlayProvider } from '@/state/OverlayContext';
import { AuthProvider } from '@/state/AuthContext';
import { AuthGate } from '@/components/auth/AuthGate';
import { DataProvider } from '@/state/DataContext';
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
                <AppShell />
              </DataProvider>
            </AuthGate>
          </AuthProvider>
        </OverlayProvider>
      </ToastProvider>
    </RouterProvider>
  );
}
