import { 
  Calculator, 
  LayoutDashboard, 
  Settings, 
  TrendingUp, 
  Wallet,
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

const mainItems = [
  {
    title: "Retirement Dashboard",
    url: "/",
    icon: LayoutDashboard,
  },
];

const planningItems = [
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
];

const settingsItems = [
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const location = useLocation();

  const renderMenuItems = (items: typeof mainItems) => (
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
  );

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            {renderMenuItems(mainItems)}
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Retirement Planning</SidebarGroupLabel>
          <SidebarGroupContent>
            {renderMenuItems(planningItems)}
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            {renderMenuItems(settingsItems)}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}