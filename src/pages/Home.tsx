// src/pages/Home.tsx
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Users, Clock, BookOpen, Brain, Menu, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";

// --- Static data ---
const studyImages = [
  "https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  "https://images.pexels.com/photos/256520/pexels-photo-256520.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  "https://images.pexels.com/photos/590016/pexels-photo-590016.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  "https://images.pexels.com/photos/1370295/pexels-photo-1370295.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  "https://images.pexels.com/photos/1925536/pexels-photo-1925536.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  "https://images.pexels.com/photos/4050315/pexels-photo-4050315.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
];

const collageImages = [
  "/img1.jpg",
  "/img2.jpg",
  "/img3.jpg",
  "/img4.jpg",
];

const quotes = [
  { text: "𝐘𝐨𝐮𝐫 𝐟𝐮𝐭𝐮𝐫𝐞 𝐢𝐬 𝐜𝐫𝐞𝐚𝐭𝐞𝐝 𝐛𝐲 𝐰𝐡𝐚𝐭 𝐲𝐨𝐮 𝐝𝐨 𝐭𝐨𝐝𝐚𝐲, 𝐧𝐨𝐭 𝐭𝐨𝐦𝐨𝐫𝐫𝐨𝐰.", author: "Robert Kiyosaki" },
  { text: "𝐓𝐡𝐞 𝐨𝐧𝐥𝐲 𝐰𝐚𝐲 𝐭𝐨 𝐝𝐨 𝐠𝐫𝐞𝐚𝐭 𝐰𝐨𝐫𝐤 𝐢𝐬 𝐭𝐨 𝐥𝐨𝐯𝐞 𝐰𝐡𝐚𝐭 𝐲𝐨𝐮 𝐝𝐨.", author: "Steve Jobs" },
  { text: "𝐈𝐟 𝐲𝐨𝐮 𝐰𝐚𝐧𝐭 𝐭𝐨 𝐟𝐥𝐲, 𝐲𝐨𝐮 𝐡𝐚𝐯𝐞 𝐭𝐨 𝐠𝐢𝐯𝐞 𝐮𝐩 𝐭𝐡𝐞 𝐭𝐡𝐢𝐧𝐠𝐬 𝐭𝐡𝐚𝐭 𝐰𝐞𝐢𝐠𝐡 𝐲𝐨𝐮 𝐝𝐨𝐰𝐧.", author: "Toni Morrison" },
  { text: "𝐈𝐟 𝐩𝐞𝐨𝐩𝐥𝐞 𝐚𝐫𝐞 𝐝𝐨𝐮𝐛𝐭𝐢𝐧𝐠 𝐡𝐨𝐰 𝐟𝐚𝐫 𝐲𝐨𝐮 𝐜𝐚𝐧 𝐠𝐨, 𝐠𝐨 𝐬𝐨 𝐟𝐚𝐫 𝐭𝐡𝐚𝐭 𝐲𝐨𝐮 𝐜𝐚𝐧’𝐭 𝐡𝐞𝐚𝐫 𝐭𝐡𝐞𝐦 𝐚𝐧𝐲𝐦𝐨𝐫𝐞.", author: "Michele Ruiz" },
  { text: "𝐈𝐟 𝐲𝐨𝐮'𝐫𝐞 𝐰𝐚𝐥𝐤𝐢𝐧𝐠 𝐝𝐨𝐰𝐧 𝐭𝐡𝐞 𝐫𝐢𝐠𝐡𝐭 𝐩𝐚𝐭𝐡 𝐚𝐧𝐝 𝐲𝐨𝐮'𝐫𝐞 𝐰𝐢𝐥𝐥𝐢𝐧𝐠 𝐭𝐨 𝐤𝐞𝐞𝐩 𝐰𝐚𝐥𝐤𝐢𝐧𝐠, 𝐞𝐯𝐞𝐧𝐭𝐮𝐚𝐥𝐥𝐲 𝐲𝐨𝐮’𝐥𝐥 𝐦𝐚𝐤𝐞 𝐩𝐫𝐨𝐠𝐫𝐞𝐬𝐬.", author: "Barack Obama" },
  { text: "𝐘𝐨𝐮 𝐡𝐚𝐯𝐞 𝐭𝐨 𝐛𝐞 𝐨𝐤𝐚𝐲 𝐰𝐢𝐭𝐡 𝐠𝐞𝐭𝐭𝐢𝐧𝐠 𝐢𝐭 𝐰𝐫𝐨𝐧𝐠, 𝐟𝐚𝐢𝐥𝐢𝐧𝐠, 𝐚𝐧𝐝 𝐥𝐞𝐚𝐫𝐧𝐢𝐧𝐠 𝐟𝐫𝐨𝐦 𝐢𝐭. 𝐓𝐡𝐚𝐭’𝐬 𝐰𝐡𝐚𝐭 𝐦𝐚𝐤𝐞𝐬 𝐲𝐨𝐮 𝐛𝐞𝐭𝐭𝐞𝐫.", author: "Taylor Swift" },
  { text: "𝐒𝐭𝐚𝐲 𝐡𝐮𝐧𝐠𝐫𝐲, 𝐬𝐭𝐚𝐲 𝐟𝐨𝐨𝐥𝐢𝐬𝐡.", author: "Steve Jobs" },
  { text: "𝐓𝐡𝐞 𝐟𝐮𝐭𝐮𝐫𝐞 𝐛𝐞𝐥𝐨𝐧𝐠𝐬 𝐭𝐨 𝐭𝐡𝐨𝐬𝐞 𝐰𝐡𝐨 𝐥𝐞𝐚𝐫𝐧 𝐦𝐨𝐫𝐞 𝐬𝐤𝐢𝐥𝐥𝐬 𝐚𝐧𝐝 𝐜𝐨𝐦𝐛𝐢𝐧𝐞 𝐭𝐡𝐞𝐦 𝐜𝐫𝐞𝐚𝐭𝐢𝐯𝐞𝐥𝐲.", author: "Robert Greene" },
];

