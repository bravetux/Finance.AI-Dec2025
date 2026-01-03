import { 
  Calculator, 
  LayoutDashboard, 
  Settings, 
  TrendingUp, 
  Wallet,
  History,
  ShieldCheck
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";

// Menu items.
const items = [
  {
    title: "Retirement Dashboard",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Liquid Assets Calculator",
    url: "/assets",
    icon: Calculator,
  },
  {
    title: "Projected Cashflow",
    url: "/cashflow",
    icon: TrendingUp,
  },
  {
    title: "Post-Retirement Strategy",
    url: "/post-retirement-strategy",
    icon: ShieldCheck,
  },
  {
    title: "Can you retire now?",
    url: "/can-i-retire",
    icon: Wallet,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Retirement Planner</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location.pathname === item.url}>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}