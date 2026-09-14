import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import QueryProvider from "@/providers/QueryProvider";
import type { ChildrenProps } from "@/types/Shared";

// Chrome for the public marketing site only. Split out of the locale root
// layout so `admin/` can sit beside it with its own shell (sidebar + header)
// instead of inheriting the public Navbar/Footer.
export default function SiteLayout({ children }: ChildrenProps) {
  return (
    <>
      <Navbar />
      <QueryProvider>{children}</QueryProvider>
      <Footer />
    </>
  );
}
