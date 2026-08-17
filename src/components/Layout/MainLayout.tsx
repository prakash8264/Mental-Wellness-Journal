import React from 'react';
import { useLocation, useOutlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/Navbar/Navbar';
import { MobileNav } from '@/components/Navigation/MobileNav';

export const MainLayout: React.FC = () => {
  const location = useLocation();
  const outlet = useOutlet();

  return (
    <div className="min-h-screen flex flex-col bg-(--bg-cream) text-(--text) transition-colors duration-300">
      {/* Top Floating Navbar (Matches LearnHub screenshot) */}
      <Navbar />

      {/* Main Content Container */}
      <div className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 pb-24 lg:pb-12">
        <main className="w-full h-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="w-full h-full"
            >
              {outlet}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <MobileNav />
    </div>
  );
};
