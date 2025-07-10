import { Outlet } from "react-router-dom";
import "@/index.css";

export default function MainLayout() {
  return <div className="default-layout"><Outlet /></div>;
}