import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const navItems = [
  { name: 'Home', href: '/' },
  { name: 'Find Study Buddy', href: '/study-buddy' },
  { name: 'Timer', href: '/timer' },
  { name: 'Exam Schedule', href: '/exam-schedule' },
  { name: 'AI Quiz', href: '/ai-quiz' },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  const isActive = (href: string) => pathname === href;

  const NavLinks = ({ mobile = false }) => (
    <div className={mobile ? 'py-2 space-y-1' : 'flex gap-6 text-sm font-medium'}>
      {navItems.map(({ name, href }) => (
        <Link
          key={name}
          to={href}
          onClick={() => mobile && setMenuOpen(false)}
          className={`transition-colors duration-200 relative ${
            mobile
              ? isActive(href)
                ? 'bg-blue-50 text-blue-600 block px-3 py-2 rounded-md'
                : 'text-gray-700 hover:bg-gray-50 block px-3 py-2 rounded-md'
              : isActive(href)
              ? 'text-blue-600'
              : 'text-gray-700 hover:text-blue-600'
          }`}
        >
          {name}
        </Link>
      ))}
    </div>
  );

  return (
    <header className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-r from-blue-500 to-purple-600 p-1 rounded-lg"
            >
              <img
                src="/logo2.jpg"
                alt="Campus Study Link Logo"
                className="h-12 w-12 rounded-lg object-cover"
              />
            </motion.div>
            <span className="text-xl font-bold text-gray-800">𝐒𝐓𝐔𝐃𝐘𝐀𝐋𝐋𝐎</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex">
            <NavLinks />
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 text-gray-700 hover:text-blue-600"
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile nav */}
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: menuOpen ? 1 : 0, height: menuOpen ? 'auto' : 0 }}
          className="md:hidden overflow-hidden"
        >
          <NavLinks mobile />
        </motion.div>
      </div>
    </header>
  );
}
