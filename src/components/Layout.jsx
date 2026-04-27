import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function Layout() {
  return (
    <div style={S.shell}>
      <Sidebar />
      <div style={S.main}>
        <Topbar />
        <div style={S.content}>
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
    transition: "margin-left 0.22s cubic-bezier(.4,0,.2,1)",
  },
  content: {
    flex: 1,
    overflowY: "auto",
    padding: "28px",
    background: "var(--bg, #f5f4f9)",
  },
};
