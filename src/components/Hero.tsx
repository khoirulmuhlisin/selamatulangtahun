import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FloatingElements from './FloatingElements';
import { useToast } from "@/components/ui/use-toast";
import confetti from 'canvas-confetti';
import { Sparkles, Heart } from 'lucide-react';

interface HeroProps {
  name: string;
}

const Hero: React.FC<HeroProps> = ({ name }) => {
  const textRef = useRef<HTMLHeadingElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const [showMagicEffect, setShowMagicEffect] = useState(false);
  const [showLoveQuote, setShowLoveQuote] = useState(false);
  const { toast } = useToast();
  
  const loveQuotes = [
    "Cinta itu seperti angin, tidak bisa kita lihat tapi bisa kita rasakan.",
    "Bersamamu, setiap detik terasa lebih berarti.",
    "Cinta bukan tentang seberapa lama kau mengenal seseorang, tapi tentang seseorang yang membuatmu tersenyum sejak kau mengenalnya.",
    "Aku mencintaimu bukan karena siapa dirimu, melainkan karena siapa diriku saat bersamamu.",
    "Cinta adalah ketika kebahagiaan orang lain lebih penting daripada kebahagiaanmu sendiri."
  ];

  const showRandomLoveQuote = () => {
    const randomQuote = loveQuotes[Math.floor(Math.random() * loveQuotes.length)];
    setShowLoveQuote(true);
    toast({
      title: "❤️ Quote Cinta",
      description: randomQuote,
      duration: 7000,
    });
    
    triggerHeartConfetti();
  };

  const triggerHeartConfetti = () => {
    const end = Date.now() + 3000;
    const colors = ['#FF84B7', '#FF6B95', '#B892FF'];
    
    const drawHeart = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, color: string) => {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(x + width / 2, y + height / 5);
      ctx.bezierCurveTo(
        x + width / 2, y, 
        x, y, 
        x, y + height / 3
      );
      ctx.bezierCurveTo(
        x, y + height / 1.5, 
        x + width / 2, y + height, 
        x + width / 2, y + height
      );
      ctx.bezierCurveTo(
        x + width / 2, y + height, 
        x + width, y + height / 1.5, 
        x + width, y + height / 3
      );
      ctx.bezierCurveTo(
        x + width, y, 
        x + width / 2, y, 
        x + width / 2, y + height / 5
      );
      ctx.closePath();
      ctx.fill();
    };
    
    const frame = () => {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors,
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
    };
    
    frame();
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      
      const { clientX, clientY } = e;
      const rect = heroRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 30;
      const rotateY = (centerX - x) / 30;
      
      heroRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    };
    
    const handleMouseLeave = () => {
      if (!heroRef.current) return;
      heroRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    };
    
    const element = heroRef.current;
    if (element) {
      element.addEventListener('mousemove', handleMouseMove);
      element.addEventListener('mouseleave', handleMouseLeave);
    }
    
    return () => {
      if (element) {
        element.removeEventListener('mousemove', handleMouseMove);
        element.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            triggerHeartConfetti();
            setTimeout(() => setShowMagicEffect(true), 2000);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (textRef.current) {
      observer.observe(textRef.current);
    }

    return () => {
      if (textRef.current) {
        observer.unobserve(textRef.current);
      }
    };
  }, []);

  return (
    <section className="min-h-screen relative flex flex-col items-center justify-center overflow-hidden romantic-gradient px-4">
      <div className="absolute inset-0 z-0 parallax-bg"></div>
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent to-black/10"></div>
      
      <div className="absolute inset-0 z-0 overflow-hidden">
        {[...Array(20)].map((_, index) => (
          <motion.div
            key={index}
            className="absolute text-birthday-pink/10"
            initial={{ 
              x: Math.random() * 100 + "%", 
              y: Math.random() * 100 + "%",
              scale: Math.random() * 0.5 + 0.5
            }}
            animate={{
              y: [
                Math.random() * 100 + "%",
                Math.random() * 100 + "%",
                Math.random() * 100 + "%"
              ],
              x: [
                Math.random() * 100 + "%",
                Math.random() * 100 + "%",
                Math.random() * 100 + "%"
              ],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: Math.random() * 20 + 20,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <Heart fill="#FF84B7" size={Math.random() * 40 + 20} />
          </motion.div>
        ))}
      </div>
      
      <div className="stars-container absolute inset-0 z-0"></div>
      
      <FloatingElements />
      
      <motion.div 
        ref={heroRef}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ 
          duration: 1.2, 
          ease: [0.16, 1, 0.3, 1],
          type: "spring",
          stiffness: 100
        }}
        className="luxury-card rounded-2xl p-8 md:p-12 max-w-3xl mx-auto text-center z-10 shadow-2xl transform-gpu transition-all duration-300"
        whileHover={{ 
          boxShadow: "0 25px 50px -12px rgba(255, 132, 183, 0.4)",
          scale: 1.02
        }}
      >
        <AnimatePresence>
          {showMagicEffect && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none"
            >
              <div className="magic-sparkles"></div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="inline-block mb-4 rounded-full px-3 py-1 text-xs md:text-sm border border-birthday-pink-light text-birthday-pink bg-white/70 backdrop-blur-sm"
        >
          <span className="flex items-center gap-1">
            <Heart className="w-3 h-3" fill="#FF84B7" /> Untuk Cinta Sejatiku <Heart className="w-3 h-3" fill="#FF84B7" />
          </span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          ref={textRef} 
          className="text-4xl md:text-6xl font-dancing mb-6 font-bold reveal-animation luxury-text-gradient"
        >
          I Love You ❤️ ,
        </motion.h1>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ 
            delay: 0.7, 
            duration: 1,
            type: "spring",
            damping: 8
          }}
          className="relative mb-6"
        >
          <motion.h2 
            className="text-3xl md:text-5xl font-dancing reveal-animation text-birthday-gold"
            animate={{ 
              textShadow: [
                "0 0 10px rgba(255,215,0,0.7), 0 0 20px rgba(255,215,0,0.5)", 
                "0 0 15px rgba(255,215,0,0.9), 0 0 30px rgba(255,215,0,0.7)", 
                "0 0 10px rgba(255,215,0,0.7), 0 0 20px rgba(255,215,0,0.5)"
              ]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            {name}!
          </motion.h2>
          <motion.div 
            className="absolute -inset-4 rounded-full pointer-events-none"
            animate={{
              background: [
                "radial-gradient(circle, rgba(255,132,183,0.2) 0%, rgba(255,132,183,0) 70%)",
                "radial-gradient(circle, rgba(255,132,183,0.3) 0%, rgba(255,132,183,0) 70%)",
                "radial-gradient(circle, rgba(255,132,183,0.2) 0%, rgba(255,132,183,0) 70%)"
              ]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
        </motion.div>
        
        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="text-base md:text-lg text-gray-700 mb-8 leading-relaxed max-w-2xl mx-auto reveal-animation"
        >
          Setiap detak jantungku berbisik namamu. Setiap langkah yang kulalui, selalu ada bayanganmu. 
          Kau adalah alasan aku tersenyum di pagi hari dan mimpi indahku di malam hari.
        </motion.p>
        
        <motion.button
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.8 }}
          whileHover={{ 
            scale: 1.05, 
            boxShadow: "0 0 25px rgba(255, 132, 183, 0.8)",
            background: "linear-gradient(45deg, #FF84B7, #FF6B95, #B892FF)" 
          }}
          whileTap={{ scale: 0.95 }}
          className="relative overflow-hidden bg-gradient-to-r from-birthday-pink to-birthday-purple text-white py-3 px-8 rounded-full font-medium shadow-xl hover:shadow-2xl transition-all duration-300 group"
          onClick={showRandomLoveQuote}
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            <Heart className="w-4 h-4" fill="white" />
            <span>Kata-Kata Cinta</span>
            <Heart className="w-4 h-4" fill="white" />
          </span>
          <motion.span 
            className="absolute inset-0 bg-gradient-to-r from-birthday-purple to-birthday-pink opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          />
          <motion.span 
            className="absolute -inset-1 rounded-full blur-xl bg-gradient-to-r from-birthday-pink/40 to-birthday-purple/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          />
        </motion.button>
        
        <motion.div 
          className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-birthday-pink"
          animate={{ 
            scale: [1, 1.2, 1, 1.2, 1],
            filter: [
              'drop-shadow(0 0 0px rgba(255,132,183,0.8))',
              'drop-shadow(0 0 5px rgba(255,132,183,0.8))',
              'drop-shadow(0 0 0px rgba(255,132,183,0.8))',
              'drop-shadow(0 0 5px rgba(255,132,183,0.8))',
              'drop-shadow(0 0 0px rgba(255,132,183,0.8))'
            ]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            repeatType: "loop"
          }}
        >
          <Heart fill="#FF84B7" size={32} />
        </motion.div>
      </motion.div>
      
      <motion.div 
        className="absolute bottom-10 left-0 right-0 flex justify-center animate-bounce"
        whileHover={{ scale: 1.2, y: -5 }}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="glow-effect-svg">
          <path d="M12 5V19M12 19L5 12M12 19L19 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </motion.div>
    </section>
  );
};

export default Hero;
