
import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Star, MessageSquare, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

const Wishes: React.FC = () => {
  const wishesRef = useRef<HTMLDivElement>(null);
  const [activeWish, setActiveWish] = useState<number | null>(null);
  const [showSpecialWish, setShowSpecialWish] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('.reveal-animation');
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  const handleWishClick = (index: number) => {
    setActiveWish(activeWish === index ? null : index);
    
    // Trigger confetti on special wish
    if (index === 2) {
      triggerHeartConfetti();
    }
  };

  const triggerHeartConfetti = () => {
    const end = Date.now() + 2000;
    const colors = ['#FF84B7', '#B892FF', '#FFD700'];

    const frame = () => {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0.3, y: 0.6 },
        shapes: ['heart'],
        colors: colors
      });
      
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 0.7, y: 0.6 },
        shapes: ['heart'],
        colors: colors
      });
      
      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    
    frame();
  };

  const fadeInVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({ 
      opacity: 1, 
      y: 0,
      transition: { 
        delay: i * 0.2,
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1] 
      }
    })
  };

  const wishes = [
    {
      title: "Untuk Kebahagiaan",
      icon: <Heart className="w-5 h-5 text-birthday-pink" />,
      short: "Semoga kebahagiaanmu berlimpah seperti senyummu yang selalu menerangi hariku.",
      long: "Setiap hari aku bersyukur melihat senyummu yang indah. Senyum itu adalah cahaya dalam hidupku. Di hari istimewa ini, aku berdoa semoga kebahagiaanmu akan terus berlimpah, seperti senyummu yang selalu menerangi hari-hariku. Aku berharap bisa menjadi sumber kebahagiaanmu, seperti kamu telah menjadi sumber kebahagiaanku.",
      color: "from-birthday-pink-light/20 to-birthday-pink-light/5",
      border: "border-birthday-pink-light"
    },
    {
      title: "Untuk Impianmu",
      icon: <Star className="w-5 h-5 text-birthday-gold" />,
      short: "Semoga setiap langkahmu dipenuhi keberhasilan dan ketenangan.",
      long: "Aku percaya kamu memiliki bintang yang bersinar dalam dirimu. Semoga setiap langkah yang kamu ambil dalam hidupmu dipenuhi dengan keberhasilan, ketenangan, dan pencapaian impian. Aku akan selalu ada untuk mendukungmu, dalam suka maupun duka, karena melihatmu bahagia adalah kebahagiaanku juga.",
      color: "from-birthday-gold/20 to-birthday-gold/5",
      border: "border-birthday-gold/40"
    },
    {
      title: "Untuk Kita Berdua",
      icon: <MessageSquare className="w-5 h-5 text-birthday-purple" />,
      short: "Semoga kita selalu bersama untuk merayakan hari spesialmu di tahun-tahun mendatang.",
      long: "Hari ini, besok, dan seterusnya, aku ingin menjadi orang yang merayakan setiap momen specialmu. Semoga kita selalu bersama, tumbuh bersama, dan saling mencintai lebih dalam setiap harinya. Aku berjanji untuk selalu ada di sampingmu, menjagamu, dan membuatmu bahagia. Terima kasih telah menjadi bagian terindah dalam hidupku.",
      color: "from-birthday-purple-light/20 to-birthday-purple-light/5",
      border: "border-birthday-purple-light"
    }
  ];

  return (
    <section className="py-20 px-4 relative overflow-hidden bg-white" id="wishes">
      <div className="absolute -top-20 -left-20 w-52 h-52 bg-birthday-pink-light/30 rounded-full blur-3xl"></div>
      <div className="absolute top-40 -right-40 w-80 h-80 bg-birthday-purple-light/30 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-20 left-20 w-60 h-60 bg-birthday-gold/10 rounded-full blur-3xl"></div>
      
      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          ref={wishesRef} 
          className="luxury-card rounded-2xl p-8 md:p-12 text-center shadow-xl magical-border"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="inline-block mb-6 rounded-full px-4 py-1.5 text-sm border border-birthday-pink-light/30 text-birthday-pink bg-birthday-pink/5 backdrop-blur-sm"
          >
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Harapan & Doa <Sparkles className="w-3 h-3" />
            </span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-3xl md:text-4xl font-dancing mb-8 luxury-text-gradient reveal-animation"
          >
            Harapanku Untukmu
          </motion.h2>
          
          <div className="space-y-6 mb-10">
            {wishes.map((wish, index) => (
              <motion.div 
                key={index}
                custom={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInVariants}
                className={`p-5 rounded-lg bg-gradient-to-br ${wish.color} backdrop-blur-sm border ${wish.border} shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer`}
                onClick={() => handleWishClick(index)}
              >
                <div className="flex items-center gap-2 mb-2">
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: 10 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    {wish.icon}
                  </motion.div>
                  <h3 className="font-medium text-gray-800">{wish.title}</h3>
                </div>
                
                <AnimatePresence>
                  {activeWish === index ? (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-gray-700 text-left overflow-hidden"
                    >
                      <p className="leading-relaxed mb-2">{wish.short}</p>
                      <p className="text-sm text-gray-600 leading-relaxed">{wish.long}</p>
                    </motion.div>
                  ) : (
                    <p className="text-gray-700 text-left">{wish.short}</p>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
          
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
            whileHover={{ 
              scale: 1.05, 
              boxShadow: "0 0 15px rgba(255, 132, 183, 0.5)" 
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowSpecialWish(!showSpecialWish)}
            className="bg-gradient-to-r from-birthday-pink to-birthday-purple text-white py-2.5 px-6 rounded-full font-medium shadow-md transition-all duration-300"
          >
            Lihat Harapan Spesial
          </motion.button>
          
          <AnimatePresence>
            {showSpecialWish && (
              <motion.div 
                initial={{ opacity: 0, y: 20, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: 20, height: 0 }}
                transition={{ duration: 0.5 }}
                className="mt-8 p-6 rounded-lg bg-gradient-to-br from-birthday-gold/20 to-birthday-gold/5 border border-birthday-gold/30"
              >
                <h3 className="text-2xl font-dancing text-birthday-gold mb-4">Pesan Spesial</h3>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  Di hari ulang tahunmu yang istimewa ini, aku ingin kamu tahu betapa berartinya dirimu untukku. 
                  Setiap hari bersamamu adalah anugerah, dan aku berharap kita bisa melewati banyak hari-hari
                  istimewa lainnya bersama. Terima kasih telah menjadi bagian terindah dalam kisah hidupku.
                </p>
                
                <div className="flex justify-center mt-6">
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      rotate: [0, 5, -5, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse",
                    }}
                  >
                    <svg width="60" height="60" viewBox="0 0 24 24" className="text-birthday-pink">
                      <path
                        fill="currentColor"
                        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                      />
                    </svg>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-12"
          >
            <p className="font-dancing text-2xl luxury-text-gradient">Dengan penuh cinta,</p>
            <p className="font-dancing text-xl text-gray-700 mt-2">Yang Mencintaimu</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Wishes;
