import { auth } from "@/lib/auth";
import { AdminShell } from "@/components/admin/AdminShell";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Login page renders without the sidebar shell
  if (!session?.user) {
    return <>{children}</>;
  }

  return <AdminShell>{children}</AdminShell>;
}
