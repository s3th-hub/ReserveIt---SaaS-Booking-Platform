import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Calendar, User, LogOut, Menu, X, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from './UI';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-neutral-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-black flex items-center justify-center">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight">ReserveIt</span>
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link to="/" className="text-neutral-600 hover:text-black px-3 py-2 text-sm font-medium">Services</Link>
              {user && (
                <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} className="text-neutral-600 hover:text-black px-3 py-2 text-sm font-medium">
                  {user.role === 'admin' ? 'Admin Panel' : 'My Bookings'}
                </Link>
              )}
            </div>
          </div>

          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 text-sm font-medium text-neutral-700">
                    <User className="h-4 w-4" />
                    <span>{user.name}</span>
                  </div>
                  <Button variant="outline" size="sm" onClick={logout} icon={LogOut}>Logout</Button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>Login</Button>
                  <Button size="sm" onClick={() => navigate('/register')}>Get Started</Button>
                </div>
              )}
            </div>
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-neutral-600">
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-neutral-200 bg-white"
          >
            <div className="space-y-1 px-2 pb-3 pt-2">
              <Link to="/" className="block rounded-md px-3 py-2 text-base font-medium text-neutral-600 hover:bg-neutral-50 hover:text-black">Services</Link>
              {user && (
                <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} className="block rounded-md px-3 py-2 text-base font-medium text-neutral-600 hover:bg-neutral-50 hover:text-black">
                  {user.role === 'admin' ? 'Admin Panel' : 'My Bookings'}
                </Link>
              )}
              {user ? (
                <button onClick={logout} className="block w-full text-left rounded-md px-3 py-2 text-base font-medium text-red-600 hover:bg-neutral-50">Logout</button>
              ) : (
                <>
                  <Link to="/login" className="block rounded-md px-3 py-2 text-base font-medium text-neutral-600 hover:bg-neutral-50">Login</Link>
                  <Link to="/register" className="block rounded-md px-3 py-2 text-base font-medium text-black hover:bg-neutral-50">Register</Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: Calendar, label: 'Bookings', path: '/admin/bookings' },
    { icon: Menu, label: 'Services', path: '/admin/services' },
  ];

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <aside className="fixed inset-y-0 left-0 z-50 w-64 border-r border-neutral-200 bg-white hidden lg:block">
        <div className="flex h-16 items-center border-b border-neutral-200 px-6">
          <Link to="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-black flex items-center justify-center">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">ReserveIt</span>
          </Link>
        </div>
        <nav className="space-y-1 p-4">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                location.pathname === item.path
                  ? 'bg-neutral-100 text-black'
                  : 'text-neutral-600 hover:bg-neutral-50 hover:text-black'
              )}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-0 w-full border-t border-neutral-200 p-4">
          <Button variant="ghost" className="w-full justify-start" icon={LogOut} onClick={logout}>Logout</Button>
        </div>
      </aside>

      <main className="flex-1 lg:pl-64">
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-neutral-200 bg-white/80 px-4 backdrop-blur-md sm:px-6 lg:px-8">
          <h1 className="text-lg font-semibold">Admin Panel</h1>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" onClick={() => navigate('/')}>View Site</Button>
          </div>
        </header>
        <div className="p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};
