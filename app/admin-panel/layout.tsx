import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin-panel/sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || user.email !== 'imchn24@gmail.com') {
    redirect('/');
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar className="w-64 flex-none" />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}