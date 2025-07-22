import { NavLink } from "react-router-dom";
import { User, Settings } from "lucide-react";

interface ProfileSidebarProps {
  activeTab: "profile" | "settings";
}

const sidebarItems = [
  {
    to: "/profile",
    label: "Profil",
    icon: User,
    key: "profile"
  },
  {
    to: "/settings", 
    label: "Réglages",
    icon: Settings,
    key: "settings"
  },
];

export default function ProfileSidebar({ activeTab }: ProfileSidebarProps) {
  return (
    <aside className="fixed left-0 top-[73px] h-[calc(100vh-73px)] w-64 bg-background/95 backdrop-blur-md border-r border-border z-40">
      <div className="p-4">
        <nav className="space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.key;
            
            return (
              <NavLink
                key={item.key}
                to={item.to}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                }`}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>
    </aside>
  );
} 