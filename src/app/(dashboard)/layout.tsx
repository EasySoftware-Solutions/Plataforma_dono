import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/dashboard/shell";
import { DashboardMotion } from "@/components/motion/dashboard-motion";
import { api } from "@/lib/api";
import { getSession } from "@/lib/auth";
import { parseTheme, THEME_COOKIE } from "@/lib/theme";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login");
  const [notices, jar] = await Promise.all([api.getNotices(), cookies()]);
  const theme = parseTheme(jar.get(THEME_COOKIE)?.value);
  return (
    <DashboardMotion>
      <DashboardShell investor={session} notices={notices} theme={theme}>
        {children}
      </DashboardShell>
    </DashboardMotion>
  );
}
