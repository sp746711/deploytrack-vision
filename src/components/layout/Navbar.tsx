import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  Rocket, 
  LayoutDashboard, 
  GitBranch, 
  AlertTriangle, 
  Terminal, 
  FolderKanban,
  Menu,
  X,
  LogOut,
  User
} from "lucide-react";
import { useState, useEffect } from "react";
import { logout, getCurrentUser } from "@/api/auth";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Deployments", href: "/deployments", icon: GitBranch },
  { name: "Incidents", href: "/incidents", icon: AlertTriangle },
  { name: "Logs", href: "/logs", icon: Terminal },
  { name: "Projects", href: "/projects", icon: FolderKanban },
];

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const isLanding = location.pathname === "/";

  // Load user from localStorage on component mount
  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
  }, []);

  // Handle logout
  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="glass-card mx-4 mt-4 rounded-2xl border-none">
        <div className="container mx-auto px-6">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="p-2 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Rocket className="w-5 h-5 text-primary" />
              </div>
              <span className="font-bold text-lg tracking-tight">
                Deploy<span className="text-primary">Track</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {!isLanding && navItems.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    )}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.name}
                  </Link>
                );
              })}
            </div>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center gap-3">
              {isLanding || !user ? (
                <>
                  <Link to="/login">
                    <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button className="btn-glow bg-primary hover:bg-primary/90">
                      Get Started
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                      <User className="w-3 h-3 text-primary" />
                    </div>
                    <span className="text-sm font-medium truncate max-w-[100px]">
                      {user?.name?.split(" ")[0] || "User"}
                    </span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={handleLogout}
                    className="gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-muted/50 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-card mx-4 mt-2 rounded-2xl border-none animate-fade-in">
          <div className="p-4 space-y-2">
            {!isLanding && navItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted/50"
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </Link>
              );
            })}
            <div className="pt-4 border-t border-border/50 space-y-2">
              {!user ? (
                <>
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full">Sign In</Button>
                  </Link>
                  <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full bg-primary">Sign Up</Button>
                  </Link>
                </>
              ) : (
                <>
                  <div className="px-4 py-3 rounded-lg bg-muted/50 text-sm">
                    <p className="font-medium">{user?.name}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                  <Button 
                    variant="destructive" 
                    className="w-full gap-2"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