const features = [
  { icon: Users, title: "Find Study Partners", desc: "Connect with like-minded students for collaborative learning." },
  { icon: Clock, title: "Focus Timer", desc: "Stay productive with our distraction-free study timer and alerts." },
  { icon: BookOpen, title: "Exam Scheduler", desc: "Upload and organize your exam schedule with smart reminders." },
  { icon: Brain, title: "AI Quiz Generator", desc: "Transform your notes into personalized quizzes with AI technology." },
];

const navItems = [
  { name: 'Home', href: '/' },
  { name: 'Find Study Buddy', href: '/study-buddy' },
  { name: 'Timer', href: '/timer' },
  { name: 'Exam Schedule', href: '/exam-schedule' },
  { name: 'AI Quiz', href: '/ai-quiz' },
];

const fadeUp = { initial: { opacity: 0, y: 50 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true } };

export default function Home() {
  const [imgIndex, setImgIndex] = useState(0);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { pathname } = useLocation();

  const isActive = (href: string) => pathname === href;

  useEffect(() => {
    const imgTimer = setInterval(() => setImgIndex((i) => (i + 1) % studyImages.length), 5000);
    const quoteTimer = setInterval(() => setQuoteIndex((i) => (i + 1) % quotes.length), 4000);
    return () => {
      clearInterval(imgTimer);
      clearInterval(quoteTimer);
    };
  }, []);

  const NavLinks = ({ mobile = false }) => (
    <div className={mobile ? 'py-2 space-y-1' : 'flex gap-6 text-sm font-medium'}>
      {navItems.map(({ name, href }) => (
        <Link
          key={name}
          to={href}
          onClick={() => mobile && setMenuOpen(false)}
          className={`transition-colors duration-200 relative
            ${mobile
              ? isActive(href)
                ? 'bg-blue-50 text-blue-600 block px-3 py-2 rounded-md'
                : 'text-gray-700 hover:bg-gray-50 block px-3 py-2 rounded-md'
              : isActive(href)
                ? 'text-blue-600'
                : 'text-gray-700 hover:text-blue-600'}`}
        >
          {name}
          {!mobile && isActive(href) && (
            <motion.div layoutId="activeTab" className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-600" />
          )}
        </Link>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen">

      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">

            {/* Logo with gradient hover */}
            <Link to="/" className="flex items-center space-x-2">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="bg-gradient-to-r from-blue-500 to-purple-600 p-1 rounded-lg"
              >
                <img src="/logo2.jpg" alt="Campus Study Link Logo" className="h-12 w-12 rounded-lg object-cover"/>
              </motion.div>
              <span className="text-xl font-bold text-gray-800">𝐒𝐓𝐔𝐃𝐘𝐀𝐋𝐋𝐎</span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex"><NavLinks /></nav>

            {/* User login/signup */}
            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <>
                  <span className="text-sm text-gray-600 hidden sm:inline">
                    Hi, {user.displayName || user.email}
                  </span>
                  <button onClick={logout} className="px-3 py-1.5 rounded-md bg-gray-900 text-white text-sm">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-sm hover:text-blue-600">Login</Link>
                  <Link to="/signup" className="px-3 py-1.5 rounded-md bg-blue-600 text-white text-sm">Sign Up</Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 text-gray-700 hover:text-blue-600">
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

      {/* Hero */}
      <section className="relative h-[92vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={imgIndex}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 1.5 }}
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${studyImages[imgIndex]})` }}
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="relative z-10 text-center text-white px-4 max-w-4xl">
          <motion.h1 {...fadeUp} transition={{ duration: 1 }} className="text-5xl md:text-7xl font-bold mb-6">
            Make Every Minute Build Your Mastery
          </motion.h1>

          <div className="h-24 mb-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={quoteIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.8 }}
                className="text-xl md:text-2xl italic"
              >
                “{quotes[quoteIndex].text}”
                <div className="mt-2 text-blue-200 text-base">— {quotes[quoteIndex].author}</div>
              </motion.div>
            </AnimatePresence>
          </div>

          <motion.div {...fadeUp} transition={{ delay: 0.4 }} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/study-buddy">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold flex items-center space-x-2 shadow-lg">
                <span>Find Study Buddy</span><ArrowRight className="h-5 w-5"/>
              </motion.button>
            </Link>
            <Link to="/timer">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                className="bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-full text-lg font-semibold border border-white/30 hover:bg-white/30">
                Start Timer
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <motion.div {...fadeUp} className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Make Studying Fun & Effective</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our platform blends collaboration, tech, and motivation for a better study experience.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto px-4">
          {features.map(({ icon: Icon, title, desc }, i) => (
            <motion.div key={title} {...fadeUp} transition={{ delay: i * 0.1 }} whileHover={{ y: -5 }}
              className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-2xl shadow-sm hover:shadow-lg border">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-lg w-fit mb-4">
                <Icon className="h-8 w-8 text-white"/>
              </div>
              <h3 className="text-xl font-semibold mb-2">{title}</h3>
              <p className="text-gray-600">{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Gallery */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <motion.div {...fadeUp} className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Study Aesthetic</h2>
          <p className="text-xl text-gray-600">Beautiful spaces that inspire learning</p>
        </motion.div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-7xl mx-auto px-4">
          {studyImages.map((src, i) => (
            <motion.div key={i} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }} whileHover={{ scale: 1.05 }} className="relative overflow-hidden rounded-xl shadow-md">
              <img src={src} alt="" className="w-full h-40 object-cover" loading="lazy"/>
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 hover:opacity-100 transition-opacity"/>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Collage CTA */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 grid grid-cols-2 md:grid-cols-4 grid-rows-1 h-full">
          {collageImages.map((src, i) => (
            <div key={i} className="relative w-full h-full">
              <img src={src} alt={`Collage ${i + 1}`} className="w-full h-full object-cover"/>
            </div>
          ))}
        </div>
        <div className="absolute inset-0 bg-black/40"/>
        <div className="relative z-10 text-center text-white px-4">
          <h2 className="text-4xl font-bold mb-4">Make Every Study Session Count</h2>
          <p className="text-xl mb-8">Join thousands of students turning study time into success stories.</p>
          <Link to="/study-buddy">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              className="bg-white text-blue-600 px-12 py-4 rounded-full text-lg font-semibold shadow-lg">
              Get Started Free
            </motion.button>
          </Link>
        </div>
      </section>
    </div>
  );
}
