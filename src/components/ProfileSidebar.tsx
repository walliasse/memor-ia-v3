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
    <>
      {/* Sidebar desktop */}
      <aside className="hidden lg:block fixed left-0 top-[73px] h-[calc(100vh-73px)] w-64 bg-background/95 backdrop-blur-md border-r border-border z-40">
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
                      ? "bg-primary/10 dark:bg-primary/20 text-primary dark:text-amber-400 border border-primary/20 dark:border-amber-400/30"
                      : "text-muted-foreground dark:text-amber-200/70 hover:text-foreground dark:hover:text-amber-100 hover:bg-secondary/50 dark:hover:bg-accent"
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

      {/* Navigation mobile */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-md border-t border-border z-50">
        <nav className="flex justify-around p-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.key;
            
            return (
              <NavLink
                key={item.key}
                to={item.to}
                className={`flex flex-col items-center space-y-1 px-4 py-2 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "text-primary dark:text-amber-400"
                    : "text-muted-foreground dark:text-amber-200/70"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs font-medium">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>
    </>
  );
} 