import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Info, 
  HelpCircle, 
  Code, 
  Table, 
  Search, 
  Upload, 
  User, 
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { AuthModal } from './auth/AuthModal';

const SubMenuItem = ({ 
  to, 
  icon, 
  label, 
  isActive, 
  onClick 
}: { 
  to: string; 
  icon: React.ReactNode; 
  label: string; 
  isActive: boolean; 
  onClick: () => void;
}) => (
  <Link 
    to={to} 
    className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors duration-200 ${
      isActive 
        ? 'bg-blue-100 text-blue-700' 
        : 'text-gray-600 hover:bg-gray-100'
    }`}
    onClick={onClick}
  >
    <span className="flex items-center justify-center w-5 h-5">
      {icon}
    </span>
    <span>{label}</span>
  </Link>
);

const Navbar = () => {
  const [active, setActive] = useState('what');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const location = useLocation();
  
  const handleOpenAuthModal = () => {
    setIsAuthModalOpen(true);
    setIsMobileMenuOpen(false);
  };

  const handleCloseAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const handleNavItemClick = (id: string) => {
    setActive(id);
    setIsMobileMenuOpen(false);
  };

  const handleSignOut = async () => {
    await signOut();
    setIsMobileMenuOpen(false);
  };

  const videoCreatorSubmenu = [
    { to: '/', icon: <Info size={18} />, label: 'Features', id: 'what' },
    { to: '/why', icon: <HelpCircle size={18} />, label: 'Why Choose Us', id: 'why' },
    { to: '/how', icon: <Code size={18} />, label: 'How It Works', id: 'how' },
  ];
  
  const authNavItems = [
    { to: '/start-creating', icon: <Upload size={20} />, label: 'Create Ad', id: 'create' },
    { to: '/dashboard', icon: <Table size={20} />, label: 'Dashboard', id: 'dashboard' },
  ];

  const navItems = user ? authNavItems : [];

  // Update active state based on current location
  useEffect(() => {
    const path = location.pathname;
    if (path === '/') setActive('what');
    else if (path === '/why') setActive('why');
    else if (path === '/how') setActive('how');
    else if (path === '/start-creating') setActive('create');
    else if (path === '/dashboard') setActive('dashboard');
  }, [location.pathname]);

  return (
    <>
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Cortex</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {/* Video Creator Submenu */}
              <div className="flex items-center space-x-6">
                {videoCreatorSubmenu.map((item) => (
                  <Link
                    key={item.id}
                    to={item.to}
                    className={`text-sm font-medium transition-colors duration-200 ${
                      active === item.id
                        ? 'text-blue-600'
                        : 'text-gray-600 hover:text-blue-600'
                    }`}
                    onClick={() => handleNavItemClick(item.id)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              {/* Auth Navigation */}
              {user ? (
                <div className="flex items-center space-x-4">
                  {navItems.map((item) => (
                    <Link
                      key={item.id}
                      to={item.to}
                      className={`text-sm font-medium transition-colors duration-200 ${
                        active === item.id
                          ? 'text-blue-600'
                          : 'text-gray-600 hover:text-blue-600'
                      }`}
                      onClick={() => handleNavItemClick(item.id)}
                    >
                      {item.label}
                    </Link>
                  ))}
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">{user.email}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleSignOut}
                      className="text-gray-600 hover:text-red-600"
                    >
                      <LogOut size={16} />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Button
                    variant="ghost"
                    onClick={handleOpenAuthModal}
                    className="text-gray-600 hover:text-blue-600"
                  >
                    Sign In
                  </Button>
                  <Button
                    onClick={handleOpenAuthModal}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Get Started
                  </Button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-600"
              >
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200">
              <div className="space-y-2">
                {/* Video Creator Submenu */}
                {videoCreatorSubmenu.map((item) => (
                  <SubMenuItem
                    key={item.id}
                    to={item.to}
                    icon={item.icon}
                    label={item.label}
                    isActive={active === item.id}
                    onClick={() => handleNavItemClick(item.id)}
                  />
                ))}

                {/* Auth Navigation */}
                {user ? (
                  <>
                    {navItems.map((item) => (
                      <SubMenuItem
                        key={item.id}
                        to={item.to}
                        icon={item.icon}
                        label={item.label}
                        isActive={active === item.id}
                        onClick={() => handleNavItemClick(item.id)}
                      />
                    ))}
                    <div className="px-4 py-2 text-sm text-gray-600">
                      {user.email}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleSignOut}
                      className="w-full justify-start text-red-600 hover:text-red-700"
                    >
                      <LogOut size={16} className="mr-2" />
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <div className="px-4 space-y-2">
                    <Button
                      variant="ghost"
                      onClick={handleOpenAuthModal}
                      className="w-full justify-start"
                    >
                      Sign In
                    </Button>
                    <Button
                      onClick={handleOpenAuthModal}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      Get Started
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      <AuthModal isOpen={isAuthModalOpen} onClose={handleCloseAuthModal} />
    </>
  );
};

export default Navbar;
