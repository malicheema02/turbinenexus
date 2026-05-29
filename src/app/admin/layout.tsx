import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/Sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <AdminSidebar />
      <main className="flex-1 ml-64 min-h-screen">
        {children}
      </main>
    </div>
  );
}
