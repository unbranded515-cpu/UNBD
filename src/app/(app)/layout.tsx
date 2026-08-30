import { Nav } from "@/components/Nav";
import { BrandBar } from "@/components/BrandBar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Nav />
      <div className="flex min-w-0 flex-1 flex-col">
        <BrandBar />
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
