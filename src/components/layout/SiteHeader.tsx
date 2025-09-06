import { Link, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";

const navItems = [
  { to: "/focus", label: "Focus" },
  { to: "/goals", label: "Goals" },
  { to: "/mood", label: "Mood" },
];

const SiteHeader = () => {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div aria-hidden className="size-6 rounded-md bg-gradient-to-br from-primary to-accent shadow-[var(--shadow-glow)]" />
          <span className="font-semibold">Re-Focus</span>
        </Link>
        <nav className="hidden gap-6 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `text-sm transition-colors ${isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link to="/focus">
            <Button variant="hero" size="sm">Start Focusing</Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default SiteHeader;
