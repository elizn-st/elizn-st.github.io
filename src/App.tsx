import { RouterProvider } from '@/routing/RouterContext';
import { ToastProvider } from '@/state/ToastContext';
import { OverlayProvider } from '@/state/OverlayContext';
import { ChartFocusProvider } from '@/state/ChartFocusContext';
import { AppShell } from '@/components/layout/AppShell';

export default function App() {
  return (
    <RouterProvider>
      <ChartFocusProvider>
        <ToastProvider>
          <OverlayProvider>
            <AppShell />
          </OverlayProvider>
        </ToastProvider>
      </ChartFocusProvider>
    </RouterProvider>
  );
}
