import { cookies } from "next/headers";
import Sidebar from '@/components/dashboard/Sidebar';
import RightPanel from '@/components/dashboard/RightPanel';
import BackgroundPattern from '@/components/dashboard/BackgroundPattern';
import AuthInitializer from '@/components/AuthInitializer';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  let user = null;

  if (accessToken || refreshToken) {
    try {
      const cookieHeader = [
        accessToken ? `accessToken=${accessToken}` : "",
        refreshToken ? `refreshToken=${refreshToken}` : "",
      ]
        .filter(Boolean)
        .join("; ");

      const backendUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

      const res = await fetch(`${backendUrl}/auth/me`, {
        headers: {
          Cookie: cookieHeader,
        },
        // cache: 'no-store' is important so Next.js doesn't cache the user profile across requests
        cache: "no-store",
      });

      if (res.ok) {
        const json = await res.json();
        user = json.data;
      } else {
      }
    } catch {
      // ignore
    }
  }

  return (
    <div className="min-h-screen bg-[#FFFBF2] relative overflow-hidden">
      <BackgroundPattern />
      { }
      <AuthInitializer user={user} />

      <Sidebar />
      <main className="ml-64 mr-0 xl:mr-80 min-h-screen p-8 transition-all duration-300 relative z-10">
        <div className="max-w-5xl mx-auto">{children}</div>
      </main>
      <RightPanel />
    </div>
  );
}
