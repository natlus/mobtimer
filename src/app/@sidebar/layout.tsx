export default function SidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="w-full max-w-[360px]">{children}</div>;
}
