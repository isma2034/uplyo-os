import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";

export default function OSLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="theme-os" style={{ background: "var(--bg)", color: "var(--t)", minHeight: "100vh" }}>
      <Sidebar />
      <div className="md:ml-[252px] min-h-screen">
        <Topbar />
        <main className="p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
