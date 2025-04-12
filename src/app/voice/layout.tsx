export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
      <div lang="en" className={`h-full `}>
        <div className="h-full">
            {children}
        </div>
      </div>
    );
  }
  