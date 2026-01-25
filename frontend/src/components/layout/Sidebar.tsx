import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Building2,
  ClipboardList,
  BarChart3,
  Activity,
  Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/players', icon: Users, label: 'Players' },
  { to: '/teams', icon: Building2, label: 'Teams' },
  { to: '/assessments', icon: ClipboardList, label: 'Assessments' },
  { to: '/analysis/compare', icon: BarChart3, label: 'Analysis' },
];

const adminNavItems = [
  { to: '/settings/sports', icon: Settings, label: 'Settings' },
];

export function Sidebar() {
  const { user } = useAuthStore();
  const isAdmin = user?.is_superuser ?? false;

  return (
    <aside className="hidden w-64 flex-shrink-0 border-r border-gray-200 bg-white lg:block">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center border-b border-gray-200 px-6">
          <Activity className="h-8 w-8 text-blue-600" />
          <span className="ml-2 text-xl font-bold text-gray-900">
            Sports Perf
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                )
              }
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          ))}

          {/* Admin Section */}
          {isAdmin && (
            <>
              <div className="my-4 border-t border-gray-200" />
              <p className="px-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                Admin
              </p>
              {adminNavItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    )
                  }
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </NavLink>
              ))}
            </>
          )}
        </nav>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4">
          <p className="text-xs text-gray-500">
            Sports Performance App v1.0
          </p>
        </div>
      </div>
    </aside>
  );
}
