'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

const INACTIVITY_TIMEOUT_MS = 15 * 60 * 1000;
const ACTIVITY_STORAGE_KEY = 'adminLastActivity';

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (pathname === '/admin') return;

    let lastRecordedActivity = 0;
    let lastRefreshAttempt = 0;
    let isRefreshing = false;
    let logoutTimeout: number | undefined;
    let inactivityCheckInterval: number | undefined;

    const clearSession = () => {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      localStorage.removeItem(ACTIVITY_STORAGE_KEY);
      if (logoutTimeout !== undefined) {
        window.clearTimeout(logoutTimeout);
      }
      router.replace('/admin');
    };

    if (!localStorage.getItem('adminToken')) {
      router.replace('/admin');
      return;
    }

    const storedActivity = Number(localStorage.getItem(ACTIVITY_STORAGE_KEY));
    if (storedActivity && Date.now() - storedActivity >= INACTIVITY_TIMEOUT_MS) {
      clearSession();
      return;
    }

    if (!storedActivity) {
      localStorage.setItem(ACTIVITY_STORAGE_KEY, String(Date.now()));
    }

    let scheduleLogout = () => {};
    const checkInactivity = () => {
      const lastActivity = Number(localStorage.getItem(ACTIVITY_STORAGE_KEY));
      if (!lastActivity || Date.now() - lastActivity >= INACTIVITY_TIMEOUT_MS) {
        clearSession();
        return;
      }
      scheduleLogout();
    };

    scheduleLogout = () => {
      if (logoutTimeout !== undefined) {
        window.clearTimeout(logoutTimeout);
      }

      const lastActivity = Number(localStorage.getItem(ACTIVITY_STORAGE_KEY));
      const remaining = INACTIVITY_TIMEOUT_MS - (Date.now() - lastActivity);
      logoutTimeout = window.setTimeout(checkInactivity, Math.max(remaining, 0));
    };

    const recordActivity = () => {
      const now = Date.now();
      if (now - lastRecordedActivity < 1000) return;

      const lastActivity = Number(localStorage.getItem(ACTIVITY_STORAGE_KEY));
      if (!lastActivity || now - lastActivity >= INACTIVITY_TIMEOUT_MS) {
        clearSession();
        return;
      }

      lastRecordedActivity = now;
      localStorage.setItem(ACTIVITY_STORAGE_KEY, String(now));
      scheduleLogout();
      if (now - lastRefreshAttempt >= 60 * 1000) {
        lastRefreshAttempt = now;
        void refreshSession();
      }
    };

    const refreshSession = async () => {
      const token = localStorage.getItem('adminToken');
      if (!token || isRefreshing) return;
      isRefreshing = true;

      try {
        const response = await fetch('/api/auth/refresh', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 401) {
          clearSession();
          return;
        }

        if (!response.ok) {
          throw new Error(`Session refresh failed (${response.status})`);
        }

        const data: { token: string } = await response.json();
        const lastActivity = Number(localStorage.getItem(ACTIVITY_STORAGE_KEY));
        if (
          localStorage.getItem('adminToken') === token &&
          lastActivity &&
          Date.now() - lastActivity < INACTIVITY_TIMEOUT_MS
        ) {
          localStorage.setItem('adminToken', data.token);
        }
      } catch (error) {
        console.error('Admin session refresh error:', error);
      } finally {
        isRefreshing = false;
      }
    };

    const activityEvents = ['pointerdown', 'pointermove', 'keydown', 'scroll', 'touchstart'];
    activityEvents.forEach((eventName) =>
      window.addEventListener(eventName, recordActivity, { passive: true })
    );

    const handleStorage = (event: StorageEvent) => {
      if (event.key === 'adminToken' && !event.newValue) {
        router.replace('/admin');
      } else if (event.key === ACTIVITY_STORAGE_KEY) {
        checkInactivity();
      }
    };
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkInactivity();
      }
    };
    window.addEventListener('storage', handleStorage);
    window.addEventListener('focus', checkInactivity);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    scheduleLogout();
    inactivityCheckInterval = window.setInterval(checkInactivity, 30 * 1000);

    return () => {
      if (logoutTimeout !== undefined) {
        window.clearTimeout(logoutTimeout);
      }
      if (inactivityCheckInterval !== undefined) {
        window.clearInterval(inactivityCheckInterval);
      }
      activityEvents.forEach((eventName) =>
        window.removeEventListener(eventName, recordActivity)
      );
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('focus', checkInactivity);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [pathname, router]);

  return children;
}
