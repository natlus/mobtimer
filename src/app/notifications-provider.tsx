"use client";

export function NotificationsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  Notification.requestPermission().then((result) => {});

  return <>{children}</>;
}
