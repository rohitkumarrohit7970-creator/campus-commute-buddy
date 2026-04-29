import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Bus, 
  LayoutDashboard, 
  Users, 
  MapPin, 
  Calendar, 
  Settings, 
  LogOut,
  Menu,
  X,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

const adminNav: NavItem[] = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Buses', href: '/admin/buses', icon: Bus },
  { label: 'Routes', href: '/admin/routes', icon: MapPin },
  { label: 'Students', href: '/admin/students', icon: Users },
  { label: 'Drivers', href: '/admin/drivers', icon: Users },
  { label: 'Schedule', href: '/admin/schedule', icon: Calendar },
];

const studentNav: NavItem[] = [
  { label: 'Dashboard', href: '/student', icon: LayoutDashboard },
  { label: 'Book Seat', href: '/student/book', icon: Bus },
  { label: 'My Booking', href: '/student/booking', icon: Calendar },
  { label: 'Track Bus', href: '/student/track', icon: MapPin },
];

const driverNav: NavItem[] = [
  { label: 'Dashboard', href: '/driver', icon: LayoutDashboard },
  { label: 'My Route', href: '/driver/route', icon: MapPin },
  { label: 'Schedule', href: '/driver/schedule', icon: Calendar },
];

const Sidebar: React.FC<{ items: NavItem[]; onNavigate?: () => void }> = ({ items, onNavigate }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex flex-col h-full bg-sidebar text-sidebar-foreground">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <Bus className="h-6 w-6" />
          </div>
          <div>
            <h1 className="font-bold text-lg">CampusRide</h1>
            <p className="text-xs text-sidebar-foreground/70 capitalize">{user?.role} Portal</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {items.map((item, index) => {
          const isActive = location.pathname === item.href;
          return (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link
                to={item.href}
                onClick={onNavigate}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                  isActive 
                    ? "bg-sidebar-primary text-sidebar-primary-foreground" 
                    : "hover:bg-sidebar-accent text-sidebar-foreground/80 hover:text-sidebar-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
                {isActive && <ChevronRight className="ml-auto h-4 w-4" />}
              </Link>
            </motion.div>
          );
        })}
      </nav>

      {/* User section */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3 mb-4 px-4">
          <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-semibold">
            {user?.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{user?.name}</p>
            <p className="text-xs text-sidebar-foreground/70 truncate">{user?.email}</p>
          </div>
        </div>
        <Button 
          variant="ghost" 
          className="w-full justify-start text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5 mr-3" />
          Logout
        </Button>
      </div>
    </div>
  );
};

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const navItems = user?.role === 'admin' ? adminNav 
    : user?.role === 'student' ? studentNav 
    : driverNav;

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 hidden lg:block">
        <Sidebar items={navItems} />
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-card border-b border-border z-50 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg gradient-primary text-primary-foreground">
            <Bus className="h-5 w-5" />
          </div>
          <span className="font-bold">CampusRide</span>
        </div>
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <Sidebar items={navItems} onNavigate={() => setMobileOpen(false)} />
          </SheetContent>
        </Sheet>
      </header>

      {/* Main Content */}
      <main className="lg:ml-64 pt-16 lg:pt-0 min-h-screen">
        <div className="p-4 md:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};
