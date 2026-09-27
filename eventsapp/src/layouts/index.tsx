import { ReactNode } from "react";
import Navbar from "./Navbar"; // Import your Navbar

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="layout-container">
      <Navbar />
      <main className="content">{children}</main>
    </div>
  );
};

export default Layout;
