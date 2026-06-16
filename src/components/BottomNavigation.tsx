import { Dumbbell, Home, PlusCircle, Scale, ShoppingBasket, User } from "lucide-react";

export type AppScreen = "home" | "log" | "prep" | "workout" | "measurements" | "profile";

const navItems = [
  { label: "Home", icon: Home, screen: "home" as const, enabled: true },
  { label: "Log", icon: PlusCircle, screen: "log" as const, enabled: true },
  { label: "Prep", icon: ShoppingBasket, screen: "prep" as const, enabled: true },
  { label: "Workout", icon: Dumbbell, screen: "workout" as const, enabled: true },
  { label: "Peso", icon: Scale, screen: "measurements" as const, enabled: true },
  { label: "Profilo", icon: User, screen: "profile" as const, enabled: true },
];

type BottomNavigationProps = {
  activeScreen: AppScreen;
  onNavigate: (screen: AppScreen) => void;
};

export function BottomNavigation({ activeScreen, onNavigate }: BottomNavigationProps) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-surface/95 px-2 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-2 backdrop-blur">
      <div className="mx-auto grid max-w-md grid-cols-6 gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = item.screen === activeScreen;

          return (
            <button
              type="button"
              key={item.label}
              disabled={!item.enabled}
              onClick={() => {
                if (item.screen) onNavigate(item.screen);
              }}
              className={`flex h-14 flex-col items-center justify-center gap-1 rounded-lg text-[0.72rem] font-medium ${
                active ? "bg-accent text-white" : "text-muted"
              } ${item.enabled ? "" : "opacity-45"}`}
              aria-current={active ? "page" : undefined}
            >
              <Icon size={20} strokeWidth={2.2} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
