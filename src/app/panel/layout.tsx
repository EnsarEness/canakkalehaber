import { ReactNode } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { PanelSidebar } from "@/components/PanelSidebar";

export default async function PanelLayout({ children }: { children: ReactNode }) {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/giris");

    const user = session.user as any;

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <PanelSidebar role={user.role} name={user.name || ""} email={user.email || ""} />
            <div className="flex-1 overflow-auto">
                <div className="p-6 md:p-8">{children}</div>
            </div>
        </div>
    );
}
