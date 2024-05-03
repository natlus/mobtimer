"use client";

export function NotificationsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  if (typeof Notification !== "undefined") {
    Notification.requestPermission().then((result) => {});
  }

  return <>{children}</>;
}
