import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/dashboard/shell";
import { api } from "@/lib/api";
import { getSession } from "@/lib/auth";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login");
  const notices = await api.getNotices();
  return (
    <DashboardShell investor={session} notices={notices}>
      {children}
    </DashboardShell>
  );
}
