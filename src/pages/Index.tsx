
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Hero from '../components/Hero';
import MemoryGallery from '../components/MemoryGallery';
import Wishes from '../components/Wishes';
import Footer from '../components/Footer';
import MusicPlayer from '../components/MusicPlayer';
import { Sparkles, Gift, Cake, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';

const Index: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [currentSection, setCurrentSection] = useState<string>('hero');
  const [hasShownConfetti, setHasShownConfetti] = useState(false);
  
  // Updated memory images with romantic photos
  const memories = [
    {
      src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1740&auto=format&fit=crop",
      description: "Saat pertama kali kita bertemu, duniaku menjadi lebih berwarna."
    },
    {
      src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1740&auto=format&fit=crop",
      description: "Ingat waktu kita jalan-jalan di pantai dan tertawa sepanjang hari?"
    },
    {
      src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1740&auto=format&fit=crop",
      description: "Makan es krim favorit kita di tempat biasa."
    },
    {
      src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1740&auto=format&fit=crop",
      description: "Bersamamu selalu terasa begitu indah."
    },
    {
      src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1740&auto=format&fit=crop",
      description: "Menemukan kafe tersembunyi ini adalah petualangan kecil kita."
    },
    {
      src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1740&auto=format&fit=crop",
      description: "Hari di mana kita menghabiskan waktu berjam-jam berbincang di taman kota."
    }
  ];

  // Launch confetti
  const launchConfetti = () => {
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    const colors = ['#FF84B7', '#FFB6D9', '#B892FF', '#D9BBFF', '#FFD700'];

    (function frame() {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      });
      
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  };

  // Magical cursor effect
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [showMagic, setShowMagic] = useState(false);
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useEffect(() => {
    // Update document title
    document.title = "Selamat Ulang Tahun!";

    // Add smooth scrolling behavior to the entire document
    document.documentElement.style.scrollBehavior = 'smooth';

    // Handle splash screen
    const timer = setTimeout(() => {
      setShowSplash(false);
      setTimeout(() => {
        if (!hasShownConfetti) {
          launchConfetti();
          setHasShownConfetti(true);
        }
      }, 500);
    }, 3000);

    // Scroll reveal animation
    const handleScroll = () => {
      const reveals = document.querySelectorAll('.reveal-animation');
      
      reveals.forEach((reveal) => {
        const windowHeight = window.innerHeight;
        const elementTop = reveal.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < windowHeight - elementVisible) {
          reveal.classList.add('active');
        }
      });
      
      // Update current section based on scroll position
      const sections = ['hero', 'memories', 'wishes'];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setCurrentSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Trigger on initial load
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, [hasShownConfetti]);

  // Smooth scroll function
  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Icons for navigation
  const sectionIcons: Record<string, React.ReactNode> = {
    'hero': <Cake size={14} />,
    'memories': <Heart size={14} />,
    'wishes': <Gift size={14} />
  };

  // Section transition variants
  const sectionVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.8,
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div 
      className="min-h-screen bg-white overflow-hidden"
      onMouseDown={() => setShowMagic(true)}
      onMouseUp={() => setShowMagic(false)}
    >
      {/* Magical cursor effect */}
      {showMagic && (
        <motion.div
          className="fixed z-50 pointer-events-none"
          style={{ 
            left: cursorPosition.x - 15,
            top: cursorPosition.y - 15,
          }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <div className="relative">
            <motion.div
              className="absolute inset-0 rounded-full bg-birthday-pink/20 blur-md"
              initial={{ scale: 1 }}
              animate={{ scale: 2, opacity: 0 }}
              transition={{ duration: 0.8, repeat: Infinity }}
            />
            <motion.div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white"
              animate={{ 
                rotate: [0, 360],
                background: [
                  'radial-gradient(circle, rgba(255,132,183,1) 0%, rgba(184,146,255,1) 100%)',
                  'radial-gradient(circle, rgba(184,146,255,1) 0%, rgba(255,132,183,1) 100%)',
                  'radial-gradient(circle, rgba(255,132,183,1) 0%, rgba(184,146,255,1) 100%)'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Heart size={12} fill="white" />
            </motion.div>
          </div>
        </motion.div>
      )}
      
      {/* Splash Screen */}
      <AnimatePresence>
        {showSplash && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-birthday-pink/90 to-birthday-purple/90"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.2, opacity: 0 }}
              transition={{ 
                duration: 0.8, 
                type: "spring", 
                stiffness: 100 
              }}
              className="text-center"
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 2,
                  repeat: 1,
                  repeatType: "reverse" 
                }}
              >
                <Sparkles className="w-16 h-16 text-white mb-4 mx-auto" />
              </motion.div>
              <motion.h1 
                className="text-4xl md:text-7xl font-dancing text-white font-bold mb-4 text-3d"
                animate={{ 
                  y: [0, -10, 0],
                  textShadow: [
                    "0 0 10px rgba(255,255,255,0.5)", 
                    "0 0 20px rgba(255,255,255,0.8)", 
                    "0 0 10px rgba(255,255,255,0.5)"
                  ]
                }}
                transition={{ 
                  duration: 2,
                  repeat: 1,
                  repeatType: "reverse" 
                }}
              >
                Selamat Ulang Tahun
              </motion.h1>
              <motion.div 
                className="w-32 h-1 bg-white mx-auto mb-4 rounded-full"
                animate={{ 
                  width: ["0%", "80%"],
                  opacity: [0, 1]
                }}
                transition={{ duration: 1 }}
              />
              <motion.p 
                className="text-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                Memuat kejutan untukmu...
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Enhanced background music player with updated song list */}
      <MusicPlayer autoPlay={!showSplash} />
      
      {/* Navigation dots with labels on hover */}
      <div className="fixed right-4 top-1/2 transform -translate-y-1/2 z-40 hidden md:block">
        <div className="flex flex-col gap-3">
          {['hero', 'memories', 'wishes'].map((section) => (
            <motion.div
              key={section}
              className="relative group"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * ['hero', 'memories', 'wishes'].indexOf(section) }}
            >
              <motion.button
                onClick={() => scrollToSection(section)}
                className={`w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 ${
                  currentSection === section 
                    ? 'bg-birthday-pink text-white scale-110' 
                    : 'bg-white/80 text-birthday-pink hover:bg-birthday-pink-light hover:text-white'
                } shadow-md`}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
              >
                {sectionIcons[section]}
              </motion.button>
              
              <motion.div 
                className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-full mr-2 px-2 py-1 bg-white/90 backdrop-blur-sm rounded shadow text-xs capitalize whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ marginRight: "8px" }}
              >
                {section}
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
      
      <motion.div 
        id="hero"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <Hero name="Sayang" />
      </motion.div>
      
      <motion.div 
        id="memories"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <MemoryGallery images={memories} />
      </motion.div>
      
      <motion.div 
        id="wishes"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <Wishes />
      </motion.div>
      
      <Footer />
    </div>
  );
};

export default Index;
