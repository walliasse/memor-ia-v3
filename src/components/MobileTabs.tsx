import { NavLink } from "react-router-dom";
import { BookOpen, Sailboat, PlusCircle } from "lucide-react";

const tabs = [
  {
    to: "/souvenirs",
    label: "Souvenirs",
    icon: BookOpen,
  },
  {
    to: "/nouveau",
    label: "Ecrire",
    icon: PlusCircle,
  },
  {
    to: "/recherche",
    label: "Naviguer",
    icon: Sailboat,
  },
];

export default function MobileTabs() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t border-border shadow-soft">
      <div className="flex justify-around items-center h-16 px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <NavLink
              key={tab.to}
              to={tab.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center px-3 py-2 rounded-lg transition-all duration-200 min-w-0 flex-1 ${
                  isActive 
                    ? "text-primary bg-primary/10" 
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                }`
              }
            >
              <Icon className="h-5 w-5 mb-1 flex-shrink-0" />
              <span className="text-xs font-medium truncate">{tab.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
} 