import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div style={S.shell}>
      {/* Mobile backdrop */}
      <div
        className={`sb-mobile-backdrop${mobileOpen ? " show" : ""}`}
        onClick={() => setMobileOpen(false)}
      />

      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />

      <div style={S.main}>
        <Topbar onMenuClick={() => setMobileOpen(v => !v)} />
        <div style={S.content} className="app-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

const S = {
  shell: {
    display: "flex",
    height: "100vh",
    overflow: "hidden",
  },
  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    minWidth: 0,
  },
  content: {
    flex: 1,
    overflowY: "auto",
    padding: "28px",
    background: "var(--bg, #f5f4f9)",
  },
};
