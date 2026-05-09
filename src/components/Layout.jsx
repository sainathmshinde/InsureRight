import { Outlet } from "react-router-dom";
import TopNav from "./TopNav";

export default function Layout() {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <TopNav />
      <main style={{ flex: 1, minHeight: 0, overflowY: "auto", background: "var(--bg, #f5f4f9)" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "28px 32px" }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
