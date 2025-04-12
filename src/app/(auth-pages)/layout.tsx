export default async function Layout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <div className="dashboard-grid flex flex-col gap-12 items-start">{children}</div>
    );
  }