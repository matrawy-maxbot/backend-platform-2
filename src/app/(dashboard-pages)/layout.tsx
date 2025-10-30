import AnimatedBackground from "@/components/animated-background";
import ProtectedPageWrapper from "@/components/protected-page-wrapper";

export default function DashboardPagesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <AnimatedBackground />
      <ProtectedPageWrapper>
        {children}
      </ProtectedPageWrapper>
    </>
  );
}