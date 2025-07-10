import { Outlet } from "react-router-dom";
import "@/admin.css";

export default function ManagerLayout() {
  return <div className="manager-layout"><Outlet /></div>;
}